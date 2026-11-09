import type { DeliveryLocation, DeliverySlot } from "@/lib/types";

// ── Edificios ─────────────────────────────────────────────
// Anáhuac Querétaro. Los salones se nombran edificio + piso + número de salón (2 dígitos):
// C204 = edificio C, piso 2, salón 4. Igual para ABI (ABI305) e IDEA (IDEA102).

export interface Building {
  id: string;
  name: string;
  floors: number;
  /** Datos por confirmar. */
  pending?: boolean;
}

export const BUILDINGS: Building[] = [
  { id: "A", name: "Edificio A", floors: 2 },
  { id: "B", name: "Edificio B", floors: 2 },
  { id: "C", name: "Edificio C", floors: 4 },
  { id: "IDEA", name: "IDEA", floors: 2, pending: true }, // Pisos por confirmar.
  { id: "ABI", name: "ABI", floors: 6 },
];

/** Salones por piso. Provisional: ajustar cuando se conozca el número real. */
export const ROOMS_PER_FLOOR = 10;

export function getBuilding(id?: string): Building | undefined {
  return BUILDINGS.find((b) => b.id === id);
}

export function roomCode(buildingId: string, floor: number, room: number): string {
  return `${buildingId}${floor}${String(room).padStart(2, "0")}`;
}

/** "C204" → { building: "C", floor: 2, room: 4 }. */
export function parseRoom(code: string): { building: string; floor: number; room: number } | null {
  const ids = BUILDINGS.map((b) => b.id).sort((a, b) => b.length - a.length).join("|");
  const match = new RegExp(`^(${ids})(\\d)(\\d{2})$`).exec(code.toUpperCase());
  if (!match) return null;
  const building = getBuilding(match[1]);
  const floor = Number(match[2]);
  const room = Number(match[3]);
  if (!building || floor < 1 || floor > building.floors || room < 1) return null;
  return { building: building.id, floor, room };
}

/** "Edificio C · Piso 2". */
export function describeLocation(location: DeliveryLocation): string {
  const building = getBuilding(location.building);
  const parsed = parseRoom(location.room);
  return [building?.name ?? location.building, parsed && `Piso ${parsed.floor}`].filter(Boolean).join(" · ");
}

// ── Bloques de entrega ────────────────────────────────────
// Las clases van de 7:00 a 22:00. Supuesto: empiezan en punto cada hora (la última a las 21:00).
// El pedido llega en los 15 minutos previos al inicio de la clase.

const pad = (n: number) => String(n).padStart(2, "0");

export const DELIVERY_SLOTS: DeliverySlot[] = Array.from({ length: 21 - 7 + 1 }, (_, i) => {
  const hour = 7 + i;
  return {
    id: `s${pad(hour)}00`,
    label: formatClock(`${pad(hour)}:00`),
    start: `${pad(hour - 1)}:45`,
    end: `${pad(hour)}:00`,
  };
});

export function getSlot(id?: string): DeliverySlot | undefined {
  return DELIVERY_SLOTS.find((s) => s.id === id);
}

/** "13:00" → "1:00 pm". */
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? "am" : "pm"}`;
}

/** Ventana de entrega legible: "8:45–9:00 am" o "11:45 am–12:00 pm". */
export function slotWindow(slot: DeliverySlot): string {
  const [startTime, startSuffix] = formatClock(slot.start).split(" ");
  const [endTime, endSuffix] = formatClock(slot.end).split(" ");
  return startSuffix === endSuffix
    ? `${startTime}–${endTime} ${endSuffix}`
    : `${startTime} ${startSuffix}–${endTime} ${endSuffix}`;
}

// ── Reglas de negocio ─────────────────────────────────────

export const DELIVERY_FEE = 10;

/** Hora límite (del día anterior) para agendar pedidos. */
export const SCHEDULE_CUTOFF = "21:00";

/** Minutos mínimos de anticipación para agendar un bloque del mismo día. */
export const MIN_LEAD_MINUTES = 45;
