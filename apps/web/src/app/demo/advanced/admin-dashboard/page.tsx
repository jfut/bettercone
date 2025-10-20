import { AccountSettingsCards } from "@daveyplate/better-auth-ui";
import { SecuritySettingsCards } from "@daveyplate/better-auth-ui";
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import { ApiKeysCard } from "@daveyplate/better-auth-ui";
import { AdminDashboardTemplate } from "@/components/layouts";

export default function AdminDashboardPage() {
  return (
    <AdminDashboardTemplate
      title="Admin Dashboard"
      description="Comprehensive admin interface for managing users, security, and organization settings"
      headerContent={<OrganizationSwitcher />}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <AccountSettingsCards />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Security Settings</h2>
          <SecuritySettingsCards />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">API Management</h2>
        <ApiKeysCard />
      </div>
    </AdminDashboardTemplate>
  );
}