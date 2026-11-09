"use client";

import { useSyncExternalStore } from "react";
import { DELIVERY_FEE } from "@/lib/data/campus";
import { itemsSubtotal } from "@/lib/format";
import { canCancel, generateId, generateOrderCode, isActive, lastChange, nextStatus } from "@/lib/orders";
import type {
  Cart,
  CartItem,
  DeliveryLocation,
  Order,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  Settings,
  User,
} from "@/lib/types";

// Estado de la app para el MVP: vive en el navegador (localStorage) y se sincroniza entre
// pestañas, así la vista del local y la del alumno se actualizan en vivo durante la demo.
// Cada acción de este archivo corresponde a una operación futura contra Supabase.

const STORAGE_KEY = "bite:v1";

interface PersistedState {
  user: User | null;
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

export function placeOrder(input: PlaceOrderInput): Order | null {
  const { cart, user } = state;
  if (!cart || !user || cart.items.length === 0) return null;
  const now = Date.now();
  const subtotal = itemsSubtotal(cart.items);
  const status: OrderStatus = input.mode === "agendado" ? "programado" : "recibido";
  const order: Order = {
    id: generateId("ord"),
    code: generateOrderCode(),
    userId: user.id,
    userName: user.name,
    vendorId: cart.vendorId,
    items: cart.items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    ...input,
    status,
    history: [{ status, at: now }],
    createdAt: now,
  };
  setState((s) => ({ orders: [order, ...s.orders], cart: null }));
  return order;
}

export function setOrderStatus(orderId: string, status: OrderStatus) {
  setState((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId && o.status !== status
        ? { ...o, status, history: [...o.history, { status, at: Date.now() }] }
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
  setState((s) => ({ ...INITIAL, user: s.user, hydrated: true }));
}

/** Segundos entre cada cambio de estado simulado de un pedido "Ahora". */
const SIMULATION_STEP_MS = 12_000;

/** Avanza los pedidos "Ahora" activos. Lo llama el componente <Simulator />. */
export function tickSimulation() {
  if (!state.settings.simulate) return;
  const now = Date.now();
  const due = state.orders.filter(
    (o) => o.mode === "ahora" && isActive(o) && now - lastChange(o) >= SIMULATION_STEP_MS,
  );
  due.forEach((o) => advanceOrder(o.id));
}
