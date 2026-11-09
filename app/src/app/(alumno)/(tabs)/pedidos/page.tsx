"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/shell";
import { ButtonLink } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { isActive } from "@/lib/orders";
import { reorder, useBite } from "@/lib/store";

type Tab = "activos" | "agendados" | "historial";

const EMPTY: Record<Tab, { emoji: string; title: string; message: string }> = {
  activos: { emoji: "🛵", title: "Sin pedidos en curso", message: "Cuando pidas algo, aquí verás cómo va." },
  agendados: { emoji: "🗓️", title: "Nada agendado", message: "Agenda hoy tu comida de mañana y olvídate de las filas." },
  historial: { emoji: "🧾", title: "Aún no hay historial", message: "Tus pedidos entregados aparecerán aquí." },
};

export default function PedidosPage() {
  const { orders, user } = useBite();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("activos");

  const mine = orders.filter((o) => o.userId === user?.id);
  const lists: Record<Tab, typeof mine> = {
    activos: mine.filter((o) => isActive(o) && o.status !== "programado"),
    agendados: mine.filter((o) => o.status === "programado"),
    historial: mine.filter((o) => !isActive(o)),
  };
  const list = lists[tab];

  return (
    <main className="flex flex-1 flex-col">
      <header className="px-5 pt-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Mis pedidos</h1>
      </header>
      <div className="px-4 pt-4">
        <Segmented
          label="Filtrar pedidos"
          value={tab}
          onChange={setTab}
          options={[
            { value: "activos", label: `En curso${lists.activos.length ? ` (${lists.activos.length})` : ""}` },
            { value: "agendados", label: `Agendados${lists.agendados.length ? ` (${lists.agendados.length})` : ""}` },
            { value: "historial", label: "Historial" },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <EmptyState {...EMPTY[tab]} action={<ButtonLink href="/inicio">Explorar locales</ButtonLink>} />
      ) : (
        <ul className="space-y-3 px-4 pt-4">
          {list.map((o) => (
            <li key={o.id}>
              <OrderCard
                order={o}
                action={
                  tab === "historial" ? (
                    <button
                      type="button"
                      onClick={() => {
                        reorder(o);
                        router.push("/carrito");
                      }}
                      className="flex items-center gap-2 text-sm font-semibold text-brand-600"
                    >
                      <RotateCcw className="size-4" /> Pedir de nuevo
                    </button>
                  ) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
