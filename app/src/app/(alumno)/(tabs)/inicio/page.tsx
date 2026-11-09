"use client";

import { CalendarClock, ChevronRight, MapPin, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartBar } from "@/components/CartBar";
import { SectionTitle } from "@/components/shell";
import { VendorCard } from "@/components/VendorCard";
import { CATEGORIES, VENDORS, getVendor } from "@/lib/data/vendors";
import { firstName, money } from "@/lib/format";
import { STATUS_META, deliveryLabel, isActive } from "@/lib/orders";
import { reorder, useBite } from "@/lib/store";
import type { Category } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export default function InicioPage() {
  const { user, orders } = useBite();
  const router = useRouter();
  const now = useNow();
  const [category, setCategory] = useState<Category | null>(null);

  const mine = orders.filter((o) => o.userId === user?.id);
  const active = mine.find(isActive);
  const lastDelivered = mine.filter((o) => o.status === "entregado").slice(0, 3);
  const vendors = category ? VENDORS.filter((v) => v.categories.includes(category)) : VENDORS;

  return (
    <main className="flex-1">
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-sm text-muted">Hola, {firstName(user?.name ?? "")} 👋</p>
          <h1 className="text-2xl font-extrabold tracking-tight">¿Qué se te antoja?</h1>
        </div>
        <Link
          href="/perfil"
          className="flex max-w-[45%] items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold shadow-sm ring-1 ring-line"
        >
          <MapPin className="size-4 shrink-0 text-brand-500" />
          <span className="truncate">{user?.defaultLocation ? `Salón ${user.defaultLocation.room}` : "Elige tu salón"}</span>
        </Link>
      </header>

      <div className="mt-5 px-5">
        {active ? (
          <Link
            href={`/pedido/${active.id}`}
            className="flex items-center gap-4 rounded-card bg-ink p-4 text-white shadow-card"
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${getVendor(active.vendorId)?.cover}`}>
              {getVendor(active.vendorId)?.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/60">Tu pedido de {getVendor(active.vendorId)?.name}</p>
              <p className="truncate font-bold">{STATUS_META[active.status].label}</p>
              <p className="truncate text-xs text-white/70">{deliveryLabel(active, now)} · Salón {active.location.room}</p>
            </div>
            <ChevronRight className="size-5 text-white/60" />
          </Link>
        ) : (
          <div className="relative overflow-hidden rounded-card bg-brand-500 p-5 text-white">
            <div className="absolute -right-10 -bottom-12 size-40 rounded-full bg-white/10" aria-hidden="true" />
            <CalendarClock className="size-7" />
            <p className="mt-3 text-lg leading-tight font-extrabold">
              Agenda hoy tu comida
              <br /> de mañana
            </p>
            <p className="mt-1 max-w-[16rem] text-sm text-white/85">
              Elige el bloque de tu clase y llega a tu salón justo a tiempo.
            </p>
          </div>
        )}
      </div>

      <nav aria-label="Categorías" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-5">
        <CategoryChip label="Todo" emoji="✨" active={!category} onClick={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.name}
            label={c.name}
            emoji={c.emoji}
            active={category === c.name}
            onClick={() => setCategory(category === c.name ? null : c.name)}
          />
        ))}
      </nav>

      {lastDelivered.length > 0 && !category && (
        <section className="mt-7">
          <SectionTitle>Pedir de nuevo</SectionTitle>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {lastDelivered.map((o) => {
              const v = getVendor(o.vendorId);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    reorder(o);
                    router.push("/carrito");
                  }}
                  className="flex w-56 shrink-0 items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-line"
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-xl ${v?.cover}`}>
                    {v?.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{o.items.map((i) => i.name).join(", ")}</span>
                    <span className="block text-xs text-muted">
                      {v?.name} · {money(o.total)}
                    </span>
                  </span>
                  <RotateCcw className="size-4 shrink-0 text-brand-500" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-7">
        <SectionTitle action={<span className="text-sm text-muted">{vendors.length} locales</span>}>
          Locales en el campus
        </SectionTitle>
        <div className="space-y-4 px-5">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </section>

      <CartBar aboveNav />
      <div className="h-20" />
    </main>
  );
}

function CategoryChip({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
        active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line"
      }`}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}
