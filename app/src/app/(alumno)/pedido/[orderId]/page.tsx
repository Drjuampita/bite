import { Suspense } from "react";
import { Splash } from "@/components/shell";
import { OrderScreen } from "./OrderScreen";

// El id del pedido se genera en el navegador, así que la ruta se resuelve en el cliente.
export default function PedidoPage() {
  return (
    <Suspense fallback={<Splash />}>
      <OrderScreen />
    </Suspense>
  );
}
