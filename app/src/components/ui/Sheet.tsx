"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Contenido fijo al fondo (botón de acción). */
  footer?: ReactNode;
  label: string;
}

/** Hoja inferior estilo app móvil. */
export function Sheet({ open, onClose, children, footer, label }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true" aria-label={label}>
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 animate-fade-in bg-black/40"
        onClick={onClose}
      />
      <div className="relative mt-auto flex max-h-[92dvh] w-full max-w-[440px] animate-sheet-up flex-col overflow-hidden rounded-t-[28px] bg-white">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-line"
        >
          <X className="size-4" />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  );
}
