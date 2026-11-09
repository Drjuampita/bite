"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  /** Muestra un bote de basura cuando la cantidad es 1 (en el carrito). */
  removable?: boolean;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, onChange, min = 1, removable, size = "md" }: QuantityStepperProps) {
  const btn = size === "sm" ? "size-8" : "size-10";
  const showTrash = removable && value <= 1;
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-canvas p-1 ring-1 ring-line">
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full bg-white text-ink shadow-sm disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={!removable && value <= min}
        aria-label={showTrash ? "Quitar" : "Menos"}
      >
        {showTrash ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
      </button>
      <span className="min-w-7 text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full bg-white text-ink shadow-sm`}
        onClick={() => onChange(value + 1)}
        aria-label="Más"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
