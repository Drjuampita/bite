"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/panel", label: "Local" },
  { href: "/repartidor", label: "Repartidor" },
  { href: "/inicio", label: "App alumno" },
];

export function OpsNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/panel" aria-label="Bite">
          <Logo small />
        </Link>
        <nav className="flex gap-1 rounded-full bg-canvas p-1 ring-1 ring-line">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:text-sm ${
                pathname.startsWith(l.href) ? "bg-ink text-white" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
