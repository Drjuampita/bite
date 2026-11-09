"use client";

import { Bike, LockKeyhole, Store } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { DEMO_STAFF_PIN } from "@/lib/data/staff";
import { VENDORS } from "@/lib/data/vendors";
import { staffLogin, useBite } from "@/lib/store";
import type { StaffSession } from "@/lib/types";

type Role = StaffSession["role"];
type SessionOf<R extends Role> = Extract<StaffSession, { role: R }>;

/** Pide acceso al personal antes de mostrar el panel del local o la vista del repartidor. */
export function StaffGate<R extends Role>({
  role,
  children,
}: {
  role: R;
  children: (session: SessionOf<R>) => ReactNode;
}) {
  const { hydrated, staff } = useBite();
  if (!hydrated) return null;
  if (staff?.role === role) return <>{children(staff as SessionOf<R>)}</>;
  return <StaffLogin role={role} />;
}

function StaffLogin({ role }: { role: Role }) {
  const [vendorId, setVendorId] = useState(VENDORS[0].id);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (role === "repartidor" && name.trim().length < 2) return setError("Escribe tu nombre.");
    const session: StaffSession =
      role === "local" ? { role: "local", vendorId } : { role: "repartidor", name: name.trim() };
    if (!staffLogin(session, pin)) setError("PIN incorrecto.");
  }

  return (
    <main className="grid min-h-[70dvh] place-items-center py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white">
          {role === "local" ? <Store className="size-6" /> : <Bike className="size-6" />}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
          {role === "local" ? "Acceso para locales" : "Acceso para repartidores"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {role === "local"
            ? "Cada local ve y atiende solo sus propios pedidos."
            : "Toma pedidos listos y entrégalos en el salón."}
        </p>

        {role === "local" ? (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Local</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {VENDORS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVendorId(v.id)}
                  aria-pressed={v.id === vendorId}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                    v.id === vendorId ? "bg-ink text-white" : "bg-canvas ring-1 ring-line"
                  }`}
                >
                  <span aria-hidden="true">{v.emoji}</span> {v.name}
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <label className="mt-6 block">
            <span className="text-sm font-semibold">Tu nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Carlos"
              className="mt-2 h-12 w-full rounded-2xl bg-canvas px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        )}

        <label className="mt-4 block">
          <span className="text-sm font-semibold">PIN</span>
          <input
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••"
            className="mt-2 h-12 w-full rounded-2xl bg-canvas px-4 text-lg tracking-[0.4em] ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" block className="mt-6">
          <LockKeyhole className="size-4" /> Entrar
        </Button>
        <p className="mt-4 text-center text-xs text-muted">
          PIN de demostración: <span className="font-bold text-ink">{DEMO_STAFF_PIN}</span>
        </p>
      </form>
    </main>
  );
}
