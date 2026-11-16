"use client";

import { DELIVERY_SLOTS, formatClock, getSlot } from "@/lib/data/campus";
import { money } from "@/lib/format";
import { toISODate } from "@/lib/schedule";
import type { Order } from "@/lib/types";
import { useNow } from "@/lib/useNow";

/** Métricas del día para el local: volumen, ventas, mezcla ahora/agendado y horas pico. */
export function VendorMetrics({ orders }: { orders: Order[] }) {
  const now = useNow();
  const today = toISODate(now);
  const todays = orders.filter((o) => o.deliveryDate === today && o.status !== "cancelado");

  const sales = todays.reduce((sum, o) => sum + o.subtotal, 0);
  const avgTicket = todays.length ? sales / todays.length : 0;
  const scheduledShare = todays.length
    ? Math.round((todays.filter((o) => o.mode === "agendado").length / todays.length) * 100)
    : 0;

  // Pedidos por hora: los agendados cuentan en la hora de su clase; los inmediatos, en la hora en que se pidieron.
  const hours = DELIVERY_SLOTS.map((s) => Number(s.end.slice(0, 2)));
  const byHour = new Map<number, number>(hours.map((h) => [h, 0]));
  for (const o of todays) {
    const hour = o.mode === "agendado" ? Number(getSlot(o.slotId)?.end.slice(0, 2)) : new Date(o.createdAt).getHours();
    if (byHour.has(hour)) byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
  }
  const max = Math.max(1, ...byHour.values());
  const peak = [...byHour.entries()].reduce((best, cur) => (cur[1] > best[1] ? cur : best), [0, 0]);

  const products = new Map<string, { name: string; emoji: string; qty: number }>();
  for (const o of todays) {
    for (const i of o.items) {
      const p = products.get(i.productId) ?? { name: i.name, emoji: i.emoji, qty: 0 };
      p.qty += i.quantity;
      products.set(i.productId, p);
    }
  }
  const top = [...products.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Pedidos de hoy" value={String(todays.length)} />
        <Tile label="Ventas de hoy" value={money(sales)} note="Sin contar envío" />
        <Tile label="Ticket promedio" value={money(avgTicket)} />
        <Tile label="Agendados" value={`${scheduledShare}%`} note="del total de hoy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60 lg:col-span-2">
          <h2 className="font-bold">Pedidos de hoy por hora</h2>
          <p className="text-sm text-muted">
            {peak[1] > 0 ? `Hora pico: ${formatClock(`${String(peak[0]).padStart(2, "0")}:00`)} con ${peak[1]} ${peak[1] === 1 ? "pedido" : "pedidos"}` : "Aún no hay pedidos hoy."}
          </p>
          <div className="mt-5 flex h-40 items-end gap-1 border-b border-line" role="img" aria-label="Pedidos de hoy por hora">
            {hours.map((h) => {
              const count = byHour.get(h) ?? 0;
              const label = formatClock(`${String(h).padStart(2, "0")}:00`);
              return (
                <div key={h} className="group relative flex h-full flex-1 items-end justify-center">
                  {count > 0 && (
                    <div
                      className="w-full max-w-6 rounded-t bg-brand-500 transition group-hover:bg-brand-600"
                      style={{ height: `${(count / max) * 100}%` }}
                    />
                  )}
                  <span className="pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-lg bg-ink px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                    {label} · {count} {count === 1 ? "pedido" : "pedidos"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-1 text-[10px] text-muted" aria-hidden="true">
            {hours.map((h) => (
              <span key={h} className="flex-1 text-center">
                {h % 2 === 1 ? h % 12 || 12 : ""}
              </span>
            ))}
          </div>
          <table className="sr-only">
            <caption>Pedidos de hoy por hora</caption>
            <tbody>
              {hours.map((h) => (
                <tr key={h}>
                  <th scope="row">{formatClock(`${String(h).padStart(2, "0")}:00`)}</th>
                  <td>{byHour.get(h) ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60">
          <h2 className="font-bold">Lo más pedido hoy</h2>
          {top.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Aún no hay pedidos hoy.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {top.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-muted tabular-nums">{i + 1}</span>
                  <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-lg" aria-hidden="true">
                    {p.emoji}
                  </span>
                  <span className="flex-1 truncate font-semibold">{p.name}</span>
                  <span className="font-bold tabular-nums">{p.qty}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  );
}
