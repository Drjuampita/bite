"use client";

import { MapPin } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BUILDINGS, ROOMS_PER_FLOOR, describeLocation, getBuilding, parseRoom, roomCode } from "@/lib/data/campus";
import type { DeliveryLocation } from "@/lib/types";

interface LocationPickerProps {
  value: DeliveryLocation | null;
  /** Recibe el salón completo, o null mientras falte elegir piso o salón. */
  onChange: (value: DeliveryLocation | null) => void;
}

/** Selección en tres toques: edificio → piso → salón. */
export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const initial = value ? parseRoom(value.room) : null;
  const [buildingId, setBuildingId] = useState<string | null>(initial?.building ?? null);
  const [floor, setFloor] = useState<number | null>(initial?.floor ?? null);
  const building = getBuilding(buildingId ?? undefined);
  const selectedRoom = value && parseRoom(value.room);

  function pickBuilding(id: string) {
    if (id === buildingId) return;
    setBuildingId(id);
    const floors = getBuilding(id)?.floors ?? 1;
    // Si el edificio tiene un solo piso, se elige solo.
    setFloor(floors === 1 ? 1 : null);
    onChange(null);
  }

  function pickFloor(f: number) {
    if (f === floor) return;
    setFloor(f);
    onChange(null);
  }

  return (
    <div className="space-y-4">
      <Group label="Edificio">
        <div role="radiogroup" aria-label="Edificio" className="grid grid-cols-5 gap-2">
          {BUILDINGS.map((b) => {
            const active = b.id === buildingId;
            return (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={b.name}
                onClick={() => pickBuilding(b.id)}
                className={`h-12 rounded-2xl font-extrabold transition ${b.id.length > 1 ? "text-sm" : "text-lg"} ${
                  active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line"
                }`}
              >
                {b.id}
              </button>
            );
          })}
        </div>
      </Group>

      {building && (
        <Group label="Piso">
          <div role="radiogroup" aria-label="Piso" className="flex flex-wrap gap-2">
            {Array.from({ length: building.floors }, (_, i) => i + 1).map((f) => {
              const active = f === floor;
              return (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`Piso ${f}`}
                  onClick={() => pickFloor(f)}
                  className={`grid size-12 animate-fade-in place-items-center rounded-full text-base font-bold transition ${
                    active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      {building && floor && (
        <Group label="Salón">
          <div role="radiogroup" aria-label="Salón" className="grid grid-cols-5 gap-2">
            {Array.from({ length: ROOMS_PER_FLOOR }, (_, i) => i + 1).map((r) => {
              const code = roomCode(building.id, floor, r);
              const active = value?.room === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ building: building.id, room: code })}
                  className={`h-11 animate-fade-in rounded-xl text-sm font-bold tabular-nums transition ${
                    active ? "bg-brand-500 text-white" : "bg-white text-ink ring-1 ring-line"
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      {value && selectedRoom && (
        <p className="flex animate-fade-in items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <MapPin className="size-4 shrink-0" />
          <span>
            <span className="font-bold">Salón {value.room}</span> · {describeLocation(value)}
          </span>
        </p>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">{label}</p>
      {children}
    </div>
  );
}
