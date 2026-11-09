"use client";

import { Banknote, CalendarClock, Check, CreditCard, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { EmptyState, PageHeader, RequireUser } from "@/components/shell";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { DELIVERY_FEE } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { itemsCount, itemsSubtotal, lineTotal, money } from "@/lib/format";
import { availableSlots, formatShortDate, scheduleDays, slotAvailability, toISODate, vendorOpenNow } from "@/lib/schedule";
import { placeOrder, setDefaultLocation, useBite } from "@/lib/store";
import type { DeliveryLocation, OrderMode, PaymentMethod, Vendor } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export default function CheckoutPage() {
  return (
    <RequireUser>
      <CheckoutGate />
    </RequireUser>
  );
}

function CheckoutGate() {
  const { cart } = useBite();
  const vendor = cart ? getVendor(cart.vendorId) : undefined;
  if (!cart || cart.items.length === 0 || !vendor) {
    return (
      <>
        <PageHeader title="Confirmar pedido" backHref="/inicio" />
        <EmptyState
          emoji="🧾"
          title="No hay nada que pagar"
          message="Agrega productos a tu carrito para hacer un pedido."
          action={<ButtonLink href="/inicio">Ver locales</ButtonLink>}
        />
      </>
    );
  }
  return <Checkout vendor={vendor} />;
}

function Checkout({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const { cart, user, settings } = useBite();
  const now = useNow();

  const openNow = vendorOpenNow(vendor, now, settings.demoMode);
  const days = scheduleDays(now, settings.demoMode);

  const [mode, setMode] = useState<OrderMode>(() => (openNow.available ? "ahora" : "agendado"));
  const [date, setDate] = useState(() => {
    const withSlots = days.find((d) => availableSlots(vendor, d.date, now, settings.demoMode).some((s) => s.available));
    return (withSlots ?? days[0]).date;
  });
  const [slotId, setSlotId] = useState<string | null>(
    () => availableSlots(vendor, date, now, settings.demoMode).find((s) => s.available)?.slot.id ?? null,
  );
  const [location, setLocation] = useState<DeliveryLocation | null>(user?.defaultLocation ?? null);
  const [saveLocation, setSaveLocation] = useState(!user?.defaultLocation);
  const [payment, setPayment] = useState<PaymentMethod>("tarjeta");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const slots = availableSlots(vendor, date, now, settings.demoMode);
  const subtotal = itemsSubtotal(cart!.items);
  const total = subtotal + DELIVERY_FEE;

  const whenValid = mode === "ahora" ? openNow.available : !!slotId && slots.find((s) => s.slot.id === slotId)?.available;
  const canSubmit = whenValid && !!location;

  function pickDate(d: string) {
    setDate(d);
    setSlotId(availableSlots(vendor, d, now, settings.demoMode).find((s) => s.available)?.slot.id ?? null);
  }

  function submit() {
    if (!location) return setError("Elige el salón de entrega.");
    if (mode === "agendado") {
      const slot = slots.find((s) => s.slot.id === slotId)?.slot;
      // Se revalida con la hora actual por si el bloque expiró mientras se llenaba el formulario.
      if (!slot || !slotAvailability(vendor, slot, date, new Date(), settings.demoMode).available) {
        return setError("Ese bloque ya no está disponible. Elige otro.");
      }
    }
    if (saveLocation) setDefaultLocation(location);
    const order = placeOrder({
      mode,
      deliveryDate: mode === "ahora" ? toISODate(new Date()) : date,
      slotId: mode === "agendado" ? slotId ?? undefined : undefined,
      location,
      payment,
      note: note.trim() || undefined,
    });
    if (order) router.replace(`/pedido/${order.id}?nuevo=1`);
  }

  return (
    <>
      <PageHeader title="Confirmar pedido" />
      <main className="flex-1 space-y-4 px-4 pt-4 pb-36">
        <Step n={1} title="¿Cuándo lo quieres?">
          <Segmented
            label="Tipo de entrega"
            value={mode}
            onChange={(m) => {
              setMode(m);
              setError(null);
            }}
            options={[
              { value: "ahora", label: <><Zap className="size-4" /> Ahora</>, disabled: !openNow.available },
              { value: "agendado", label: <><CalendarClock className="size-4" /> Agendar</> },
            ]}
          />

          {mode === "ahora" ? (
            <p className="mt-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
              <span className="font-bold">Llega en {vendor.prepTime}</span> a tu salón. El repartidor te avisa al llegar.
            </p>
          ) : (
            <div className="mt-4">
              {!openNow.available && (
                <p className="mb-3 text-xs font-medium text-amber-700">
                  {vendor.name} no recibe pedidos inmediatos ahora ({openNow.reason}), pero puedes agendar.
                </p>
              )}
              <div className="flex gap-2">
                {days.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => pickDate(d.date)}
                    aria-pressed={d.date === date}
                    className={`flex-1 rounded-2xl px-4 py-3 text-left transition ${
                      d.date === date ? "bg-ink text-white" : "bg-white ring-1 ring-line"
                    }`}
                  >
                    <span className="block text-sm font-bold">{d.label}</span>
                    <span className={`block text-xs ${d.date === date ? "text-white/70" : "text-muted"}`}>
                      {formatShortDate(d.date)}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 mb-2 text-xs font-semibold text-muted">Llega antes de tu clase de las…</p>
              <div role="radiogroup" aria-label="Bloque de entrega" className="grid grid-cols-3 gap-2">
                {slots.map(({ slot, available, reason }) => {
                  const active = slot.id === slotId;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={!available}
                      onClick={() => setSlotId(slot.id)}
                      className={`rounded-2xl px-2 py-3 text-center transition ${
                        active
                          ? "bg-brand-500 text-white shadow-float"
                          : available
                            ? "bg-white ring-1 ring-line"
                            : "bg-canvas text-muted/60 ring-1 ring-line/60"
                      }`}
                    >
                      <span className="block text-base font-extrabold">{slot.label}</span>
                      <span className={`block text-[11px] ${active ? "text-white/80" : "text-muted"}`}>
                        {available ? `${slot.start}–${slot.end}` : reason}
                      </span>
                    </button>
                  );
                })}
              </div>
              {slots.every((s) => !s.available) && (
                <p className="mt-3 text-sm text-muted">No hay bloques disponibles este día. Prueba con otro.</p>
              )}
            </div>
          )}
        </Step>

        <Step n={2} title="¿A qué salón?">
          <LocationPicker value={location} onChange={(l) => { setLocation(l); setError(null); }} />
          <label className="mt-3 flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={saveLocation}
              onChange={(e) => setSaveLocation(e.target.checked)}
              className="size-4 accent-brand-500"
            />
            Guardar como mi salón habitual
          </label>
        </Step>

        <Step n={3} title="¿Cómo pagas?">
          <div className="space-y-2">
            <PaymentOption
              active={payment === "tarjeta"}
              onClick={() => setPayment("tarjeta")}
              icon={<CreditCard className="size-5" />}
              title="Tarjeta •••• 4242"
              subtitle="Pago simulado para la demo"
            />
            <PaymentOption
              active={payment === "efectivo"}
              onClick={() => setPayment("efectivo")}
              icon={<Banknote className="size-5" />}
              title="Efectivo al recibir"
              subtitle={`Ten listo ${money(total)}`}
            />
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Nota para el repartidor (opcional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
              placeholder="Ej. estoy en la última fila"
              className="mt-2 h-12 w-full rounded-2xl bg-canvas px-4 text-sm ring-1 ring-line outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </Step>

        <section className="rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
          <h2 className="font-bold">Resumen · {vendor.name}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {cart!.items.map((i) => (
              <li key={i.lineId} className="flex justify-between gap-4">
                <span className="text-muted">
                  {i.quantity}× {i.name}
                </span>
                <span className="font-medium">{money(lineTotal(i))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal ({itemsCount(cart!.items)})</dt>
              <dd className="font-semibold">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío</dt>
              <dd className="font-semibold">{money(DELIVERY_FEE)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-extrabold">{money(total)}</dd>
            </div>
          </dl>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {error && (
          <p role="alert" className="mb-2 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <Button size="lg" block disabled={!canSubmit} onClick={submit}>
          {mode === "ahora" ? "Pedir ahora" : "Agendar pedido"} · {money(total)}
        </Button>
      </div>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
      <h2 className="mb-4 flex items-center gap-3 font-bold">
        <span className="grid size-7 place-items-center rounded-full bg-brand-500 text-sm text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition ${
        active ? "bg-brand-50 ring-2 ring-brand-500" : "bg-white ring-1 ring-line"
      }`}
    >
      <span className={`grid size-10 place-items-center rounded-xl ${active ? "bg-brand-500 text-white" : "bg-canvas text-ink"}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-muted">{subtitle}</span>
      </span>
      {active && <Check className="size-5 text-brand-600" />}
    </button>
  );
}
