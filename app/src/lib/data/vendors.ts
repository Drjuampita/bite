import type { Category, Vendor } from "@/lib/types";

// Datos de ejemplo. Reemplazar con la información real de cada local del campus.
export const VENDORS: Vendor[] = [
  {
    id: "sinforosa",
    name: "Sinforosa",
    tagline: "Comida mexicana y desayunos",
    emoji: "🌮",
    cover: "from-orange-400 to-amber-300",
    categories: ["Desayunos", "Comida"],
    rating: 4.8,
    prepTime: "15–20 min",
    hours: { open: "06:30", close: "17:00" },
    place: "Cafetería central",
    capacityPerSlot: 15,
  },
  {
    id: "luka",
    name: "Luka",
    tagline: "Café de especialidad y opciones saludables",
    emoji: "☕",
    cover: "from-emerald-500 to-lime-300",
    categories: ["Café", "Saludable", "Desayunos"],
    rating: 4.9,
    prepTime: "5–10 min",
    hours: { open: "06:30", close: "21:00" },
    place: "Junto a biblioteca",
    capacityPerSlot: 20,
  },
  {
    id: "diegos-house",
    name: "Diego's House",
    tagline: "Hamburguesas, boneless y sándwiches",
    emoji: "🍔",
    cover: "from-rose-500 to-orange-300",
    categories: ["Comida"],
    rating: 4.7,
    prepTime: "15–25 min",
    hours: { open: "10:00", close: "21:00" },
    place: "Zona de comida",
    capacityPerSlot: 12,
  },
  {
    id: "carrusel",
    name: "Carrusel",
    tagline: "Crepas, snacks y postres",
    emoji: "🎠",
    cover: "from-fuchsia-500 to-pink-300",
    categories: ["Snacks", "Postres"],
    rating: 4.6,
    prepTime: "10–15 min",
    hours: { open: "08:00", close: "18:00" },
    place: "Explanada",
    capacityPerSlot: 10,
  },
];

export const CATEGORIES: { name: Category; emoji: string }[] = [
  { name: "Desayunos", emoji: "🍳" },
  { name: "Comida", emoji: "🍽️" },
  { name: "Café", emoji: "☕" },
  { name: "Saludable", emoji: "🥗" },
  { name: "Snacks", emoji: "🍿" },
  { name: "Postres", emoji: "🍫" },
];

export function getVendor(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id);
}
