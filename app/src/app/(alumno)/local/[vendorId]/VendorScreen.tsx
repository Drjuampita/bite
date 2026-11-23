"use client";

import { ChevronLeft, Clock, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartBar } from "@/components/CartBar";
import { CartPanel } from "@/components/CartPanel";
import { ProductSheet } from "@/components/ProductSheet";
import { RequireUser } from "@/components/shell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { OpenPill, VendorCover, VendorMeta } from "@/components/VendorCard";
import { getVendorProducts } from "@/lib/data/products";
import { getVendor } from "@/lib/data/vendors";
import { money } from "@/lib/format";
import { addToCart, useBite } from "@/lib/store";
import type { CartItem, Product } from "@/lib/types";

export function VendorScreen({ vendorId }: { vendorId: string }) {
  return (
    <RequireUser>
      <VendorMenu vendorId={vendorId} />
    </RequireUser>
  );
}

function VendorMenu({ vendorId }: { vendorId: string }) {
  const vendor = getVendor(vendorId)!;
  const products = getVendorProducts(vendorId);
  const { cart, unavailable } = useBite();
  const [selected, setSelected] = useState<Product | null>(null);
  const [pending, setPending] = useState<Omit<CartItem, "lineId"> | null>(null);

  const sections = Array.from(new Set(products.map((p) => p.section)));
  const popular = products.filter((p) => p.popular && !unavailable.includes(p.id));
  const otherVendor = cart && cart.vendorId !== vendorId ? getVendor(cart.vendorId) : null;

  function handleAdd(item: Omit<CartItem, "lineId">) {
    if (otherVendor) setPending(item);
    else addToCart(vendorId, item);
  }

  return (
    <main className="flex-1 pb-28 lg:mx-auto lg:w-full lg:max-w-6xl lg:pb-16">
      <div className="relative lg:px-5 lg:pt-6">
        <VendorCover vendor={vendor} className="h-52 lg:h-72 lg:rounded-card" />
        <Link
          href="/inicio"
          aria-label="Regresar"
          className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-white text-ink shadow-md lg:top-10 lg:left-9"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </div>

      <section className="relative -mt-8 mx-4 lg:mx-10 lg:p-6 rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{vendor.name}</h1>
            <p className="text-sm text-muted">{vendor.tagline}</p>
          </div>
          <OpenPill vendor={vendor} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <VendorMeta vendor={vendor} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <MapPin className="size-3.5" /> {vendor.place}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <Clock className="size-3.5" /> {vendor.hours.open}–{vendor.hours.close}
          </span>
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 lg:px-5 lg:pt-6">
      <div className="min-w-0">
      <nav aria-label="Secciones del menú" className="no-scrollbar sticky top-0 z-20 mt-4 flex gap-2 overflow-x-auto bg-canvas/95 px-4 py-3 backdrop-blur lg:top-16 lg:mt-0 lg:px-0">
        {popular.length > 0 && <SectionLink id="populares" label="⭐ Populares" />}
        {sections.map((s) => (
          <SectionLink key={s} id={slug(s)} label={s} />
        ))}
      </nav>

      {popular.length > 0 && (
        <section id="populares" className="scroll-mt-16 pt-2 lg:scroll-mt-32">
          <h2 className="px-5 text-lg font-bold lg:px-0 lg:text-xl">Populares</h2>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-2 lg:px-0.5">
            {popular.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                className="w-36 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-line transition hover:shadow-md lg:w-44"
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-24 w-full object-cover lg:h-28" />
                ) : (
                  <span className="grid h-24 place-items-center bg-brand-50 text-5xl" aria-hidden="true">
                    {p.emoji}
                  </span>
                )}
                <span className="block p-3">
                  <span className="block truncate text-sm font-bold">{p.name}</span>
                  <span className="text-sm text-muted">{money(p.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {sections.map((section) => (
        <section key={section} id={slug(section)} className="scroll-mt-16 pt-6 lg:scroll-mt-32 lg:pt-8">
          <h2 className="px-5 text-lg font-bold lg:px-0 lg:text-xl">{section}</h2>
          <ul className="mt-2 divide-y divide-line lg:mt-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:divide-y-0">
            {products
              .filter((p) => p.section === section)
              .map((p) => (
                <li key={p.id}>
                  <ProductRow
                    product={p}
                    soldOut={unavailable.includes(p.id)}
                    onSelect={() => setSelected(p)}
                  />
                </li>
              ))}
          </ul>
        </section>
      ))}

      </div>
      <CartPanel />
      </div>

      <ProductSheet product={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
      <ConfirmDialog
        open={!!pending}
        title="¿Empezar un carrito nuevo?"
        message={`Tu carrito tiene productos de ${otherVendor?.name}. Cada pedido es de un solo local.`}
        confirmLabel={`Vaciar y agregar de ${vendor.name}`}
        onConfirm={() => {
          if (pending) addToCart(vendorId, pending);
          setPending(null);
        }}
        onCancel={() => setPending(null)}
      />
      <CartBar />
    </main>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

function SectionLink({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-line"
    >
      {label}
    </a>
  );
}

function ProductRow({
  product,
  soldOut,
  onSelect,
}: {
  product: Product;
  soldOut: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={soldOut}
      className="flex w-full items-center gap-4 px-5 py-4 text-left transition active:bg-black/[0.02] disabled:opacity-50 lg:h-full lg:rounded-2xl lg:bg-white lg:p-4 lg:ring-1 lg:ring-line lg:hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {product.name}
          {product.popular && !soldOut && (
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 align-middle text-[10px] font-bold text-brand-700">
              Popular
            </span>
          )}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted">{product.description}</p>
        <p className="mt-1.5 text-sm font-bold">{soldOut ? "Agotado" : money(product.price)}</p>
      </div>
      <div className="relative">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt="" className="size-20 rounded-2xl object-cover" />
        ) : (
          <span className="grid size-20 place-items-center rounded-2xl bg-brand-50 text-4xl" aria-hidden="true">
            {product.emoji}
          </span>
        )}
        {!soldOut && (
          <span className="absolute -right-1.5 -bottom-1.5 grid size-8 place-items-center rounded-full bg-white text-ink shadow-md ring-1 ring-line">
            <Plus className="size-4" />
          </span>
        )}
      </div>
    </button>
  );
}
