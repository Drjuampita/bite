// Modelo de dominio de Bite.
// Refleja el esquema de supabase/migrations para que el cambio a base de datos real sea directo.

export type Role = "alumno" | "local" | "repartidor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  defaultLocation?: DeliveryLocation;
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  /** Clases de Tailwind para el fondo de portada (placeholder hasta tener fotos). */
  cover: string;
  categories: Category[];
  rating: number;
  prepTime: string;
  /** Horario de operación en formato HH:mm (lunes a viernes). */
  hours: { open: string; close: string };
  place: string;
}

export type Category =
  | "Desayunos"
  | "Comida"
  | "Café"
  | "Saludable"
  | "Snacks"
  | "Postres";

export interface OptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  /** "single": elegir una (radio). "multi": elegir varias (checkbox). */
  type: "single" | "multi";
  required: boolean;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  section: string;
  popular?: boolean;
  options?: OptionGroup[];
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  /** Id único de la línea (mismo producto con distintas opciones = líneas distintas). */
  lineId: string;
  productId: string;
  name: string;
  emoji: string;
  basePrice: number;
  options: SelectedOption[];
  quantity: number;
  note?: string;
}

export interface Cart {
  vendorId: string;
  items: CartItem[];
}

export interface DeliverySlot {
  id: string;
  /** Hora de inicio de clase a la que llega el pedido, ej. "9:00". */
  label: string;
  /** Ventana de entrega HH:mm. */
  start: string;
  end: string;
}

export interface DeliveryLocation {
  building: string;
  room: string;
}

export type OrderMode = "ahora" | "agendado";

export type OrderStatus =
  | "programado"
  | "recibido"
  | "preparando"
  | "listo"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type PaymentMethod = "tarjeta" | "efectivo";

export interface Order {
  id: string;
  /** Código corto que el repartidor muestra al entregar. */
  code: string;
  userId: string;
  userName: string;
  vendorId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  mode: OrderMode;
  /** Fecha de entrega YYYY-MM-DD. */
  deliveryDate: string;
  slotId?: string;
  location: DeliveryLocation;
  payment: PaymentMethod;
  note?: string;
  status: OrderStatus;
  history: { status: OrderStatus; at: number }[];
  createdAt: number;
  rating?: { stars: number; comment?: string };
}

export interface Settings {
  /** Locales siempre abiertos y sin hora de corte, para presentar a cualquier hora. */
  demoMode: boolean;
  /** Avanza automáticamente los pedidos "Ahora" para mostrar el seguimiento. */
  simulate: boolean;
}
