import { notFound } from "next/navigation";
import { VENDORS, getVendor } from "@/lib/data/vendors";
import { VendorScreen } from "./VendorScreen";

export function generateStaticParams() {
  return VENDORS.map((v) => ({ vendorId: v.id }));
}

export default async function VendorPage({ params }: PageProps<"/local/[vendorId]">) {
  const { vendorId } = await params;
  if (!getVendor(vendorId)) notFound();
  return <VendorScreen vendorId={vendorId} />;
}
