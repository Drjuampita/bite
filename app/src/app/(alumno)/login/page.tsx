"use client";

import { ArrowRight, CalendarClock, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { login, useBite } from "@/lib/store";

const EMAIL_DOMAIN = "anahuac.mx";

export default function LoginPage() {
  const router = useRouter();
  const { hydrated, user } = useBite();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) router.replace("/inicio");
  }, [hydrated, user, router]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (name.trim().length < 2) return setError("Escribe tu nombre.");
    if (!cleanEmail.endsWith(`@${EMAIL_DOMAIN}`)) {
      return setError(`Usa tu correo institucional @${EMAIL_DOMAIN}.`);
    }
    login(name.trim(), cleanEmail);
    router.replace("/inicio");
  }

  function demo() {
    login("Ana López", `ana.lopez@${EMAIL_DOMAIN}`);
    router.replace("/inicio");
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-brand-500 px-6 pt-12 pb-16 text-white">
        <div className="absolute -top-16 -right-16 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute top-24 -right-6 size-24 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-ink">
            <Logo small />
          </span>
          <h1 className="mt-8 text-4xl leading-[1.05] font-extrabold tracking-tight">
            Tu comida,
            <br />
            directo a tu salón.
          </h1>
          <p className="mt-3 max-w-xs text-white/85">
            Pide a los locales del campus y recíbelo entre clases. Sin filas, sin correr.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <Zap className="size-3.5" /> Pide al momento
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <CalendarClock className="size-3.5" /> Agenda un día antes
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <MapPin className="size-3.5" /> Entrega en tu salón
            </li>
          </ul>
        </div>
      </section>

      <form onSubmit={submit} className="-mt-6 flex flex-1 flex-col rounded-t-[28px] bg-canvas px-6 pt-8 pb-8">
        <h2 className="text-xl font-bold">Entra con tu cuenta</h2>
        <p className="mt-1 text-sm text-muted">Solo para la comunidad universitaria.</p>

        <label className="mt-6 block">
          <span className="text-sm font-semibold">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Ana López"
            className="mt-2 h-14 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-line outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">Correo institucional</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={`nombre.apellido@${EMAIL_DOMAIN}`}
            className="mt-2 h-14 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-line outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-brand-500"
          />
        </label>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" block className="mt-6">
          Continuar <ArrowRight className="size-5" />
        </Button>
        <Button variant="ghost" block className="mt-2" onClick={demo}>
          Entrar con cuenta de demostración
        </Button>

        <div className="mt-auto pt-10 text-center text-xs text-muted">
          ¿Trabajas en el campus?{" "}
          <Link href="/panel" className="font-semibold text-ink underline underline-offset-2">
            Panel de local
          </Link>{" "}
          ·{" "}
          <Link href="/repartidor" className="font-semibold text-ink underline underline-offset-2">
            Repartidor
          </Link>
        </div>
      </form>
    </main>
  );
}
