"use client";

import { Home, Receipt, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/orders";
import { useBite } from "@/lib/store";

const TABS = [
  { href: "/inicio", label: "Inicio", Icon: Home },
  { href: "/pedidos", label: "Pedidos", Icon: Receipt },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const { orders, user } = useBite();
  const activeCount = orders.filter((o) => o.userId === user?.id && isActive(o)).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-3">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                  active ? "text-brand-500" : "text-muted"
                }`}
              >
                <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} />
                {label}
                {href === "/pedidos" && activeCount > 0 && (
                  <span className="absolute top-2 left-1/2 ml-2 grid size-5 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
