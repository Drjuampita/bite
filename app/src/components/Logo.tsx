import { useId } from "react";

/** Marca de Bite: un círculo con una mordida. Placeholder hasta la fase de diseño. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  const maskId = `bite-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#ff5b14" />
      <mask id={maskId}>
        <rect width="512" height="512" fill="#fff" />
        <circle cx="372" cy="150" r="64" fill="#000" />
        <circle cx="410" cy="226" r="48" fill="#000" />
      </mask>
      <circle cx="256" cy="268" r="150" fill="#fff" mask={`url(#${maskId})`} />
    </svg>
  );
}

export function Logo({ className = "", small = false }: { className?: string; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={small ? "size-7" : "size-9"} />
      <span className={`${small ? "text-xl" : "text-2xl"} font-extrabold tracking-tight`}>bite</span>
    </span>
  );
}
