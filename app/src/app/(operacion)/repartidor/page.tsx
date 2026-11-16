"use client";

import { Bike, LogOut, PackageCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { OpsOrderCard } from "@/components/OpsOrderCard";
import { Button } from "@/components/ui/Button";
import { BUILDINGS } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { itemsCount } from "@/lib/format";
import { deliverOrder, staffLogout, takeOrder, useBite } from "@/lib/store";
import type { Order } from "@/lib/types";
import { StaffGate } from "../StaffGate";

export default function RepartidorPage() {
  return <StaffGate role="repartidor">{(session) => <RunnerView name={session.name} />}</StaffGate>;
}

function RunnerView({ name }: { name: string }) {
  const { orders } = useBite();
  const toPickUp = orders.filter((o) => o.status === "listo");
  const mine = orders.filter((o) => o.status === "en_camino" && o.runnerName === name);
  const deliveredByMe = orders.filter((o) => o.status === "entregado" && o.runnerName === name).length;

  return (
    <main className="pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Repartidor · {name}</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Entregas</h1>
          <p className="mt-1 text-sm text-muted">
            {deliveredByMe} {deliveredByMe === 1 ? "entrega hecha" : "entregas hechas"}. Pide al alumno su código para
            confirmar.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={staffLogout}>
          <LogOut className="size-4" /> Salir
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <PackageCheck className="size-5" /> Listos para recoger
            <Count n={toPickUp.length} />
          </h2>
          {toPickUp.length === 0 ? (
            <Empty text="Nada listo para recoger." />
          ) : (
            <div className="space-y-3">
              {toPickUp.map((o) => (
                <OpsOrderCard
                  key={o.id}
                  order={o}
                  showItems={false}
                  header={<PickupNote order={o} />}
                  action={
                    <Button block onClick={() => takeOrder(o.id, name)}>
                      Tomar y recoger
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Bike className="size-5" /> Mis entregas, por edificio
            <Count n={mine.length} />
          </h2>
          {mine.length === 0 ? (
            <Empty text="No llevas pedidos en camino." />
          ) : (
            <div className="space-y-5">
              {BUILDINGS.filter((b) => mine.some((o) => o.location.building === b.id)).map((b) => (
                <div key={b.id}>
                  <p className="mb-2 text-sm font-semibold">{b.name}</p>
                  <div className="space-y-3">
                    {mine
                      .filter((o) => o.location.building === b.id)
                      .map((o) => (
                        <OpsOrderCard
                          key={o.id}
                          order={o}
                          showItems={false}
                          header={<PickupNote order={o} />}
                          action={<DeliverForm order={o} />}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/** Confirma la entrega con el código de 4 dígitos que el alumno ve en su app. */
function DeliverForm({ order }: { order: Order }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!deliverOrder(order.id, code)) setError(true);
  }

  return (
    <form onSubmit={submit}>
      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Código de entrega</span>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(false);
            }}
            inputMode="numeric"
            placeholder="Código"
            aria-invalid={error}
            className={`h-11 w-full rounded-full bg-canvas px-4 text-center font-bold tracking-[0.3em] ring-1 outline-none focus:ring-2 ${
              error ? "ring-red-400 focus:ring-red-500" : "ring-line focus:ring-brand-500"
            }`}
          />
        </label>
        <Button type="submit" disabled={code.length !== 4}>
          Entregado
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-center text-xs font-semibold text-red-600">
          Código incorrecto. Pídele al alumno el código que aparece en su pedido.
        </p>
      )}
    </form>
  );
}

function PickupNote({ order }: { order: Order }) {
  const n = itemsCount(order.items);
  return (
    <p className="mt-2 text-xs font-semibold text-muted">
      Recoger en {getVendor(order.vendorId)?.name} · {n} {n === 1 ? "producto" : "productos"}
    </p>
  );
}

function Count({ n }: { n: number }) {
  return <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-line">{n}</span>;
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-sm text-muted">{text}</p>;
}
