import { AccountsCard } from "@daveyplate/better-auth-ui";
import { DemoLayout } from "@/components/layouts";

export default function AccountsDemo() {
  return (
    <DemoLayout
      title="AccountsCard"
      description="View linked accounts"
      category="Security"
    >
      <AccountsCard />
    </DemoLayout>
  );
}
