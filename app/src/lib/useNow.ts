"use client";

import { useSyncExternalStore } from "react";

// Reloj compartido que se actualiza cada 30 s, para que la disponibilidad de horarios
// se recalcule sola sin que cada componente cree su propio temporizador.

let current: Date | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      current = new Date();
      listeners.forEach((l) => l());
    }, 30_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot(): Date {
  current ??= new Date();
  return current;
}

const SERVER_DATE = new Date(0);

export function useNow(): Date {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_DATE);
}
