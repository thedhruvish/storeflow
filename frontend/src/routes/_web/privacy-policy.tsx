import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/web/legal/privacy-policy";

export const Route = createFileRoute("/_web/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
