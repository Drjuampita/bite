"use client";

import { Clock, Star } from "lucide-react";
import Link from "next/link";
import { vendorOpenNow } from "@/lib/schedule";
import { useBite } from "@/lib/store";
import type { Vendor } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export function VendorCover({ vendor, className = "h-36" }: { vendor: Vendor; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${vendor.cover} ${className}`}>
      <span className="absolute -right-4 -bottom-6 text-[110px] leading-none opacity-90 drop-shadow-lg select-none" aria-hidden="true">
        {vendor.emoji}
      </span>
      <span className="absolute top-4 left-4 text-[44px] leading-none opacity-25 select-none" aria-hidden="true">
        {vendor.emoji}
      </span>
    </div>
  );
}

export function OpenPill({ vendor }: { vendor: Vendor }) {
  const { settings } = useBite();
  const now = useNow();
  const open = vendorOpenNow(vendor, now, settings.demoMode);
  return open.available ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" /> Abierto
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Solo agendar · {open.reason}
    </span>
  );
}

export function VendorMeta({ vendor }: { vendor: Vendor }) {
  return (
    <span className="flex items-center gap-3 text-xs font-medium text-muted">
      <span className="inline-flex items-center gap-1">
        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {vendor.rating.toFixed(1)}
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" /> {vendor.prepTime}
      </span>
    </span>
  );
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/local/${vendor.id}`}
      className="block overflow-hidden rounded-card bg-white shadow-card ring-1 ring-line/60 transition active:scale-[0.99]"
    >
      <VendorCover vendor={vendor} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">{vendor.name}</h3>
            <p className="truncate text-sm text-muted">{vendor.tagline}</p>
          </div>
          <OpenPill vendor={vendor} />
        </div>
        <div className="mt-3">
          <VendorMeta vendor={vendor} />
        </div>
      </div>
    </Link>
  );
}
