"use client";

import { Home, MapPin, Receipt, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { itemsCount, itemsSubtotal, money } from "@/lib/format";
import { isActive } from "@/lib/orders";
import { useBite } from "@/lib/store";

const LINKS = [
  { href: "/inicio", label: "Inicio", Icon: Home },
  { href: "/pedidos", label: "Pedidos", Icon: Receipt },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
];

/** Barra superior para pantallas de computadora; en teléfono la navegación va abajo (BottomNav). */
export function DesktopNav() {
  const pathname = usePathname();
  const { hydrated, user, orders, cart } = useBite();
  if (!hydrated || !user) return null;

  const activeCount = orders.filter((o) => o.userId === user.id && isActive(o)).length;
  const count = cart ? itemsCount(cart.items) : 0;

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-white/90 backdrop-blur lg:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
        <Link href="/inicio" aria-label="Bite, inicio">
          <Logo small />
        </Link>

        <nav aria-label="Principal" className="flex flex-1 gap-1">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-muted hover:bg-black/5 hover:text-ink"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                {label}
                {href === "/pedidos" && activeCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/perfil"
          className="flex h-10 max-w-56 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ring-1 ring-line transition hover:bg-canvas"
        >
          <MapPin className="size-4 shrink-0 text-brand-500" />
          <span className="truncate">
            {user.defaultLocation ? `Salón ${user.defaultLocation.room}` : "Elige tu salón"}
          </span>
        </Link>

        <Link
          href="/carrito"
          className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
            count > 0 ? "bg-brand-500 text-white hover:bg-brand-600" : "text-ink ring-1 ring-line hover:bg-canvas"
          }`}
        >
          <ShoppingBag className="size-[18px]" />
          {count > 0 ? (
            <>
              <span>{count}</span>
              <span aria-hidden="true" className="opacity-60">·</span>
              <span>{money(itemsSubtotal(cart!.items))}</span>
            </>
          ) : (
            "Carrito"
          )}
        </Link>
      </div>
    </header>
  );
}
