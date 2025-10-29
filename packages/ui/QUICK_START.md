# @bettercone/ui - Quick Start Guide

## Installation

```bash
pnpm add @bettercone/ui better-auth
# or
npm install @bettercone/ui better-auth
# or
yarn add @bettercone/ui better-auth
```

## Usage Examples

### Billing Page Example

```tsx
"use client";

import {
  BillingDashboard,
  type BetterAuthClient
} from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

export default function BillingPage() {
  const handleManageSubscription = async (subscription, organization) => {
    // Create Stripe billing portal session
    const response = await fetch("/api/billing/portal", {
      method: "POST",
      body: JSON.stringify({ organizationId: organization?.id })
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  const handleManagePayment = async (subscription, organization) => {
    // Same as above - opens billing portal
    const response = await fetch("/api/billing/portal", {
      method: "POST",
      body: JSON.stringify({ organizationId: organization?.id })
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>
      
      <BillingDashboard
        authClient={authClient}
        layout="grid"
        subscriptionCardProps={{
          onManageSubscription: handleManageSubscription,
          onAction: (action, subscription) => {
            if (action === "upgrade") {
              window.location.href = "/pricing";
            }
          }
        }}
        paymentMethodCardProps={{
          onManagePayment: handleManagePayment
        }}
        invoiceHistoryCardProps={{
          onViewInvoices: handleManageSubscription,
          maxInvoices: 5
        }}
      />
    </div>
  );
}
```

### Pricing Page Example

```tsx
"use client";

import { PricingCard, type PricingPlan } from "@bettercone/ui";
import { useRouter } from "next/navigation";

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals",
    priceMonthly: 9,
    priceYearly: 90,
    features: [
      "10,000 API calls/month",
      "1GB storage",
      "Basic analytics",
      "Email support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Unlimited API calls",
      "10GB storage",
      "Advanced analytics",
      "Priority support",
      "Custom integrations"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "SAML SSO",
      "Dedicated support",
      "SLA guarantee"
    ]
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  const handleSubscribe = async (planId: string, billingInterval: string) => {
    // Create Stripe checkout session
    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planId, interval: billingInterval })
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose the plan that's right for you
        </p>
        
        {/* Billing interval toggle */}
        <div className="inline-flex rounded-lg border p-1">
          <button
            onClick={() => setInterval("monthly")}
            className={cn(
              "px-4 py-2 rounded-md transition",
              interval === "monthly" && "bg-primary text-primary-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("yearly")}
            className={cn(
              "px-4 py-2 rounded-md transition",
              interval === "yearly" && "bg-primary text-primary-foreground"
            )}
          >
            Yearly (Save 17%)
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingInterval={interval}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
}
```

### Usage Dashboard Example

```tsx
"use client";

import { UsageDashboard } from "@bettercone/ui";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function UsagePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];

  // Fetch usage data from your backend
  const usageData = useQuery(
    api.usage.getCurrentUsage,
    session?.user?.id
      ? { userId: session.user.id, organizationId: activeOrg?.id }
      : "skip"
  );

  const featureAccess = useQuery(
    api.usage.getFeatureAccess,
    session?.user?.id
      ? { userId: session.user.id, organizationId: activeOrg?.id }
      : "skip"
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Usage & Limits</h1>
      
      <UsageDashboard
        apiUsage={usageData ? {
          current: usageData.apiCalls,
          limit: usageData.apiLimit
        } : undefined}
        storageUsage={usageData ? {
          currentBytes: usageData.storageBytes,
          limitBytes: usageData.storageLimit
        } : undefined}
        featureAccess={featureAccess}
        isLoading={!usageData || !featureAccess}
        layout="stack"
        apiUsageCardProps={{
          onUpgrade: () => router.push("/pricing"),
          warningThreshold: 80
        }}
        storageUsageCardProps={{
          onUpgrade: () => router.push("/pricing"),
          warningThreshold: 90
        }}
        featureAccessCardProps={{
          onUpgrade: () => router.push("/pricing")
        }}
      />
    </div>
  );
}
```

### Team Dashboard Example

```tsx
"use client";

import { TeamDashboard } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamPage() {
  const router = useRouter();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  const { data: organizations } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];

  // Fetch subscription data (example with Convex)
  const subscription = useQuery(
    api.billing.getOrgSubscription,
    activeOrg?.id ? { organizationId: activeOrg.id } : "skip"
  );

  // Fetch seat allocation data
  const seatData = useQuery(
    api.team.getSeatAllocation,
    activeOrg?.id ? { organizationId: activeOrg.id } : "skip"
  );

  const handleManageBilling = async () => {
    const response = await fetch("/api/billing/portal", {
      method: "POST",
      body: JSON.stringify({ organizationId: activeOrg?.id })
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>
      
      <TeamDashboard
        organization={activeOrg}
        subscription={subscription}
        seatAllocation={seatData}
        isLoading={!activeOrg || !subscription || !seatData}
        layout="grid"
        showMemberList={true}
        seatAllocationCardProps={{
          onUpgrade: () => router.push("/pricing"),
          onInviteMember: () => setInviteDialogOpen(true)
        }}
        teamBillingCardProps={{
          onManageBilling: handleManageBilling,
          onChangePlan: () => router.push("/pricing")
        }}
      />

      {/* Your invite member dialog */}
      {inviteDialogOpen && <InviteMemberDialog onClose={() => setInviteDialogOpen(false)} />}
    </div>
  );
}
```

### Individual Component Usage

```tsx
import {
  SubscriptionCard,
  ApiUsageCard,
  SeatAllocationCard
} from "@bettercone/ui";

// Use components individually
export function CustomDashboard() {
  return (
    <div className="grid gap-6">
      <SubscriptionCard
        authClient={authClient}
        onManageSubscription={handleManageSubscription}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ApiUsageCard
          current={8500}
          limit={10000}
          onUpgrade={() => router.push("/pricing")}
        />
        
        <SeatAllocationCard
          data={{
            usedSeats: 8,
            totalSeats: 10,
            planName: "Pro",
            members: teamMembers
          }}
          onInviteMember={() => setDialogOpen(true)}
        />
      </div>
    </div>
  );
}
```

## Localization

```tsx
import { SubscriptionCard } from "@bettercone/ui";

<SubscriptionCard
  authClient={authClient}
  localization={{
    currentPlan: "Plan Atual",
    manageSubscription: "Gerenciar Assinatura",
    noActiveSubscription: "Nenhuma assinatura ativa",
    billingCycle: "Ciclo de Faturamento",
    nextBillingDate: "Próxima Data de Cobrança",
    organizationBilling: "Faturamento da Organização"
  }}
/>
```

## Custom Styling

```tsx
<BillingDashboard
  authClient={authClient}
  className="max-w-6xl mx-auto"
  classNames={{
    container: "bg-gray-50 p-6 rounded-lg",
    subscriptionCard: "shadow-xl",
    grid: "gap-8",
    paymentCard: "border-2",
    invoiceCard: "border-2"
  }}
/>
```

## TypeScript Support

```tsx
import type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthSubscription,
  BetterAuthOrganization,
  SubscriptionCardProps,
  PricingPlan,
  FeatureAccess,
  SeatAllocationData
} from "@bettercone/ui";

// Full type safety
const handleSubscription = async (
  subscription: BetterAuthSubscription | undefined,
  organization: BetterAuthOrganization | undefined
) => {
  // ...
};
```

## Backend Integrations

### Convex

```tsx
import { authClient } from "@convex-dev/better-auth/react";
import { SubscriptionCard } from "@bettercone/ui";

<SubscriptionCard authClient={authClient} />
```

### Prisma

```tsx
import { createAuthClient } from "better-auth/react";
import { SubscriptionCard } from "@bettercone/ui";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000"
});

<SubscriptionCard authClient={authClient} />
```

### Supabase

```tsx
import { createAuthClient } from "better-auth/react";
import { SubscriptionCard } from "@bettercone/ui";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

<SubscriptionCard authClient={authClient} />
```

## Loading States

All components include skeleton variants:

```tsx
import {
  SubscriptionCard,
  SubscriptionCardSkeleton,
  UsageDashboard,
  UsageDashboardSkeleton
} from "@bettercone/ui";

export function BillingPage() {
  const { data: subscription, isLoading } = useSubscription();

  if (isLoading) {
    return <SubscriptionCardSkeleton />;
  }

  return <SubscriptionCard authClient={authClient} />;
}

// Or use isLoading prop in dashboards
<UsageDashboard isLoading={isLoadingData} {...props} />
```

## Next Steps

- 📖 [Full Documentation](https://docs.bettercone.com)
- 💬 [Discord Community](https://discord.gg/bettercone)
- 🐛 [Report Issues](https://github.com/bettercone/bettercone/issues)
- ⭐ [Star on GitHub](https://github.com/bettercone/bettercone)
