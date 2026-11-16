import { useId } from "react";

/** Marca de Bite Delivery: un repartidor en scooter que lleva la galleta mordida. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  const maskId = `bite-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#e5386d" />
      <mask id={maskId}>
      <rect width="512" height="512" fill="#fff"/>
      <circle cx="447" cy="88" r="25" fill="#000"/>
      <circle cx="462" cy="118" r="19" fill="#000"/>
      </mask>
      <circle cx="142" cy="404" r="34" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="22"/>
      <circle cx="380" cy="404" r="34" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="22"/>
      <path d="M150 398 H318 M380 404 L338 250 M312 244 L366 254" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="22"/>
      <path d="M236 386 L224 296 L250 206 M250 214 L326 250 M250 208 L352 160" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="30"/>
      <circle cx="270" cy="150" r="36" fill="#fff"/>
      <rect x="142" y="196" width="78" height="96" rx="20" fill="#fff" transform="rotate(14 181 244)"/>
      <circle cx="402" cy="132" r="58" fill="#fff" mask={`url(#${maskId})`}/>
    </svg>
  );
}

export function Logo({ className = "", small = false }: { className?: string; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={small ? "size-7" : "size-9"} />
      <span className="flex flex-col leading-none">
        <span className={`${small ? "text-xl" : "text-2xl"} font-extrabold tracking-tight`}>bite</span>
        <span className="text-[9px] font-semibold tracking-[0.18em] opacity-70">DELIVERY</span>
      </span>
    </span>
  );
}
