"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getVendor } from "@/lib/data/vendors";
import { itemsCount, itemsSubtotal, money } from "@/lib/format";
import { useBite } from "@/lib/store";

/** Barra flotante "Ver carrito". `aboveNav` la sube cuando hay barra de navegación inferior. */
export function CartBar({ aboveNav = false }: { aboveNav?: boolean }) {
  const { cart } = useBite();
  if (!cart || cart.items.length === 0) return null;
  const vendor = getVendor(cart.vendorId);

  return (
    <div
      className={`fixed inset-x-0 z-40 mx-auto max-w-[440px] px-4 ${
        aboveNav ? "bottom-[calc(4.5rem+env(safe-area-inset-bottom))]" : "bottom-[max(1rem,env(safe-area-inset-bottom))]"
      }`}
    >
      <Link
        href="/carrito"
        className="flex h-14 animate-fade-in items-center gap-3 rounded-full bg-brand-500 pr-5 pl-2 text-white shadow-float transition active:scale-[0.98]"
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-white/20">
          <ShoppingBag className="size-5" />
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-600">
            {itemsCount(cart.items)}
          </span>
        </span>
        <span className="flex-1 leading-tight">
          <span className="block text-sm font-bold">Ver carrito</span>
          <span className="block text-xs text-white/80">{vendor?.name}</span>
        </span>
        <span className="font-bold">{money(itemsSubtotal(cart.items))}</span>
      </Link>
    </div>
  );
}
