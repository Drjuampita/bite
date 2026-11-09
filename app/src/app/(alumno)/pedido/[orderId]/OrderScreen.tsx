"use client";

import { Banknote, CalendarClock, CreditCard, MapPin, MessageSquare, RotateCcw, Star, Zap } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { StatusBadge, StatusTimeline } from "@/components/OrderStatus";
import { EmptyState, PageHeader, RequireUser } from "@/components/shell";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BUILDINGS } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { lineTotal, money, optionsSummary } from "@/lib/format";
import { STATUS_META, canCancel, deliveryLabel, isActive } from "@/lib/orders";
import { cancelOrder, rateOrder, reorder, useBite } from "@/lib/store";
import type { Order } from "@/lib/types";
import { formatTime, relativeDayLabel } from "@/lib/schedule";
import { useNow } from "@/lib/useNow";

export function OrderScreen() {
  return (
    <RequireUser>
      <OrderDetail />
    </RequireUser>
  );
}

function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const isNew = useSearchParams().get("nuevo") === "1";
  const router = useRouter();
  const now = useNow();
  const { orders } = useBite();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <>
        <PageHeader title="Pedido" backHref="/pedidos" />
        <EmptyState
          emoji="🔎"
          title="No encontramos este pedido"
          message="Puede que se haya borrado al reiniciar la demo."
          action={<ButtonLink href="/pedidos">Ver mis pedidos</ButtonLink>}
        />
      </>
    );
  }

  const vendor = getVendor(order.vendorId)!;
  const building = BUILDINGS.find((b) => b.id === order.location.building);
  const meta = STATUS_META[order.status];
  const deliveredAt = order.history.find((h) => h.status === "entregado")?.at;

  return (
    <>
      <PageHeader title={`Pedido #${order.code}`} backHref="/pedidos" right={<StatusBadge status={order.status} />} />
      <main className="flex-1 space-y-4 px-4 pt-4 pb-10">
        {isNew && (order.status === "recibido" || order.status === "programado") && (
          <div className="flex animate-fade-in items-center gap-4 rounded-card bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <span className="grid size-12 shrink-0 animate-pop place-items-center rounded-full bg-emerald-500 text-2xl text-white">✓</span>
            <div>
              <p className="font-bold text-emerald-900">
                {order.mode === "ahora" ? "¡Pedido confirmado!" : "¡Pedido agendado!"}
              </p>
              <p className="text-sm text-emerald-800">
                {order.mode === "ahora"
                  ? `${vendor.name} ya lo recibió.`
                  : `Te lo llevamos ${deliveryLabel(order, now).toLowerCase()}.`}
              </p>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-card bg-white shadow-card ring-1 ring-line/60">
          <div className="bg-ink p-5 text-white">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
              {order.mode === "ahora" ? <Zap className="size-3.5" /> : <CalendarClock className="size-3.5" />}
              {order.mode === "ahora" ? "Pedido inmediato" : "Pedido agendado"}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{meta.label}</p>
            <p className="text-sm text-white/75">{meta.description}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-white/60">{deliveredAt ? "Entregado" : "Entrega"}</p>
                <p className="font-bold">
                  {deliveredAt
                    ? `${relativeDayLabel(order.deliveryDate, now)} · ${formatTime(deliveredAt)}`
                    : order.mode === "ahora"
                      ? `Aprox. ${vendor.prepTime}`
                      : deliveryLabel(order, now)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Código de entrega</p>
                <p className="text-2xl font-extrabold tabular-nums tracking-[0.2em] text-brand-200">{order.code}</p>
              </div>
            </div>
          </div>
          {order.status !== "cancelado" && (
            <div className="p-5">
              <StatusTimeline order={order} />
            </div>
          )}
        </section>

        {order.status === "entregado" && <RatingCard order={order} />}

        <section className="space-y-4 rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
          <Detail icon={<MapPin className="size-5" />} label="Entregar en">
            Salón {order.location.room} · {building?.name}
          </Detail>
          <Detail icon={order.payment === "tarjeta" ? <CreditCard className="size-5" /> : <Banknote className="size-5" />} label="Pago">
            {order.payment === "tarjeta"
              ? "Tarjeta •••• 4242"
              : isActive(order)
                ? `Efectivo · ten listo ${money(order.total)}`
                : `Efectivo · ${money(order.total)}`}
          </Detail>
          {order.note && (
            <Detail icon={<MessageSquare className="size-5" />} label="Nota">
              {order.note}
            </Detail>
          )}
        </section>

        <section className="rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
          <div className="flex items-center gap-3">
            <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br text-xl ${vendor.cover}`}>{vendor.emoji}</span>
            <p className="font-bold">{vendor.name}</p>
          </div>
          <ul className="mt-4 space-y-3">
            {order.items.map((i) => (
              <li key={i.lineId} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold">
                    {i.quantity}× {i.name}
                  </p>
                  {optionsSummary(i) && <p className="text-xs text-muted">{optionsSummary(i)}</p>}
                </div>
                <span className="font-medium">{money(lineTotal(i))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío</dt>
              <dd>{money(order.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-extrabold">{money(order.total)}</dd>
            </div>
          </dl>
        </section>

        {canCancel(order) && (
          <Button variant="danger" block onClick={() => setConfirmCancel(true)}>
            Cancelar pedido
          </Button>
        )}
        {!isActive(order) && (
          <Button
            variant="secondary"
            block
            onClick={() => {
              reorder(order);
              router.push("/carrito");
            }}
          >
            <RotateCcw className="size-4" /> Pedir de nuevo
          </Button>
        )}
      </main>

      <ConfirmDialog
        open={confirmCancel}
        destructive
        title="¿Cancelar este pedido?"
        message="El local dejará de prepararlo. Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        cancelLabel="No, mantener"
        onConfirm={() => {
          cancelOrder(order.id);
          setConfirmCancel(false);
        }}
        onCancel={() => setConfirmCancel(false)}
      />
    </>
  );
}

function Detail({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-canvas text-ink">{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold">{children}</p>
      </div>
    </div>
  );
}

function RatingCard({ order }: { order: Order }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  if (order.rating) {
    return (
      <section className="rounded-card bg-white p-5 text-center shadow-card ring-1 ring-line/60">
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={`size-6 ${n <= order.rating!.stars ? "fill-amber-400 text-amber-400" : "text-line"}`} />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold">¡Gracias por calificar!</p>
      </section>
    );
  }

  return (
    <section className="rounded-card bg-white p-5 text-center shadow-card ring-1 ring-line/60">
      <p className="font-bold">¿Qué tal estuvo?</p>
      <div className="mt-3 flex justify-center gap-2" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} estrellas`} onClick={() => setStars(n)}>
            <Star className={`size-9 transition ${n <= stars ? "fill-amber-400 text-amber-400" : "text-line"}`} />
          </button>
        ))}
      </div>
      {stars > 0 && (
        <div className="mt-4 animate-fade-in space-y-3">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos más (opcional)"
            className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button block onClick={() => rateOrder(order.id, stars, comment.trim() || undefined)}>
            Enviar calificación
          </Button>
        </div>
      )}
    </section>
  );
}
