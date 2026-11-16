"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Splash } from "@/components/shell";
import { useBite } from "@/lib/store";

/** Punto de entrada: manda a inicio o a login según la sesión. */
export default function Root() {
  const { hydrated, user } = useBite();
  const router = useRouter();
  useEffect(() => {
    if (hydrated) router.replace(user ? "/inicio" : "/login");
  }, [hydrated, user, router]);
  return <Splash />;
}
