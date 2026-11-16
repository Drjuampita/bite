import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-white text-ink ring-1 ring-line hover:bg-canvas",
  ghost: "text-ink hover:bg-black/5",
  danger: "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
}

function classes({ variant = "primary", size = "md", block, className }: Omit<StyleProps, "children">) {
  return [base, variants[variant], sizes[size], block ? "w-full" : "", className ?? ""].join(" ");
}

export function Button({
  variant,
  size,
  block,
  className,
  ...props
}: StyleProps & ComponentProps<"button">) {
  return <button type="button" className={classes({ variant, size, block, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: StyleProps & ComponentProps<typeof Link>) {
  return <Link className={classes({ variant, size, block, className })} {...props} />;
}
