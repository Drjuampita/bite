"use client";

import { Bike, Check, ChefHat, PackageCheck, Receipt, CalendarClock } from "lucide-react";
import { STATUS_FLOW, STATUS_META } from "@/lib/orders";
import { formatTime } from "@/lib/schedule";
import type { Order, OrderStatus } from "@/lib/types";

const TONE_CLASSES = {
  neutral: "bg-slate-100 text-slate-700",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[meta.tone]}`}>
      {meta.tone === "brand" && <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />}
      {meta.label}
    </span>
  );
}

const STEP_ICONS: Record<string, typeof Receipt> = {
  programado: CalendarClock,
  recibido: Receipt,
  preparando: ChefHat,
  listo: PackageCheck,
  en_camino: Bike,
  entregado: Check,
};

/** Línea de tiempo vertical del pedido. */
export function StatusTimeline({ order }: { order: Order }) {
  const steps: OrderStatus[] = order.mode === "agendado" ? ["programado", ...STATUS_FLOW] : STATUS_FLOW;
  const currentIndex = steps.indexOf(order.status);
  const timeOf = (s: OrderStatus) => order.history.find((h) => h.status === s)?.at;

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const Icon = STEP_ICONS[step];
        const at = timeOf(step);
        return (
          <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className={`absolute top-10 left-5 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 ${
                  done ? "bg-brand-500" : "bg-line"
                }`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative grid size-10 shrink-0 place-items-center rounded-full transition ${
                done
                  ? "bg-brand-500 text-white"
                  : current
                    ? "bg-brand-500 text-white ring-8 ring-brand-100"
                    : "bg-white text-muted ring-1 ring-line"
              }`}
            >
              <Icon className="size-5" />
            </span>
            <div className="pt-1">
              <p className={`font-bold ${done || current ? "text-ink" : "text-muted"}`}>
                {STATUS_META[step].label}
                {at && <span className="ml-2 text-xs font-medium text-muted">{formatTime(at)}</span>}
              </p>
              {current && <p className="mt-0.5 text-sm text-muted">{STATUS_META[step].description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
