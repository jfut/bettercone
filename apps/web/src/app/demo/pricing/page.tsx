/**
 * Pricing Demo Page
 * Demonstrates modular pricing components with Better Auth UI patterns
 */

import { PricingDashboard } from "@/components/pricing";
import { DemoLayout } from "@/components/layouts/demo-layout";

export default function PricingDemoPage() {
  return (
    <DemoLayout
      title="Pricing Dashboard"
      description="Complete pricing page with Stripe integration, Better Auth organizations, responsive design, and full localization support. Features monthly/yearly billing toggle, organization selector for team plans, and skeleton loaders."
      category="B2B SaaS"
    >
      <PricingDashboard
        successUrl="/demo/billing/current-plan"
        cancelUrl="/demo/pricing"
        defaultInterval="monthly"
        showFooter={true}
      />
    </DemoLayout>
  );
}
