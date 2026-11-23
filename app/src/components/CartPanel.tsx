"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { DELIVERY_FEE } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { itemsSubtotal, lineTotal, money, optionsSummary } from "@/lib/format";
import { updateQuantity, useBite } from "@/lib/store";

/** Carrito fijo a un lado del menú en computadora; en teléfono se usa la barra flotante (CartBar). */
export function CartPanel() {
  const { cart } = useBite();
  const empty = !cart || cart.items.length === 0;
  const vendor = cart ? getVendor(cart.vendorId) : undefined;
  const subtotal = cart ? itemsSubtotal(cart.items) : 0;

  return (
    <aside
      aria-label="Tu pedido"
      className="sticky top-24 hidden max-h-[calc(100dvh-7.5rem)] flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-line/60 lg:flex"
    >
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-lg font-bold">Tu pedido</h2>
        {!empty && <p className="text-xs text-muted">{vendor?.name}</p>}
      </div>

      {empty ? (
        <div className="px-6 py-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-500">
            <ShoppingBag className="size-6" />
          </span>
          <p className="mt-4 text-sm font-bold">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-muted">Elige algo del menú y aparecerá aquí.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line overflow-y-auto">
            {cart.items.map((item) => (
              <li key={item.lineId} className="px-5 py-3.5">
                <div className="flex justify-between gap-3">
                  <p className="text-sm font-bold">{item.name}</p>
                  <span className="text-sm font-bold">{money(lineTotal(item))}</span>
                </div>
                {optionsSummary(item) && <p className="mt-0.5 text-xs text-muted">{optionsSummary(item)}</p>}
                <div className="mt-2">
                  <QuantityStepper
                    size="sm"
                    removable
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.lineId, q)}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-5">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Envío a tu salón</dt>
                <dd className="font-semibold">{money(DELIVERY_FEE)}</dd>
              </div>
            </dl>
            <ButtonLink href="/checkout" size="lg" block className="mt-4">
              Continuar · {money(subtotal + DELIVERY_FEE)}
            </ButtonLink>
          </div>
        </>
      )}
    </aside>
  );
}
