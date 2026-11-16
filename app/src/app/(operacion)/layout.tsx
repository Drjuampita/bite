import { OpsNav } from "./OpsNav";

export default function OperacionLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh bg-canvas">
      <OpsNav />
      <div className="mx-auto max-w-5xl px-4 pb-16">{children}</div>
    </div>
  );
}
