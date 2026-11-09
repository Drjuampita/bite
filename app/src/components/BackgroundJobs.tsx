"use client";

import { useEffect } from "react";
import { tickBackgroundJobs } from "@/lib/store";

/** Ejecuta las tareas periódicas del MVP (activar agendados, simular avance en la demo). */
export function BackgroundJobs() {
  useEffect(() => {
    tickBackgroundJobs();
    const id = window.setInterval(tickBackgroundJobs, 3000);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
