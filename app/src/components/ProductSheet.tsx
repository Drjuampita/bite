"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Sheet } from "@/components/ui/Sheet";
import { money } from "@/lib/format";
import type { CartItem, Product, SelectedOption } from "@/lib/types";

interface ProductSheetProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (item: Omit<CartItem, "lineId">) => void;
}

export function ProductSheet({ product, onClose, onAdd }: ProductSheetProps) {
  return (
    <Sheet open={!!product} onClose={onClose} label={product?.name ?? "Producto"}>
      {/* La key reinicia el formulario cada vez que se abre un producto distinto. */}
      {product && <ProductForm key={product.id} product={product} onClose={onClose} onAdd={onAdd} />}
    </Sheet>
  );
}

function defaultSelection(product: Product): Record<string, string[]> {
  const sel: Record<string, string[]> = {};
  for (const group of product.options ?? []) {
    sel[group.id] = group.type === "single" && group.required ? [group.choices[0].id] : [];
  }
  return sel;
}

function ProductForm({ product, onClose, onAdd }: Required<Omit<ProductSheetProps, "product">> & { product: Product }) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const selected: SelectedOption[] = (product.options ?? []).flatMap((group) =>
    group.choices
      .filter((c) => selection[group.id]?.includes(c.id))
      .map((c) => ({
        groupId: group.id,
        groupName: group.name,
        choiceId: c.id,
        choiceName: c.name,
        price: c.price,
      })),
  );
  const unit = product.price + selected.reduce((s, o) => s + o.price, 0);
  const missingRequired = (product.options ?? []).some(
    (g) => g.required && (selection[g.id]?.length ?? 0) === 0,
  );

  function toggle(groupId: string, choiceId: string, type: "single" | "multi") {
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      if (type === "single") return { ...prev, [groupId]: [choiceId] };
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId],
      };
    });
  }

  function submit() {
    onAdd({
      productId: product.id,
      name: product.name,
      emoji: product.emoji,
      basePrice: product.price,
      options: selected,
      quantity,
      note: note.trim() || undefined,
    });
    onClose();
  }

  return (
    <>
      <div className="grid h-48 place-items-center bg-gradient-to-b from-brand-50 to-white text-[96px]" aria-hidden="true">
        {product.emoji}
      </div>
      <div className="px-5 pb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">{product.name}</h2>
        <p className="mt-1 text-sm text-muted">{product.description}</p>
        <p className="mt-3 text-lg font-bold">{money(product.price)}</p>

        {(product.options ?? []).map((group) => (
          <fieldset key={group.id} className="mt-6">
            <legend className="flex w-full items-center justify-between">
              <span className="font-bold">{group.name}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  group.required ? "bg-ink text-white" : "bg-canvas text-muted ring-1 ring-line"
                }`}
              >
                {group.required ? "Obligatorio" : "Opcional"}
              </span>
            </legend>
            <div className="mt-3 divide-y divide-line rounded-2xl ring-1 ring-line">
              {group.choices.map((choice) => {
                const checked = selection[group.id]?.includes(choice.id) ?? false;
                return (
                  <label key={choice.id} className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                    <input
                      type={group.type === "single" ? "radio" : "checkbox"}
                      name={`${product.id}-${group.id}`}
                      checked={checked}
                      onChange={() => toggle(group.id, choice.id, group.type)}
                      className="sr-only"
                    />
                    <span
                      className={`grid size-5 shrink-0 place-items-center border-2 transition ${
                        group.type === "single" ? "rounded-full" : "rounded-md"
                      } ${checked ? "border-brand-500 bg-brand-500 text-white" : "border-line bg-white"}`}
                    >
                      {checked && <Check className="size-3" strokeWidth={3.5} />}
                    </span>
                    <span className="flex-1 text-sm font-medium">{choice.name}</span>
                    {choice.price > 0 && <span className="text-sm text-muted">+{money(choice.price)}</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <label className="mt-6 block">
          <span className="font-bold">Instrucciones especiales</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={120}
            rows={2}
            placeholder="Ej. sin cebolla, salsa aparte…"
            className="mt-3 w-full resize-none rounded-2xl bg-canvas p-4 text-sm ring-1 ring-line outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-brand-500"
          />
        </label>
      </div>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button size="lg" className="flex-1" disabled={missingRequired} onClick={submit}>
          Agregar · {money(unit * quantity)}
        </Button>
      </div>
    </>
  );
}
