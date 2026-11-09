"use client";

import { ChevronDown } from "lucide-react";
import { BUILDINGS } from "@/lib/data/campus";
import type { DeliveryLocation } from "@/lib/types";

interface LocationPickerProps {
  value: DeliveryLocation | null;
  onChange: (value: DeliveryLocation) => void;
}

/** Selección de edificio (chips) y salón (lista). */
export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const building = BUILDINGS.find((b) => b.id === value?.building) ?? null;

  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Edificio" className="grid grid-cols-5 gap-2">
        {BUILDINGS.map((b) => {
          const active = b.id === value?.building;
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={b.name}
              onClick={() => onChange({ building: b.id, room: b.rooms[0] })}
              className={`flex h-14 flex-col items-center justify-center rounded-2xl text-lg font-extrabold transition ${
                active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line"
              }`}
            >
              {b.id}
              <span className={`text-[10px] font-medium ${active ? "text-white/70" : "text-muted"}`}>Edif.</span>
            </button>
          );
        })}
      </div>
      <label className="relative block">
        <span className="sr-only">Salón</span>
        <select
          value={value?.room ?? ""}
          disabled={!building}
          onChange={(e) => building && onChange({ building: building.id, room: e.target.value })}
          className="h-14 w-full appearance-none rounded-2xl bg-white px-4 text-base font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-brand-500 disabled:text-muted"
        >
          {!building && <option value="">Primero elige un edificio</option>}
          {building?.rooms.map((room) => (
            <option key={room} value={room}>
              Salón {room}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
      </label>
    </div>
  );
}
