import type { Category, Vendor } from "@/lib/types";

// Locales candidatos del campus. Horarios y cupos de referencia hasta firmar convenio.
export const VENDORS: Vendor[] = [
  {
    id: "starbucks",
    name: "Starbucks",
    tagline: "Café, cake pops y baguettes",
    emoji: "☕",
    cover: "from-emerald-600 to-emerald-300",
    image: "/menu/cover_starbucks.jpg",
    categories: ["Café", "Postres", "Snacks"],
    rating: 4.8,
    prepTime: "5–10 min",
    hours: { open: "07:00", close: "20:00" },
    place: "Edificio Liderazgo",
    capacityPerSlot: 20,
  },
  {
    id: "luka",
    name: "Luka Poke",
    tagline: "Bowls de poke: de la casa o arma el tuyo",
    emoji: "🥗",
    cover: "from-emerald-500 to-lime-300",
    image: "/menu/cover_luka.jpg",
    categories: ["Saludable", "Comida"],
    rating: 4.9,
    prepTime: "10–15 min",
    hours: { open: "10:00", close: "19:00" },
    place: "Zona de comida",
    capacityPerSlot: 15,
  },
  {
    id: "sinforosa",
    name: "Sinforosa",
    tagline: "Comida mexicana y desayunos",
    emoji: "🌮",
    cover: "from-orange-400 to-amber-300",
    image: "/menu/tacos.jpg",
    categories: ["Desayunos", "Comida"],
    rating: 4.8,
    prepTime: "15–20 min",
    hours: { open: "06:30", close: "17:00" },
    place: "Cafetería central",
    capacityPerSlot: 15,
  },
  {
    id: "tim-hortons",
    name: "Tim Hortons",
    tagline: "Café, Iced Capp, Timbits y donas",
    emoji: "🍩",
    cover: "from-red-600 to-rose-300",
    image: "/menu/tim_cafe.jpg",
    categories: ["Café", "Desayunos", "Postres"],
    rating: 4.7,
    prepTime: "5–10 min",
    hours: { open: "07:00", close: "20:00" },
    place: "Business & Innovation Hub",
    capacityPerSlot: 20,
  },
  {
    id: "vete-a-la-burger",
    name: "Vete a la Burger",
    tagline: "Hamburguesas, hot dogs, alitas y pizzas",
    emoji: "🍔",
    cover: "from-rose-500 to-orange-300",
    image: "/menu/cover_burger.jpg",
    categories: ["Comida", "Snacks"],
    rating: 4.7,
    prepTime: "15–25 min",
    hours: { open: "11:00", close: "20:00" },
    place: "Zona de comida",
    capacityPerSlot: 12,
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
