import type { DeliverySlot } from "@/lib/types";

// Bloques de entrega: el pedido llega en los 15 minutos previos al inicio de clase.
// Ejemplo. Ajustar a los horarios reales de la universidad.
export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: "s0700", label: "7:00", start: "06:45", end: "07:00" },
  { id: "s0900", label: "9:00", start: "08:45", end: "09:00" },
  { id: "s1100", label: "11:00", start: "10:45", end: "11:00" },
  { id: "s1300", label: "13:00", start: "12:45", end: "13:00" },
  { id: "s1500", label: "15:00", start: "14:45", end: "15:00" },
  { id: "s1700", label: "17:00", start: "16:45", end: "17:00" },
];

// Edificios y salones de ejemplo. Reemplazar con los del campus.
export const BUILDINGS: { id: string; name: string; rooms: string[] }[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
].map((letter) => ({
  id: letter,
  name: `Edificio ${letter}`,
  rooms: [1, 2, 3].flatMap((floor) =>
    [1, 2, 3, 4, 5, 6].map((n) => `${letter}-${floor}0${n}`),
  ),
}));

export const DELIVERY_FEE = 10;

/** Hora límite (del día anterior) para agendar pedidos. */
export const SCHEDULE_CUTOFF = "21:00";

/** Minutos mínimos de anticipación para agendar un bloque del mismo día. */
export const MIN_LEAD_MINUTES = 45;

export function getSlot(id?: string): DeliverySlot | undefined {
  return DELIVERY_SLOTS.find((s) => s.id === id);
}
