import { createFileRoute } from "@tanstack/react-router";
import TermsAndConditions from "@/pages/web/legal/terms-and-conditions";

export const Route = createFileRoute("/_web/terms-and-conditions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TermsAndConditions />
    </div>
  );
}
