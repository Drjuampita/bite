"use client";

import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/OrderStatus";
import { getVendor } from "@/lib/data/vendors";
import { itemsCount, money } from "@/lib/format";
import { deliveryLabel } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export function OrderCard({ order, action }: { order: Order; action?: ReactNode }) {
  const vendor = getVendor(order.vendorId);
  const now = useNow();
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-line/60">
      <Link href={`/pedido/${order.id}`} className="flex items-center gap-3 p-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${vendor?.cover}`}>
          {vendor?.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-bold">{vendor?.name}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">
            {itemsCount(order.items)} {itemsCount(order.items) === 1 ? "producto" : "productos"} · {money(order.total)}
          </p>
          <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-muted">
            <MapPin className="size-3.5 shrink-0" />
            {order.location.room} · {deliveryLabel(order, now)}
          </p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted" />
      </Link>
      {action && <div className="border-t border-line px-4 py-3">{action}</div>}
    </div>
  );
}
