"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState, PageHeader, RequireUser } from "@/components/shell";
import { ButtonLink } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { DELIVERY_FEE } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { itemsSubtotal, lineTotal, money, optionsSummary } from "@/lib/format";
import { clearCart, updateQuantity, useBite } from "@/lib/store";

export default function CarritoPage() {
  return (
    <RequireUser>
      <Carrito />
    </RequireUser>
  );
}

function Carrito() {
  const { cart } = useBite();

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <PageHeader title="Tu carrito" backHref="/inicio" />
        <EmptyState
          emoji="🛍️"
          title="Tu carrito está vacío"
          message="Explora los locales del campus y agrega lo que se te antoje."
          action={<ButtonLink href="/inicio">Ver locales</ButtonLink>}
        />
      </>
    );
  }

  const vendor = getVendor(cart.vendorId)!;
  const subtotal = itemsSubtotal(cart.items);

  return (
    <>
      <PageHeader
        title="Tu carrito"
        right={
          <button type="button" onClick={clearCart} className="text-sm font-semibold text-muted">
            Vaciar
          </button>
        }
      />
      <main className="flex-1 px-4 pt-4 pb-32">
        <Link href={`/local/${vendor.id}`} className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card ring-1 ring-line/60">
          <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${vendor.cover}`}>
            {vendor.emoji}
          </span>
          <div className="flex-1">
            <p className="font-bold">{vendor.name}</p>
            <p className="text-xs text-muted">{vendor.place}</p>
          </div>
        </Link>

        <ul className="mt-4 divide-y divide-line rounded-card bg-white shadow-card ring-1 ring-line/60">
          {cart.items.map((item) => (
            <li key={item.lineId} className="flex gap-3 p-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl" aria-hidden="true">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{item.name}</p>
                {optionsSummary(item) && <p className="text-xs text-muted">{optionsSummary(item)}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    removable
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.lineId, q)}
                  />
                  <span className="font-bold">{money(lineTotal(item))}</span>
                </div>
              </div>
            </li>
          ))}
          <li>
            <Link href={`/local/${vendor.id}`} className="flex items-center gap-2 p-4 text-sm font-semibold text-brand-600">
              <Plus className="size-4" /> Agregar más productos
            </Link>
          </li>
        </ul>

        <dl className="mt-4 space-y-2 rounded-card bg-white p-5 text-sm shadow-card ring-1 ring-line/60">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Envío a tu salón</dt>
            <dd className="font-semibold">{money(DELIVERY_FEE)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-extrabold">{money(subtotal + DELIVERY_FEE)}</dd>
          </div>
        </dl>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <ButtonLink href="/checkout" size="lg" block>
          Continuar · {money(subtotal + DELIVERY_FEE)}
        </ButtonLink>
      </div>
    </>
  );
}
