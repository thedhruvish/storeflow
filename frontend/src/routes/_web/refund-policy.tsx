import { createFileRoute } from "@tanstack/react-router";
import RefundPolicy from "@/pages/web/legal/refund-policy";

export const Route = createFileRoute("/_web/refund-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <RefundPolicy />
    </div>
  );
}
