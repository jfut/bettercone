import { SecuritySettingsCards } from "@daveyplate/better-auth-ui";
import { DemoLayout } from "@/components/layouts";

export default function SecuritySettingsCardsDemo() {
  return (
    <DemoLayout
      title="SecuritySettingsCards"
      description="All security settings combined"
      category="Combined Views"
    >
      <SecuritySettingsCards />
    </DemoLayout>
  );
}
