import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import { OrganizationMembersCard } from "@daveyplate/better-auth-ui";
import { OrganizationSettingsCards } from "@daveyplate/better-auth-ui";
import { DemoPageTemplate } from "@/components/layouts";

export default function OrganizationManagementPage() {
  return (
    <DemoPageTemplate
      title="Organization Management"
      description="Manage your teams, members, and organization settings"
    >
      <div className="flex justify-center mb-8">
        <OrganizationSwitcher />
      </div>

      <div className="grid gap-6">
        <OrganizationMembersCard />
        <OrganizationSettingsCards />
      </div>
    </DemoPageTemplate>
  );
}