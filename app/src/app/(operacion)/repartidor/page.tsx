"use client";

import { Bike, PackageCheck } from "lucide-react";
import { OpsOrderCard } from "@/components/OpsOrderCard";
import { Button } from "@/components/ui/Button";
import { BUILDINGS } from "@/lib/data/campus";
import { getVendor } from "@/lib/data/vendors";
import { setOrderStatus, useBite } from "@/lib/store";
import type { Order } from "@/lib/types";
import type { ReactNode } from "react";
import { itemsCount } from "@/lib/format";

export default function RepartidorPage() {
  const { orders, hydrated } = useBite();
  const toPickUp = orders.filter((o) => o.status === "listo");
  const onTheWay = orders.filter((o) => o.status === "en_camino");
  const delivered = orders.filter((o) => o.status === "entregado").length;

  return (
    <main className="pt-6">
      <p className="text-sm text-muted">Vista del repartidor</p>
      <h1 className="text-3xl font-extrabold tracking-tight">Entregas</h1>
      <p className="mt-1 text-sm text-muted">
        {delivered} entregados · confirma con el código que el alumno ve en su app.
      </p>

      {hydrated && (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              <PackageCheck className="size-5" /> Por recoger
              <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-line">{toPickUp.length}</span>
            </h2>
            <OrderList
              orders={toPickUp}
              empty="Nada listo para recoger."
              action={(o) => (
                <Button block onClick={() => setOrderStatus(o.id, "en_camino")}>
                  Recogí el pedido
                </Button>
              )}
            />
          </section>
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              <Bike className="size-5" /> En camino, por edificio
              <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-line">{onTheWay.length}</span>
            </h2>
            {onTheWay.length === 0 ? (
              <Empty text="Sin entregas en camino." />
            ) : (
              <div className="space-y-5">
                {BUILDINGS.filter((b) => onTheWay.some((o) => o.location.building === b.id)).map((b) => (
                  <div key={b.id}>
                    <p className="mb-2 text-sm font-semibold">{b.name}</p>
                    <OrderList
                      orders={onTheWay.filter((o) => o.location.building === b.id)}
                      empty=""
                      action={(o) => (
                        <Button block onClick={() => setOrderStatus(o.id, "entregado")}>
                          Entregado
                        </Button>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function OrderList({ orders, empty, action }: { orders: Order[]; empty: string; action: (o: Order) => ReactNode }) {
  if (orders.length === 0) return <Empty text={empty} />;
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OpsOrderCard
          key={o.id}
          order={o}
          showItems={false}
          header={<p className="mt-2 text-xs font-semibold text-muted">Recoger en {getVendor(o.vendorId)?.name} · {itemsCount(o.items)} {itemsCount(o.items) === 1 ? "producto" : "productos"}</p>}
          action={action(o)}
        />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-sm text-muted">{text}</p>;
}
