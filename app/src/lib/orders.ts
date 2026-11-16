import { PREP_WINDOW_MINUTES, getSlot, slotWindow } from "@/lib/data/campus";
import { fromISODate, relativeDayLabel, toMinutes } from "@/lib/schedule";
import type { Order, OrderStatus } from "@/lib/types";

// Máquina de estados del pedido.
//   programado* → recibido → preparando → listo → en_camino → entregado
//   (programado | recibido) → cancelado
//   * solo pedidos agendados

export const STATUS_FLOW: OrderStatus[] = [
  "recibido",
  "preparando",
  "listo",
  "en_camino",
  "entregado",
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; description: string; tone: "neutral" | "brand" | "success" | "danger" }
> = {
  programado: {
    label: "Programado",
    description: "Tu pedido está agendado. El local lo prepara antes de tu bloque.",
    tone: "neutral",
  },
  recibido: {
    label: "Recibido",
    description: "El local recibió tu pedido.",
    tone: "brand",
  },
  preparando: {
    label: "Preparando",
    description: "Están preparando tu comida.",
    tone: "brand",
  },
  listo: {
    label: "Listo",
    description: "Tu pedido está listo y espera al repartidor.",
    tone: "brand",
  },
  en_camino: {
    label: "En camino",
    description: "Va directo a tu salón.",
    tone: "brand",
  },
  entregado: {
    label: "Entregado",
    description: "¡Buen provecho!",
    tone: "success",
  },
  cancelado: {
    label: "Cancelado",
    description: "Este pedido fue cancelado.",
    tone: "danger",
  },
};

export function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === "programado") return "recibido";
  const i = STATUS_FLOW.indexOf(status);
  if (i === -1 || i === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1];
}

export function isActive(order: Order): boolean {
  return order.status !== "entregado" && order.status !== "cancelado";
}

export function canCancel(order: Order): boolean {
  return order.status === "programado" || order.status === "recibido";
}

export function lastChange(order: Order): number {
  return order.history[order.history.length - 1]?.at ?? order.createdAt;
}

/** "Mañana · 8:45–9:00 am" para agendados; "Lo antes posible" para pedidos inmediatos en curso. */
export function deliveryLabel(order: Order, now: Date = new Date()): string {
  if (order.mode === "ahora") {
    return isActive(order) ? "Lo antes posible" : relativeDayLabel(order.deliveryDate, now);
  }
  const slot = getSlot(order.slotId);
  const day = relativeDayLabel(order.deliveryDate, now);
  return slot ? `${day} · ${slotWindow(slot)}` : day;
}

/** Pedidos agendados (no cancelados) que ya tiene un local por hora de clase en una fecha. */
export function slotLoad(orders: Order[], vendorId: string, date: string): Record<string, number> {
  const load: Record<string, number> = {};
  for (const o of orders) {
    if (o.vendorId !== vendorId || o.mode !== "agendado" || o.deliveryDate !== date) continue;
    if (o.status === "cancelado" || !o.slotId) continue;
    load[o.slotId] = (load[o.slotId] ?? 0) + 1;
  }
  return load;
}

/** Momento en que un pedido agendado pasa a la cocina: PREP_WINDOW_MINUTES antes de la clase. */
export function activationTime(order: Order): number | null {
  const slot = getSlot(order.slotId);
  if (order.mode !== "agendado" || !slot) return null;
  const day = fromISODate(order.deliveryDate);
  day.setMinutes(toMinutes(slot.end) - PREP_WINDOW_MINUTES);
  return day.getTime();
}

/**
 * Número de pedido visible para todos (local, repartidor y alumno). Es distinto del código de
 * entrega, que solo ve el alumno y que el repartidor le pide para confirmar la entrega.
 */
export function orderRef(order: Pick<Order, "id">): string {
  return order.id.slice(-4).toUpperCase();
}

export function generateOrderCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
