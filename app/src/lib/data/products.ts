import type { Product } from "@/lib/types";
import { NUEVOS_MENUS } from "./menus.ts";

// Sinforosa conserva su menú de referencia; los demás locales están en menus.ts.

export const PRODUCTS: Product[] = [
  // ── Sinforosa ─────────────────────────────────────────────
  {
    id: "sin-chilaquiles",
    image: "/menu/chilaquiles.jpg",
    vendorId: "sinforosa",
    name: "Chilaquiles",
    description: "Totopos bañados en salsa, crema, queso fresco y cebolla.",
    price: 75,
    emoji: "🥘",
    section: "Desayunos",
    popular: true,
    options: [
      {
        id: "salsa",
        name: "Salsa",
        type: "single",
        required: true,
        choices: [
          { id: "verde", name: "Verde", price: 0 },
          { id: "roja", name: "Roja", price: 0 },
          { id: "divorciados", name: "Divorciados", price: 0 },
        ],
      },
      {
        id: "proteina",
        name: "Proteína",
        type: "single",
        required: true,
        choices: [
          { id: "sin", name: "Sin proteína", price: 0 },
          { id: "huevo", name: "Huevo estrellado", price: 12 },
          { id: "pollo", name: "Pollo deshebrado", price: 18 },
        ],
      },
    ],
  },
  {
    id: "sin-molletes",
    vendorId: "sinforosa",
    name: "Molletes",
    description: "Bolillo con frijoles, queso gratinado y pico de gallo.",
    price: 55,
    emoji: "🥖",
    section: "Desayunos",
    options: [
      {
        id: "extras",
        name: "Extras",
        type: "multi",
        required: false,
        choices: [
          { id: "chorizo", name: "Chorizo", price: 15 },
          { id: "jamon", name: "Jamón", price: 12 },
        ],
      },
    ],
  },
  {
    id: "sin-enchiladas",
    image: "/menu/enchiladas.jpg",
    vendorId: "sinforosa",
    name: "Enchiladas suizas",
    description: "Tres enchiladas de pollo con salsa verde cremosa y queso gratinado.",
    price: 85,
    emoji: "🌯",
    section: "Comida",
    popular: true,
  },
  {
    id: "sin-tacos",
    image: "/menu/tacos.jpg",
    vendorId: "sinforosa",
    name: "Tacos de guisado (3)",
    description: "Tortilla hecha a mano con el guisado del día.",
    price: 60,
    emoji: "🌮",
    section: "Comida",
    options: [
      {
        id: "guisado",
        name: "Guisado",
        type: "single",
        required: true,
        choices: [
          { id: "chicharron", name: "Chicharrón en salsa", price: 0 },
          { id: "tinga", name: "Tinga de pollo", price: 0 },
          { id: "rajas", name: "Rajas con crema", price: 0 },
        ],
      },
    ],
  },
  {
    id: "sin-torta",
    image: "/menu/torta.jpg",
    vendorId: "sinforosa",
    name: "Torta de milanesa",
    description: "Milanesa de res, aguacate, frijoles, jitomate y chipotle.",
    price: 70,
    emoji: "🥪",
    section: "Comida",
  },
  {
    id: "sin-quesadillas",
    vendorId: "sinforosa",
    name: "Quesadillas (2)",
    description: "Tortilla de maíz con queso Oaxaca.",
    price: 50,
    emoji: "🫓",
    section: "Comida",
  },
  {
    id: "sin-agua",
    vendorId: "sinforosa",
    name: "Agua fresca",
    description: "Preparada al día. 500 ml.",
    price: 25,
    emoji: "🥤",
    section: "Bebidas",
    options: [
      {
        id: "sabor",
        name: "Sabor",
        type: "single",
        required: true,
        choices: [
          { id: "jamaica", name: "Jamaica", price: 0 },
          { id: "horchata", name: "Horchata", price: 0 },
          { id: "limon", name: "Limón con chía", price: 0 },
        ],
      },
    ],
  },
  {
    id: "sin-cafe",
    image: "/menu/americano.jpg",
    vendorId: "sinforosa",
    name: "Café de olla",
    description: "Con piloncillo y canela.",
    price: 25,
    emoji: "☕",
    section: "Bebidas",
  },

  ...NUEVOS_MENUS,
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getVendorProducts(vendorId: string): Product[] {
  return PRODUCTS.filter((p) => p.vendorId === vendorId);
}
