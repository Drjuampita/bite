"use client";

import { Banknote, CreditCard, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/OrderStatus";
import { optionsSummary, money } from "@/lib/format";
import { orderRef } from "@/lib/orders";
import { formatTime } from "@/lib/schedule";
import type { Order } from "@/lib/types";

/** Tarjeta de pedido para las vistas de operación (local y repartidor). */
export function OpsOrderCard({
  order,
  header,
  action,
  showItems = true,
}: {
  order: Order;
  header?: ReactNode;
  action?: ReactNode;
  showItems?: boolean;
}) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/60">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-lg font-extrabold tabular-nums tracking-wider">#{orderRef(order)}</p>
          <p className="text-xs text-muted">
            {order.userName} · {formatTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      {header}
      <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
        <MapPin className="size-4 text-brand-500" /> Salón {order.location.room}
      </p>
      {showItems && (
        <ul className="mt-3 space-y-1.5 border-t border-dashed border-line pt-3 text-sm">
          {order.items.map((i) => (
            <li key={i.lineId}>
              <span className="font-bold">{i.quantity}×</span> {i.name}
              {optionsSummary(i) && <span className="block pl-5 text-xs text-muted">{optionsSummary(i)}</span>}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted">
        {order.payment === "efectivo" ? (
          <>
            <Banknote className="size-4 text-amber-600" />
            <span className="text-amber-700">Cobrar {money(order.total)} en efectivo</span>
          </>
        ) : (
          <>
            <CreditCard className="size-4" /> Pagado con tarjeta · {money(order.total)}
          </>
        )}
      </p>
      {order.runnerName && (
        <p className="mt-2 text-xs text-muted">
          Repartidor: <span className="font-semibold text-ink">{order.runnerName}</span>
        </p>
      )}
      {order.note && <p className="mt-2 rounded-xl bg-canvas px-3 py-2 text-xs">“{order.note}”</p>}
      {action && <div className="mt-4">{action}</div>}
    </article>
  );
}
