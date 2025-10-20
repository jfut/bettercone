import { ApiKeysCard } from "@daveyplate/better-auth-ui";
import { DemoPageTemplate } from "@/components/layouts";

export default function ApiManagementPage() {
  return (
    <DemoPageTemplate
      title="API Management"
      description="Manage your API keys and access tokens for integrating with our platform"
    >
      <div className="grid gap-6">
        <ApiKeysCard />
      </div>
    </DemoPageTemplate>
  );
}