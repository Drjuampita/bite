"use client";

import { Bike, ChevronRight, LogOut, RefreshCcw, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logout, resetDemo, setDefaultLocation, updateSettings, useBite } from "@/lib/store";

export default function PerfilPage() {
  const { user, settings } = useBite();
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <main className="flex-1 space-y-4 px-4 pt-6">
      <section className="flex items-center gap-4 px-1">
        <span className="grid size-16 place-items-center rounded-full bg-brand-500 text-xl font-extrabold text-white">{initials}</span>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold">{user.name}</h1>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
      </section>

      <Card title="Mi salón habitual" subtitle="Se usa por defecto al confirmar un pedido.">
        <LocationPicker
          value={user.defaultLocation ?? null}
          onChange={(l) => {
            if (l) setDefaultLocation(l);
            setSaved(!!l);
          }}
        />
        {saved && <p className="mt-2 animate-fade-in text-xs font-semibold text-emerald-700">Guardado ✓</p>}
      </Card>

      <Card title="Modo presentación" subtitle="Ajustes para mostrar Bite en vivo a cualquier hora.">
        <Toggle
          label="Locales siempre abiertos"
          description="Ignora horarios y hora de corte."
          checked={settings.demoMode}
          onChange={(v) => updateSettings({ demoMode: v })}
        />
        <Toggle
          label="Simular avance de pedidos"
          description="Los pedidos inmediatos avanzan solos cada ~12 s."
          checked={settings.simulate}
          onChange={(v) => updateSettings({ simulate: v })}
        />
      </Card>

      <Card title="Otras vistas de Bite">
        <NavRow href="/panel" icon={<Store className="size-5" />} label="Panel del local" />
        <NavRow href="/repartidor" icon={<Bike className="size-5" />} label="Vista del repartidor" />
      </Card>

      <div className="space-y-2 pb-6">
        <Button variant="secondary" block onClick={() => setConfirmReset(true)}>
          <RefreshCcw className="size-4" /> Reiniciar datos de la demo
        </Button>
        <Button
          variant="ghost"
          block
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          <LogOut className="size-4" /> Cerrar sesión
        </Button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        destructive
        title="¿Reiniciar la demo?"
        message="Se borran pedidos, carrito y productos agotados. Tu sesión se mantiene."
        confirmLabel="Reiniciar"
        onConfirm={() => {
          resetDemo();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </main>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-card bg-white p-5 shadow-card ring-1 ring-line/60">
      <h2 className="font-bold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4">
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted">{description}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-line transition peer-checked:bg-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

function NavRow({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-canvas p-3 ring-1 ring-line">
      <span className="grid size-10 place-items-center rounded-xl bg-white">{icon}</span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight className="size-5 text-muted" />
    </Link>
  );
}
