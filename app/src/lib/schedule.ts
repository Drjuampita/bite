import { DELIVERY_SLOTS, MIN_LEAD_MINUTES, SCHEDULE_CUTOFF } from "@/lib/data/campus";
import type { DeliverySlot, Vendor } from "@/lib/types";

// Reglas de disponibilidad: cuándo se puede pedir "Ahora" y qué bloques se pueden agendar.

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function isWeekday(d: Date): boolean {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function nextBusinessDay(d: Date): Date {
  let next = addDays(d, 1);
  while (!isWeekday(next)) next = addDays(next, 1);
  return next;
}

export interface Availability {
  available: boolean;
  reason?: string;
  /** Lugares que le quedan al local en esa hora de clase. */
  remaining?: number;
}

/** ¿El local acepta pedidos "Ahora" en este momento? */
export function vendorOpenNow(vendor: Vendor, now: Date, demoMode: boolean): Availability {
  if (demoMode) return { available: true };
  if (!isWeekday(now)) return { available: false, reason: "Cerrado en fin de semana" };
  const m = minutesOfDay(now);
  if (m < toMinutes(vendor.hours.open)) {
    return { available: false, reason: `Abre a las ${vendor.hours.open}` };
  }
  // Se deja de aceptar "Ahora" 20 minutos antes del cierre.
  if (m > toMinutes(vendor.hours.close) - 20) {
    return { available: false, reason: "Ya cerró por hoy" };
  }
  return { available: true };
}

export interface ScheduleDay {
  date: string;
  kind: "hoy" | "manana";
  label: string;
}

/** Días que se pueden agendar: hoy (si es día hábil) y el siguiente día hábil. */
export function scheduleDays(now: Date, demoMode: boolean): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  if (demoMode || isWeekday(now)) {
    days.push({ date: toISODate(now), kind: "hoy", label: "Hoy" });
  }
  const next = demoMode ? addDays(now, 1) : nextBusinessDay(now);
  const isTomorrow = toISODate(next) === toISODate(addDays(now, 1));
  days.push({
    date: toISODate(next),
    kind: "manana",
    label: isTomorrow ? "Mañana" : capitalize(formatWeekday(next)),
  });
  return days;
}

/**
 * ¿Se puede agendar este bloque, en esta fecha, con este local?
 * `taken` es cuántos pedidos agendados ya tiene el local en ese bloque.
 */
export function slotAvailability(
  vendor: Vendor,
  slot: DeliverySlot,
  date: string,
  now: Date,
  demoMode: boolean,
  taken = 0,
): Availability {
  const timing = slotTiming(vendor, slot, date, now, demoMode);
  if (!timing.available) return timing;
  const remaining = Math.max(0, vendor.capacityPerSlot - taken);
  return remaining > 0 ? { available: true, remaining } : { available: false, reason: "Lleno", remaining: 0 };
}

function slotTiming(
  vendor: Vendor,
  slot: DeliverySlot,
  date: string,
  now: Date,
  demoMode: boolean,
): Availability {
  const start = toMinutes(slot.start);
  // El local debe estar abierto durante la preparación (30 min antes) y la entrega.
  if (start - 30 < toMinutes(vendor.hours.open) || toMinutes(slot.end) > toMinutes(vendor.hours.close)) {
    return { available: false, reason: "Fuera de horario" };
  }

  const today = toISODate(now);
  if (date === today) {
    if (start - minutesOfDay(now) < MIN_LEAD_MINUTES) {
      return { available: false, reason: "Ya no da tiempo" };
    }
    return { available: true };
  }

  // Para días siguientes: se agenda hasta la hora de corte del día anterior.
  const isNextDay = date === toISODate(addDays(now, 1));
  if (!demoMode && isNextDay && minutesOfDay(now) >= toMinutes(SCHEDULE_CUTOFF)) {
    return { available: false, reason: `Corte a las ${SCHEDULE_CUTOFF}` };
  }
  return { available: true };
}

export function availableSlots(
  vendor: Vendor,
  date: string,
  now: Date,
  demoMode: boolean,
  load: Record<string, number> = {},
) {
  return DELIVERY_SLOTS.map((slot) => ({
    slot,
    ...slotAvailability(vendor, slot, date, now, demoMode, load[slot.id] ?? 0),
  }));
}

// ── Formato de fechas ─────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatWeekday(d: Date): string {
  return d.toLocaleDateString("es-MX", { weekday: "long" });
}

export function formatShortDate(iso: string): string {
  return fromISODate(iso).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** "Hoy", "Mañana" o "jue 12 nov". */
export function relativeDayLabel(iso: string, now: Date = new Date()): string {
  if (iso === toISODate(now)) return "Hoy";
  if (iso === toISODate(addDays(now, 1))) return "Mañana";
  return formatShortDate(iso);
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
}
