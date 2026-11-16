import type { CartItem, Product, SelectedOption } from "@/lib/types";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/**
 * Convierte la selección de un producto en opciones con precio. En los grupos con opciones
 * incluidas, las primeras N elegidas no cuestan y cada una adicional cuesta `extraPrice`.
 */
export function priceOptions(product: Product, picks: { groupId: string; choiceId: string }[]): SelectedOption[] {
  const used: Record<string, number> = {};
  const out: SelectedOption[] = [];
  for (const pick of picks) {
    const group = product.options?.find((g) => g.id === pick.groupId);
    const choice = group?.choices.find((c) => c.id === pick.choiceId);
    if (!group || !choice) continue;
    const n = (used[group.id] = (used[group.id] ?? 0) + 1);
    const extra = group.included !== undefined && n > group.included ? (group.extraPrice ?? 0) : 0;
    out.push({ groupId: group.id, groupName: group.name, choiceId: choice.id, choiceName: choice.name, price: choice.price + extra });
  }
  return out;
}

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
