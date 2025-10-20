/**
 * Current Plan Demo Page
 * Demonstrates the modular billing components with Better Auth UI patterns
 * Phase 1: Billing Dashboard - 93% code reduction (278 → 20 lines)
 */

import { BillingDashboard } from "@/components/billing";
import { DemoLayout } from "@/components/layouts/demo-layout";

export default function CurrentPlanPage() {
  return (
    <DemoLayout
      title="Billing Dashboard"
      description="Complete subscription and payment management with Better Auth Stripe integration. Manage your current subscription, update payment methods, and view invoice history."
      category="B2B SaaS"
    >
      <BillingDashboard />
    </DemoLayout>
  );
}