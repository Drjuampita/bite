"use client";

import { CalendarClock, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { OpsOrderCard } from "@/components/OpsOrderCard";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { DELIVERY_SLOTS, getSlot } from "@/lib/data/campus";
import { getVendorProducts } from "@/lib/data/products";
import { VENDORS } from "@/lib/data/vendors";
import { money } from "@/lib/format";
import { relativeDayLabel } from "@/lib/schedule";
import { advanceOrder, toggleProductAvailability, useBite } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";
import { useNow } from "@/lib/useNow";

const ACTIONS: Partial<Record<OrderStatus, string>> = {
  programado: "Pasar a cocina",
  recibido: "Empezar a preparar",
  preparando: "Marcar como listo",
};

export default function PanelPage() {
  const { orders, unavailable, hydrated } = useBite();
  const now = useNow();
  const [vendorId, setVendorId] = useState(VENDORS[0].id);
  const [tab, setTab] = useState<"pedidos" | "menu">("pedidos");

  const vendorOrders = orders.filter((o) => o.vendorId === vendorId);
  const byStatus = (s: OrderStatus) => vendorOrders.filter((o) => o.status === s);
  const scheduled = byStatus("programado").sort(scheduleOrder);
  const ready = [...byStatus("listo"), ...byStatus("en_camino")];
  const deliveredToday = vendorOrders.filter((o) => o.status === "entregado").length;

  // Agrupa los programados por día y bloque para que el local planee la producción.
  const groups = new Map<string, Order[]>();
  for (const o of scheduled) {
    const key = `${o.deliveryDate}|${o.slotId}`;
    groups.set(key, [...(groups.get(key) ?? []), o]);
  }

  return (
    <main className="pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">Panel del local</p>
          <h1 className="text-3xl font-extrabold tracking-tight">{VENDORS.find((v) => v.id === vendorId)?.name}</h1>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {VENDORS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVendorId(v.id)}
              aria-pressed={v.id === vendorId}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                v.id === vendorId ? "bg-ink text-white" : "bg-white ring-1 ring-line"
              }`}
            >
              <span aria-hidden="true">{v.emoji}</span> {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Nuevos" value={byStatus("recibido").length} highlight />
        <Stat label="En preparación" value={byStatus("preparando").length} />
        <Stat label="Programados" value={scheduled.length} />
        <Stat label="Entregados" value={deliveredToday} />
      </div>

      <div className="mt-6 max-w-sm">
        <Segmented
          label="Sección"
          value={tab}
          onChange={setTab}
          options={[
            { value: "pedidos", label: "Pedidos" },
            { value: "menu", label: "Menú y disponibilidad" },
          ]}
        />
      </div>

      {!hydrated ? null : tab === "pedidos" ? (
        <div className="mt-6 space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Column title="Nuevos" icon={<Zap className="size-4" />} orders={byStatus("recibido")} empty="Sin pedidos nuevos" />
            <Column title="Preparando" orders={byStatus("preparando")} empty="Nada en preparación" />
            <Column title="Listos / en camino" orders={ready} empty="Nada esperando repartidor" />
          </div>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CalendarClock className="size-5" /> Programados
            </h2>
            {groups.size === 0 ? (
              <p className="mt-2 text-sm text-muted">No hay pedidos agendados.</p>
            ) : (
              <div className="mt-3 space-y-5">
                {[...groups.entries()].map(([key, list]) => {
                  const [date, slotId] = key.split("|");
                  const slot = getSlot(slotId);
                  return (
                    <div key={key}>
                      <p className="mb-2 text-sm font-semibold">
                        {relativeDayLabel(date, now)} · bloque {slot?.label}{" "}
                        <span className="font-normal text-muted">
                          (entrega {slot?.start}–{slot?.end}) · {list.length} {list.length === 1 ? "pedido" : "pedidos"}
                        </span>
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {list.map((o) => (
                          <OpsOrderCard key={o.id} order={o} action={<ActionButton order={o} />} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {getVendorProducts(vendorId).map((p) => {
            const soldOut = unavailable.includes(p.id);
            return (
              <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/60">
                <span className={`grid size-12 place-items-center rounded-xl bg-brand-50 text-2xl ${soldOut ? "grayscale" : ""}`}>
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-bold ${soldOut ? "text-muted line-through" : ""}`}>{p.name}</p>
                  <p className="text-sm text-muted">{money(p.price)}</p>
                </div>
                <Button size="sm" variant={soldOut ? "primary" : "secondary"} onClick={() => toggleProductAvailability(p.id)}>
                  {soldOut ? "Reactivar" : "Marcar agotado"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function scheduleOrder(a: Order, b: Order) {
  const slotIndex = (o: Order) => DELIVERY_SLOTS.findIndex((s) => s.id === o.slotId);
  return a.deliveryDate.localeCompare(b.deliveryDate) || slotIndex(a) - slotIndex(b);
}

function ActionButton({ order }: { order: Order }) {
  const label = ACTIONS[order.status];
  if (!label) return null;
  return (
    <Button block onClick={() => advanceOrder(order.id)}>
      {label}
    </Button>
  );
}

function Column({ title, icon, orders, empty }: { title: string; icon?: ReactNode; orders: Order[]; empty: string }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-bold">
        {icon} {title}
        <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-line">{orders.length}</span>
      </h2>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-sm text-muted">{empty}</p>
        ) : (
          orders.map((o) => <OpsOrderCard key={o.id} order={o} action={<ActionButton order={o} />} />)
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight && value > 0 ? "bg-brand-500 text-white" : "bg-white ring-1 ring-line"}`}>
      <p className={`text-xs font-semibold ${highlight && value > 0 ? "text-white/80" : "text-muted"}`}>{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
