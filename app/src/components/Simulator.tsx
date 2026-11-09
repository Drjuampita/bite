"use client";

import { useEffect } from "react";
import { tickSimulation } from "@/lib/store";

/** Avanza los pedidos "Ahora" en segundo plano para que el seguimiento se vea vivo en la demo. */
export function Simulator() {
  useEffect(() => {
    const id = window.setInterval(tickSimulation, 3000);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
