"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

// Import components for live preview
import { 
  SecuritySettingsCards, 
  AccountSettingsCards,
  OrganizationSettingsCards,
  OrganizationMembersCard,
  OrganizationInvitationsCard,
  UpdateAvatarCard,
  UpdateNameCard,
  TwoFactorCard,
  PasskeysCard,
  SessionsCard,
} from "@daveyplate/better-auth-ui";

import {
  BillingDashboard,
  SubscriptionCard,
  PaymentMethodCard,
  InvoiceHistoryCard,
  PricingDashboard,
  PricingCard,
  PricingHeader,
  TeamDashboard,
  SeatAllocationCard,
  TeamBillingCard,
  UsageDashboard,
  ApiUsageCard,
  StorageUsageCard,
  FeatureAccessCard,
} from "@/components";

const exampleData: Record<string, any> = {
  "billing": {
    title: "Billing Page",
    description: "Complete billing management with subscriptions, payments, and invoices",
    category: "Billing",
    component: BillingDashboard,
    usage: `import { BillingDashboard } from '@/components';

export default function BillingPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>
      <BillingDashboard />
    </div>
  );
}`
  },
  "pricing": {
    title: "Pricing Page",
    description: "Pricing plans with monthly/yearly toggle and Stripe checkout",
    category: "Pricing",
    component: PricingDashboard,
    usage: `import { PricingDashboard } from '@/components';

export default function PricingPage() {
  return (
    <div className="container py-8">
      <PricingDashboard
        successUrl="/dashboard"
        cancelUrl="/pricing"
      />
    </div>
  );
}`
  },
  "team": {
    title: "Team Page",
    description: "Team management with members, roles, and seat allocation",
    category: "Team",
    component: TeamDashboard,
    usage: `import { TeamDashboard } from '@/components';

export default function TeamPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Team</h1>
      <TeamDashboard />
    </div>
  );
}`
  },
  "usage": {
    title: "Usage Page",
    description: "Track API usage, storage, and feature access",
    category: "Usage",
    component: UsageDashboard,
    usage: `import { UsageDashboard } from '@/components';

export default function UsagePage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Usage</h1>
      <UsageDashboard />
    </div>
  );
}`
  },
  "settings": {
    title: "Settings Page",
    description: "Combined account and security settings",
    category: "Settings",
    component: () => (
      <div className="space-y-6">
        <AccountSettingsCards />
        <SecuritySettingsCards />
      </div>
    ),
    usage: `import { AccountSettingsCards, SecuritySettingsCards } from '@daveyplate/better-auth-ui';

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <AccountSettingsCards />
        <SecuritySettingsCards />
      </div>
    </div>
  );
}`
  },
  "account": {
    title: "Account Page",
    description: "User profile and account preferences",
    category: "Account",
    component: AccountSettingsCards,
    usage: `import { AccountSettingsCards } from '@daveyplate/better-auth-ui';

export default function AccountPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Account</h1>
      <AccountSettingsCards />
    </div>
  );
}`
  },
  "security": {
    title: "Security Page",
    description: "Password, 2FA, passkeys, and session management",
    category: "Security",
    component: SecuritySettingsCards,
    usage: `import { SecuritySettingsCards } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Security</h1>
      <SecuritySettingsCards />
    </div>
  );
}`
  },
  "organization": {
    title: "Organization Page",
    description: "Organization settings and member management",
    category: "Organization",
    component: OrganizationSettingsCards,
    usage: `import { OrganizationSettingsCards } from '@daveyplate/better-auth-ui';

export default function OrganizationPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Organization</h1>
      <OrganizationSettingsCards />
    </div>
  );
}`
  }
};

export default function ExampleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const data = exampleData[slug];

  if (!data) {
    notFound();
  }

  const Component = data.component;

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/examples">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Examples
          </Link>
        </Button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <Badge variant="outline">{data.category}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Live Preview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
          <Card className="p-6">
            <Component />
          </Card>
        </section>

        {/* Usage Code */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Implementation</h2>
          <Card>
            <CardContent className="p-6">
              <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{data.usage}</code>
              </pre>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
