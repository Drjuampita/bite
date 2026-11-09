import type { CartItem } from "@/lib/types";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function money(n: number): string {
  return mxn.format(n);
}

export function unitPrice(item: Pick<CartItem, "basePrice" | "options">): number {
  return item.basePrice + item.options.reduce((sum, o) => sum + o.price, 0);
}

export function lineTotal(item: CartItem): number {
  return unitPrice(item) * item.quantity;
}

export function itemsSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + lineTotal(i), 0);
}

export function itemsCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function optionsSummary(item: Pick<CartItem, "options" | "note">): string {
  const parts = item.options.map((o) => o.choiceName);
  if (item.note) parts.push(`“${item.note}”`);
  return parts.join(" · ");
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
