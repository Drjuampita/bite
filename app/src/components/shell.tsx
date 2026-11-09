"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { useBite } from "@/lib/store";

/** Columna de la app con proporción de teléfono; en escritorio se ve centrada como un mockup. */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-canvas sm:shadow-[0_0_80px_-20px_rgb(28_21_17/0.25)]">
      {children}
    </div>
  );
}

export function Splash() {
  return (
    <div className="grid flex-1 place-items-center">
      <LogoMark className="size-14 animate-pulse" />
    </div>
  );
}

/** Muestra el contenido solo si hay sesión; si no, manda a /login. */
export function RequireUser({ children }: { children: ReactNode }) {
  const { hydrated, user } = useBite();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);
  if (!hydrated || !user) return <Splash />;
  return <>{children}</>;
}

interface PageHeaderProps {
  title?: string;
  /** Ruta de regreso. Si no se da, usa el historial del navegador. */
  backHref?: string;
  right?: ReactNode;
  transparent?: boolean;
}

export function PageHeader({ title, backHref, right, transparent }: PageHeaderProps) {
  const router = useRouter();
  const backClass =
    "grid size-10 place-items-center rounded-full bg-white text-ink shadow-sm ring-1 ring-line";
  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center gap-3 px-4 ${
        transparent ? "" : "border-b border-line/70 bg-canvas/90 backdrop-blur"
      }`}
    >
      {backHref ? (
        <Link href={backHref} aria-label="Regresar" className={backClass}>
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <button type="button" aria-label="Regresar" className={backClass} onClick={() => router.back()}>
          <ChevronLeft className="size-5" />
        </button>
      )}
      {title && <h1 className="flex-1 truncate text-lg font-bold">{title}</h1>}
      {!title && <div className="flex-1" />}
      {right}
    </header>
  );
}

export function EmptyState({
  emoji,
  title,
  message,
  action,
}: {
  emoji: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-brand-50 text-4xl">{emoji}</div>
      <h2 className="mt-5 text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-5">
      <h2 className="text-lg font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
