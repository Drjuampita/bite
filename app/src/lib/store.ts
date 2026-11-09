"use client";

import { useSyncExternalStore } from "react";
import { DELIVERY_FEE, getSlot } from "@/lib/data/campus";
import { getProduct } from "@/lib/data/products";
import { DEMO_STAFF_PIN } from "@/lib/data/staff";
import { getVendor } from "@/lib/data/vendors";
import { itemsSubtotal } from "@/lib/format";
import {
  activationTime,
  canCancel,
  generateId,
  generateOrderCode,
  isActive,
  lastChange,
  nextStatus,
  slotLoad,
} from "@/lib/orders";
import { slotAvailability, toISODate, vendorOpenNow } from "@/lib/schedule";
import type {
  Cart,
  CartItem,
  DeliveryLocation,
  Order,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  Settings,
  StaffSession,
  User,
} from "@/lib/types";

// Estado de la app para el MVP: vive en el navegador (localStorage) y se sincroniza entre
// pestañas, así la vista del local y la del alumno se actualizan en vivo durante la demo.
// Cada acción de este archivo corresponde a una operación futura contra Supabase.

const STORAGE_KEY = "bite:v2";

interface PersistedState {
  user: User | null;
  staff: StaffSession | null;
  cart: Cart | null;
  orders: Order[];
  settings: Settings;
  /** Productos que el local marcó como agotados. */
  unavailable: string[];
}

export interface BiteState extends PersistedState {
  hydrated: boolean;
}

const INITIAL: BiteState = {
  user: null,
  staff: null,
  cart: null,
  orders: [],
  settings: { demoMode: true, simulate: true },
  unavailable: [],
  hydrated: false,
};

let state: BiteState = INITIAL;
const listeners = new Set<() => void>();

function parse(raw: string | null): Partial<PersistedState> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

function load() {
  let stored: Partial<PersistedState> = {};
  try {
    stored = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Almacenamiento bloqueado (modo privado): la app funciona sin persistencia.
  }
  state = {
    ...INITIAL,
    ...stored,
    settings: { ...INITIAL.settings, ...stored.settings },
    hydrated: true,
  };
}

if (typeof window !== "undefined") {
  load();
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    load();
    listeners.forEach((l) => l());
  });
}

function persist() {
  const data: PersistedState = {
    user: state.user,
    staff: state.staff,
    cart: state.cart,
    orders: state.orders,
    settings: state.settings,
    unavailable: state.unavailable,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignorar: sin persistencia.
  }
}

function setState(update: (s: BiteState) => Partial<BiteState>) {
  state = { ...state, ...update(state) };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): BiteState {
  return state;
}

export function useBite(): BiteState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL,
  );
}

// ── Sesión ────────────────────────────────────────────────

export function login(name: string, email: string) {
  const existing = state.user;
  setState(() => ({
    user: {
      id: existing?.email === email ? existing.id : generateId("usr"),
      name,
      email,
      role: "alumno",
      defaultLocation: existing?.email === email ? existing.defaultLocation : undefined,
    },
  }));
}

export function logout() {
  setState(() => ({ user: null, cart: null }));
}

/** Acceso del personal. En el MVP se valida un PIN de demostración. */
export function staffLogin(session: StaffSession, pin: string): boolean {
  if (pin !== DEMO_STAFF_PIN) return false;
  setState(() => ({ staff: session }));
  return true;
}

export function staffLogout() {
  setState(() => ({ staff: null }));
}

export function setDefaultLocation(location: DeliveryLocation) {
  setState((s) => (s.user ? { user: { ...s.user, defaultLocation: location } } : {}));
}

// ── Carrito ───────────────────────────────────────────────

/** Agrega una línea. Si el carrito es de otro local, se reemplaza (la UI pide confirmación antes). */
export function addToCart(vendorId: string, item: Omit<CartItem, "lineId">) {
  setState((s) => {
    const base: Cart = s.cart && s.cart.vendorId === vendorId ? s.cart : { vendorId, items: [] };
    const sameLine = base.items.find(
      (i) =>
        i.productId === item.productId &&
        (i.note ?? "") === (item.note ?? "") &&
        JSON.stringify(i.options) === JSON.stringify(item.options),
    );
    const items = sameLine
      ? base.items.map((i) =>
          i === sameLine ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      : [...base.items, { ...item, lineId: generateId("ln") }];
    return { cart: { vendorId, items } };
  });
}

export function updateQuantity(lineId: string, quantity: number) {
  setState((s) => {
    if (!s.cart) return {};
    const items =
      quantity <= 0
        ? s.cart.items.filter((i) => i.lineId !== lineId)
        : s.cart.items.map((i) => (i.lineId === lineId ? { ...i, quantity } : i));
    return { cart: items.length ? { ...s.cart, items } : null };
  });
}

export function clearCart() {
  setState(() => ({ cart: null }));
}

/** Vuelve a cargar al carrito los productos de un pedido anterior. */
export function reorder(order: Order) {
  setState((s) => ({
    cart: {
      vendorId: order.vendorId,
      items: order.items
        .filter((i) => !s.unavailable.includes(i.productId))
        .map((i) => ({ ...i, lineId: generateId("ln") })),
    },
  }));
}

// ── Pedidos ───────────────────────────────────────────────

export interface PlaceOrderInput {
  mode: OrderMode;
  deliveryDate: string;
  slotId?: string;
  location: DeliveryLocation;
  payment: PaymentMethod;
  note?: string;
}

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; error: string };

/**
 * Crea el pedido aplicando las mismas reglas que aplicará el servidor (función crear_pedido en
 * supabase/migrations): precios tomados del catálogo, productos disponibles, local abierto,
 * hora de clase válida y con lugar.
 */
export function placeOrder(input: PlaceOrderInput): PlaceOrderResult {
  const { cart, user, settings, unavailable, orders } = state;
  if (!cart || !user || cart.items.length === 0) return { ok: false, error: "Tu carrito está vacío." };
  const vendor = getVendor(cart.vendorId);
  if (!vendor) return { ok: false, error: "Este local ya no existe." };

  const items: CartItem[] = [];
  for (const item of cart.items) {
    const product = getProduct(item.productId);
    if (!product || product.vendorId !== vendor.id || unavailable.includes(product.id)) {
      return { ok: false, error: `${item.name} ya no está disponible. Quítalo del carrito.` };
    }
    // El precio se recalcula desde el catálogo, no se confía en el que trae el carrito.
    const options = item.options.map((o) => {
      const choice = product.options?.find((g) => g.id === o.groupId)?.choices.find((c) => c.id === o.choiceId);
      return { ...o, price: choice?.price ?? 0 };
    });
    items.push({ ...item, basePrice: product.price, options });
  }

  const now = new Date();
  if (input.mode === "ahora") {
    const open = vendorOpenNow(vendor, now, settings.demoMode);
    if (!open.available) return { ok: false, error: `${vendor.name} no recibe pedidos inmediatos ahora.` };
  } else {
    const slot = getSlot(input.slotId);
    if (!slot) return { ok: false, error: "Elige la hora de tu clase." };
    const taken = slotLoad(orders, vendor.id, input.deliveryDate)[slot.id] ?? 0;
    const availability = slotAvailability(vendor, slot, input.deliveryDate, now, settings.demoMode, taken);
    if (!availability.available) {
      return {
        ok: false,
        error:
          availability.reason === "Lleno"
            ? "Esa hora se acaba de llenar. Elige otra."
            : "Esa hora ya no está disponible. Elige otra.",
      };
    }
  }

  const createdAt = now.getTime();
  const subtotal = itemsSubtotal(items);
  const status: OrderStatus = input.mode === "agendado" ? "programado" : "recibido";
  const order: Order = {
    id: generateId("ord"),
    code: generateOrderCode(),
    userId: user.id,
    userName: user.name,
    vendorId: vendor.id,
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    ...input,
    deliveryDate: input.mode === "ahora" ? toISODate(now) : input.deliveryDate,
    slotId: input.mode === "agendado" ? input.slotId : undefined,
    status,
    history: [{ status, at: createdAt }],
    createdAt,
  };
  setState((s) => ({ orders: [order, ...s.orders], cart: null }));
  return { ok: true, order };
}

export function setOrderStatus(orderId: string, status: OrderStatus, patch: Partial<Order> = {}) {
  setState((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId && o.status !== status
        ? { ...o, ...patch, status, history: [...o.history, { status, at: Date.now() }] }
        : o,
    ),
  }));
}

export function advanceOrder(orderId: string) {
  const order = state.orders.find((o) => o.id === orderId);
  const next = order && nextStatus(order.status);
  if (next) setOrderStatus(orderId, next);
}

export function cancelOrder(orderId: string) {
  const order = state.orders.find((o) => o.id === orderId);
  if (order && canCancel(order)) setOrderStatus(orderId, "cancelado");
}

// ── Repartidor ────────────────────────────────────────────

/** El repartidor toma un pedido listo y sale a entregarlo. */
export function takeOrder(orderId: string, runnerName: string) {
  const order = state.orders.find((o) => o.id === orderId);
  if (order?.status === "listo") setOrderStatus(orderId, "en_camino", { runnerName });
}

/** Se marca como entregado solo si el código coincide con el que ve el alumno en su app. */
export function deliverOrder(orderId: string, code: string): boolean {
  const order = state.orders.find((o) => o.id === orderId);
  if (order?.status !== "en_camino" || order.code !== code.trim()) return false;
  setOrderStatus(orderId, "entregado");
  return true;
}

export function rateOrder(orderId: string, stars: number, comment?: string) {
  setState((s) => ({
    orders: s.orders.map((o) => (o.id === orderId ? { ...o, rating: { stars, comment } } : o)),
  }));
}

// ── Local ─────────────────────────────────────────────────

export function toggleProductAvailability(productId: string) {
  setState((s) => ({
    unavailable: s.unavailable.includes(productId)
      ? s.unavailable.filter((id) => id !== productId)
      : [...s.unavailable, productId],
  }));
}

// ── Demo ──────────────────────────────────────────────────

export function updateSettings(patch: Partial<Settings>) {
  setState((s) => ({ settings: { ...s.settings, ...patch } }));
}

export function resetDemo() {
  setState((s) => ({ ...INITIAL, user: s.user, staff: s.staff, hydrated: true }));
}

/** Segundos entre cada cambio de estado simulado de un pedido "Ahora". */
const SIMULATION_STEP_MS = 12_000;
const SIMULATED_RUNNER = "Repartidor Bite";

/**
 * Tareas en segundo plano (las llama <BackgroundJobs /> cada pocos segundos):
 * 1. Pasa a la cocina los pedidos agendados cuya hora de preparación ya llegó.
 *    En producción lo hará la función activar_pedidos_programados() con pg_cron.
 * 2. En modo presentación, avanza solos los pedidos "Ahora".
 */
export function tickBackgroundJobs() {
  const now = Date.now();
  for (const o of state.orders) {
    const at = o.status === "programado" ? activationTime(o) : null;
    if (at !== null && now >= at) setOrderStatus(o.id, "recibido");
  }

  if (!state.settings.simulate) return;
  const due = state.orders.filter(
    (o) => o.mode === "ahora" && isActive(o) && now - lastChange(o) >= SIMULATION_STEP_MS,
  );
  for (const o of due) {
    if (o.status === "listo") setOrderStatus(o.id, "en_camino", { runnerName: SIMULATED_RUNNER });
    else advanceOrder(o.id);
  }
}
