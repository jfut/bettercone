"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Import the actual components
// Better Auth UI Components
import { 
  SecuritySettingsCards, 
  AccountSettingsCards, 
  OrganizationSwitcher, 
  OrganizationSettingsCards,
  UserButton,
  AuthView,
  SignedIn,
  SignedOut,
  PasskeysCard,
  SessionsCard,
  TwoFactorCard,
  ProvidersCard,
  ChangePasswordCard,
  ChangeEmailCard,
  UpdateAvatarCard,
  OrganizationMembersCard,
  OrganizationInvitationsCard
} from "@daveyplate/better-auth-ui";

// BetterCone Components - Clean imports from single index
import {
  BillingDashboard,
  SubscriptionCard,
  PaymentMethodCard,
  InvoiceHistoryCard,
  PricingDashboard,
  PricingCard,
  TeamDashboard,
  SeatAllocationCard,
  TeamBillingCard,
  UsageDashboard,
  ApiUsageCard,
  StorageUsageCard,
  FeatureAccessCard,
} from "@/components";

const componentData: Record<string, any> = {
  // Authentication Components
  "security-settings-cards": {
    name: "SecuritySettingsCards",
    description: "Complete security management with password, 2FA, passkeys, and session tracking",
    category: "Authentication",
    component: SecuritySettingsCards,
    usage: `import { SecuritySettingsCards } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return <SecuritySettingsCards />;
}`
  },
  "account-settings-cards": {
    name: "AccountSettingsCards",
    description: "User profile editing and account preferences management",
    category: "Authentication",
    component: AccountSettingsCards,
    usage: `import { AccountSettingsCards } from '@daveyplate/better-auth-ui';

export default function AccountPage() {
  return <AccountSettingsCards />;
}`
  },
  "user-button": {
    name: "UserButton",
    description: "User menu dropdown with profile and sign out",
    category: "Authentication",
    component: UserButton,
    usage: `import { UserButton } from '@daveyplate/better-auth-ui';

export default function Header() {
  return <UserButton />;
}`
  },
  "auth-view": {
    name: "AuthView",
    description: "Complete authentication UI with sign in, sign up, and password reset",
    category: "Authentication",
    component: AuthView,
    usage: `import { AuthView } from '@daveyplate/better-auth-ui';

export default function SignInPage() {
  return (
    <AuthView 
      view="sign-in"
      redirectTo="/dashboard"
    />
  );
}`
  },
  "signed-in-out": {
    name: "SignedIn / SignedOut",
    description: "Conditional rendering based on authentication state",
    category: "Authentication",
    component: () => (
      <div className="space-y-4">
        <SignedIn>
          <div className="p-4 border rounded-lg">You are signed in!</div>
        </SignedIn>
        <SignedOut>
          <div className="p-4 border rounded-lg">You are signed out!</div>
        </SignedOut>
      </div>
    ),
    usage: `import { SignedIn, SignedOut } from '@daveyplate/better-auth-ui';

export default function Page() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}`
  },
  "passkeys-card": {
    name: "PasskeysCard",
    description: "Manage passkey credentials for passwordless authentication",
    category: "Authentication",
    component: PasskeysCard,
    usage: `import { PasskeysCard } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return <PasskeysCard />;
}`
  },
  "sessions-card": {
    name: "SessionsCard",
    description: "View and manage active sessions across devices",
    category: "Authentication",
    component: SessionsCard,
    usage: `import { SessionsCard } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return <SessionsCard />;
}`
  },
  "two-factor-card": {
    name: "TwoFactorCard",
    description: "Enable and configure two-factor authentication",
    category: "Authentication",
    component: TwoFactorCard,
    usage: `import { TwoFactorCard } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return <TwoFactorCard />;
}`
  },
  "providers-card": {
    name: "ProvidersCard",
    description: "Link and manage social authentication providers",
    category: "Authentication",
    component: ProvidersCard,
    usage: `import { ProvidersCard } from '@daveyplate/better-auth-ui';

export default function AccountPage() {
  return <ProvidersCard />;
}`
  },
  "change-password-card": {
    name: "ChangePasswordCard",
    description: "Update user password with validation",
    category: "Authentication",
    component: ChangePasswordCard,
    usage: `import { ChangePasswordCard } from '@daveyplate/better-auth-ui';

export default function SecurityPage() {
  return <ChangePasswordCard />;
}`
  },
  "change-email-card": {
    name: "ChangeEmailCard",
    description: "Update user email address with verification",
    category: "Authentication",
    component: ChangeEmailCard,
    usage: `import { ChangeEmailCard } from '@daveyplate/better-auth-ui';

export default function AccountPage() {
  return <ChangeEmailCard />;
}`
  },
  "update-avatar-card": {
    name: "UpdateAvatarCard",
    description: "Upload and manage user profile picture",
    category: "Authentication",
    component: UpdateAvatarCard,
    usage: `import { UpdateAvatarCard } from '@daveyplate/better-auth-ui';

export default function AccountPage() {
  return <UpdateAvatarCard />;
}`
  },
  
  // Organization Components
  "organization-switcher": {
    name: "OrganizationSwitcher",
    description: "Multi-organization selector with creation dialog",
    category: "Organizations",
    component: OrganizationSwitcher,
    usage: `import { OrganizationSwitcher } from '@daveyplate/better-auth-ui';

export default function Header() {
  return <OrganizationSwitcher />;
}`
  },
  "organization-settings-cards": {
    name: "OrganizationSettingsCards",
    description: "Complete organization settings including name, logo, and members",
    category: "Organizations",
    component: OrganizationSettingsCards,
    usage: `import { OrganizationSettingsCards } from '@daveyplate/better-auth-ui';

export default function OrgSettingsPage() {
  return <OrganizationSettingsCards />;
}`
  },
  "team-dashboard": {
    name: "TeamDashboard",
    description: "Team management with members, roles, and seat allocation",
    category: "Organizations",
    component: TeamDashboard,
    usage: `import { TeamDashboard } from '@/components/team';

export default function TeamPage() {
  return <TeamDashboard />;
}`
  },
  "seat-allocation-card": {
    name: "SeatAllocationCard",
    description: "Manage organization seat usage and limits",
    category: "Organizations",
    component: SeatAllocationCard,
    usage: `import { SeatAllocationCard } from '@/components/team';

export default function TeamPage() {
  return <SeatAllocationCard />;
}`
  },
  "team-billing-card": {
    name: "TeamBillingCard",
    description: "Organization billing summary with plan details",
    category: "Organizations",
    component: TeamBillingCard,
    usage: `import { TeamBillingCard } from '@/components/team';

export default function TeamPage() {
  return <TeamBillingCard />;
}`
  },
  "organization-members-card": {
    name: "OrganizationMembersCard",
    description: "View and manage organization members and roles",
    category: "Organizations",
    component: OrganizationMembersCard,
    usage: `import { OrganizationMembersCard } from '@daveyplate/better-auth-ui';

export default function TeamPage() {
  return <OrganizationMembersCard />;
}`
  },
  "organization-invitations-card": {
    name: "OrganizationInvitationsCard",
    description: "Manage pending organization invitations",
    category: "Organizations",
    component: OrganizationInvitationsCard,
    usage: `import { OrganizationInvitationsCard } from '@daveyplate/better-auth-ui';

export default function TeamPage() {
  return <OrganizationInvitationsCard />;
}`
  },
  
  // Billing Components
  "billing-dashboard": {
    name: "BillingDashboard",
    description: "Complete billing overview with subscription, payments, and invoices",
    category: "Billing",
    component: BillingDashboard,
    usage: `import { BillingDashboard } from '@/components/billing';

export default function BillingPage() {
  return <BillingDashboard />;
}`
  },
  "pricing-dashboard": {
    name: "PricingDashboard",
    description: "Pricing table with monthly/yearly toggle and Stripe Checkout",
    category: "Billing",
    component: PricingDashboard,
    usage: `import { PricingDashboard } from '@/components/pricing';

export default function PricingPage() {
  return (
    <PricingDashboard
      successUrl="/dashboard"
      cancelUrl="/pricing"
    />
  );
}`
  },
  "subscription-card": {
    name: "SubscriptionCard",
    description: "Current subscription details with upgrade and cancel options",
    category: "Billing",
    component: SubscriptionCard,
    usage: `import { SubscriptionCard } from '@/components/billing';

export default function BillingPage() {
  return <SubscriptionCard />;
}`
  },
  "payment-method-card": {
    name: "PaymentMethodCard",
    description: "Manage payment methods and billing information",
    category: "Billing",
    component: PaymentMethodCard,
    usage: `import { PaymentMethodCard } from '@/components/billing';

export default function BillingPage() {
  return <PaymentMethodCard />;
}`
  },
  "invoice-history-card": {
    name: "InvoiceHistoryCard",
    description: "View and download past invoices",
    category: "Billing",
    component: InvoiceHistoryCard,
    usage: `import { InvoiceHistoryCard } from '@/components/billing';

export default function BillingPage() {
  return <InvoiceHistoryCard />;
}`
  },
  "pricing-card": {
    name: "PricingCard",
    description: "Individual pricing plan card with features and CTA",
    category: "Billing",
    component: () => (
      <PricingCard 
        plan={{
          id: 'pro',
          name: 'Pro',
          description: 'For growing teams',
          price: { monthly: 2900, yearly: 29000 },
          features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
          popular: true
        }}
        billingInterval="monthly"
        onSubscribe={() => console.log('Subscribe clicked')}
      />
    ),
    usage: `import { PricingCard } from '@/components/pricing';

export default function PricingPage() {
  return (
    <PricingCard 
      plan={plan}
      billingInterval="monthly"
      onSubscribe={handleSubscribe}
    />
  );
}`
  },
  
  // Usage Components
  "usage-dashboard": {
    name: "UsageDashboard",
    description: "Complete usage tracking dashboard with API, storage, and features",
    category: "Usage",
    component: UsageDashboard,
    usage: `import { UsageDashboard } from '@/components/usage';

export default function UsagePage() {
  return <UsageDashboard />;
}`
  },
  "api-usage-card": {
    name: "ApiUsageCard",
    description: "Track API calls and rate limits",
    category: "Usage",
    component: ApiUsageCard,
    usage: `import { ApiUsageCard } from '@/components/usage';

export default function UsagePage() {
  return <ApiUsageCard />;
}`
  },
  "storage-usage-card": {
    name: "StorageUsageCard",
    description: "Monitor storage usage and limits",
    category: "Usage",
    component: StorageUsageCard,
    usage: `import { StorageUsageCard } from '@/components/usage';

export default function UsagePage() {
  return <StorageUsageCard />;
}`
  },
  "feature-access-card": {
    name: "FeatureAccessCard",
    description: "Display available features based on plan",
    category: "Usage",
    component: FeatureAccessCard,
    usage: `import { FeatureAccessCard } from '@/components/usage';

export default function UsagePage() {
  return <FeatureAccessCard />;
}`
  }
};

export default function ComponentShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const data = componentData[slug];

  if (!data) {
    notFound();
  }

  const Component = data.component;

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/components">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Components
          </Link>
        </Button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{data.name}</h1>
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

        {/* Usage */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage</h2>
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
