import { UpdateNameCard } from "@daveyplate/better-auth-ui";
import { DemoLayout } from "@/components/layouts";

export default function UpdateNameDemo() {
  return (
    <DemoLayout
      title="UpdateNameCard"
      description="Update display name"
      category="Account Settings"
    >
      <UpdateNameCard />
    </DemoLayout>
  );
}
