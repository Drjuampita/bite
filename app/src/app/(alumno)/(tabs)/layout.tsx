import { BottomNav } from "@/components/BottomNav";
import { RequireUser } from "@/components/shell";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <RequireUser>
      <div className="flex flex-1 flex-col pb-24">{children}</div>
      <BottomNav />
    </RequireUser>
  );
}
