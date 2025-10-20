import { PasskeysCard } from "@daveyplate/better-auth-ui";
import { DemoLayout } from "@/components/layouts";

export default function PasskeysDemo() {
  return (
    <DemoLayout
      title="PasskeysCard"
      description="Manage passkeys/WebAuthn"
      category="Security"
    >
      <PasskeysCard />
    </DemoLayout>
  );
}
