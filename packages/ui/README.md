# @bettercone/ui

Production-ready billing, pricing, and team management components for React + Better Auth.

[![npm version](https://img.shields.io/npm/v/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![npm downloads](https://img.shields.io/npm/dm/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **12 Production-Ready Components** - Billing, usage tracking, team management, and pricing
- ⚛️ **Framework Agnostic** - Works with Next.js, Vite, Remix, or any React framework
- 🔌 **Backend Agnostic** - Works with any auth provider and backend (Convex, Prisma, Supabase, Drizzle)
- 🎨 **Fully Customizable** - Built with Tailwind CSS and shadcn/ui primitives
- 🌍 **i18n Ready** - Full localization support
- ♿ **Accessible** - WCAG 2.1 compliant components
- 📱 **Responsive** - Mobile-first design
- 🔒 **Type Safe** - Written in TypeScript with full type definitions
- ⚡ **Loading States** - Skeleton components included

## Installation

```bash
npm install @bettercone/ui better-auth
# or
pnpm add @bettercone/ui better-auth
# or
yarn add @bettercone/ui better-auth
```

## Setup

### 1. Install the package

Follow the installation steps above.

### 2. Import the CSS

Add the following import to your global CSS file (e.g., `app/globals.css` or `src/index.css`):

```css
@import "@bettercone/ui/css";
```

### 3. Configure Better Auth

Set up Better Auth in your project. See the [Better Auth documentation](https://better-auth.com) for details.

## Quick Start

### Next.js (App Router)

```tsx
"use client";

import { BillingDashboard } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client"; // Your Better Auth client

export default function BillingPage() {
  return (
    <div className="container mx-auto py-8">
      <BillingDashboard
        authClient={authClient}
        subscriptionCardProps={{
          onManageSubscription: async (subscription) => {
            // Open Stripe billing portal or your payment provider
            const response = await fetch("/api/billing/portal");
            const { url } = await response.json();
            window.location.href = url;
          }
        }}
      />
    </div>
  );
}
```

### Vite + React

```tsx
import { BillingDashboard } from "@bettercone/ui";
import { authClient } from "./lib/auth-client";

function BillingPage() {
  return (
    <div className="container mx-auto py-8">
      <BillingDashboard authClient={authClient} />
    </div>
  );
}

export default BillingPage;
```

### Remix

```tsx
import { BillingDashboard } from "@bettercone/ui";
import { authClient } from "~/lib/auth-client";

export default function BillingRoute() {
  return (
    <div className="container mx-auto py-8">
      <BillingDashboard authClient={authClient} />
    </div>
  );
}
```

## Components

### Billing Components

#### SubscriptionCard
Displays current subscription with management actions.

```tsx
import { SubscriptionCard } from "@bettercone/ui";

<SubscriptionCard
  authClient={authClient}
  onManageSubscription={async (subscription, organization) => {
    // Handle billing portal navigation
  }}
  onAction={(action, subscription) => {
    // Handle upgrade/cancel actions
  }}
  showActions={true}
  localization={{
    currentPlan: "Current Plan",
    manageSubscription: "Manage Subscription"
  }}
/>
```

#### PaymentMethodCard
Payment method management via billing portal.

```tsx
import { PaymentMethodCard } from "@bettercone/ui";

<PaymentMethodCard
  authClient={authClient}
  onManagePayment={async (subscription, organization) => {
    // Open payment management
  }}
/>
```

#### InvoiceHistoryCard
Invoice viewing and download functionality.

```tsx
import { InvoiceHistoryCard } from "@bettercone/ui";

<InvoiceHistoryCard
  authClient={authClient}
  onViewInvoices={async (subscription, organization) => {
    // Open billing portal to invoices
  }}
  maxInvoices={5}
/>
```

### Pricing Components

#### PricingCard
Plan selection with monthly/yearly toggle.

```tsx
import { PricingCard, type PricingPlan } from "@bettercone/ui";

const plan: PricingPlan = {
  id: "pro",
  name: "Pro",
  description: "For growing teams",
  priceMonthly: 29,
  priceYearly: 290,
  features: [
    "Unlimited API calls",
    "Advanced analytics",
    "Priority support"
  ],
  popular: true
};

<PricingCard
  plan={plan}
  billingInterval="monthly"
  onSubscribe={(planId, interval) => {
    // Handle subscription
  }}
/>
```

### Usage Components

#### ApiUsageCard
API call tracking with progress bars and warnings.

```tsx
import { ApiUsageCard } from "@bettercone/ui";

<ApiUsageCard
  current={8500}
  limit={10000}
  warningThreshold={80}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

#### StorageUsageCard
Storage usage tracking with alerts.

```tsx
import { StorageUsageCard } from "@bettercone/ui";

<StorageUsageCard
  currentBytes={4500000000} // 4.5GB
  limitBytes={5000000000}   // 5GB
  warningThreshold={80}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

#### FeatureAccessCard
Feature flag display with locked/unlocked states.

```tsx
import { FeatureAccessCard, type FeatureAccess } from "@bettercone/ui";

const features: FeatureAccess = {
  planId: "pro",
  advancedAnalytics: true,
  apiAccess: true,
  customIntegrations: false,
  prioritySupport: false
};

<FeatureAccessCard
  features={features}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

### Team Components

#### SeatAllocationCard
Team seat management with warnings.

```tsx
import { SeatAllocationCard, type SeatAllocationData } from "@bettercone/ui";

const data: SeatAllocationData = {
  usedSeats: 8,
  totalSeats: 10,
  planName: "Team",
  members: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" }
  ]
};

<SeatAllocationCard
  data={data}
  onUpgrade={() => {
    // Navigate to pricing
  }}
  onInviteMember={() => {
    // Open invite dialog
  }}
  showMemberList={true}
/>
```

#### TeamBillingCard
Organization-level billing summary.

```tsx
import { TeamBillingCard } from "@bettercone/ui";

<TeamBillingCard
  organization={organization}
  subscription={subscription}
  onManageBilling={() => {
    // Open billing portal
  }}
  onChangePlan={() => {
    // Navigate to pricing
  }}
/>
```

## Backend-Agnostic Architecture

All components accept a `BetterAuthClient` interface, making them compatible with any Better Auth backend:

```typescript
import type { BetterAuthClient } from "@bettercone/ui";

// Works with Convex
import { authClient } from "@convex-dev/better-auth";

// Works with Prisma
import { createAuthClient } from "better-auth/react";

// Works with Supabase, Drizzle, etc.
```

## Customization

### Class Names
All components accept `className` and `classNames` props for granular styling:

```tsx
<SubscriptionCard
  className="shadow-xl"
  classNames={{
    header: "bg-primary text-white",
    title: "text-2xl",
    content: "p-6"
  }}
/>
```

### Localization
Components support partial localization:

```tsx
<SubscriptionCard
  localization={{
    currentPlan: "Plan Atual",
    manageSubscription: "Gerenciar Assinatura",
    noActiveSubscription: "Nenhuma assinatura ativa"
  }}
/>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthSubscription,
  SubscriptionCardProps,
  PricingPlan,
  FeatureAccess
} from "@bettercone/ui";
```

## Loading States

All components include skeleton variants:

```tsx
import { SubscriptionCardSkeleton } from "@bettercone/ui";

{isLoading ? <SubscriptionCardSkeleton /> : <SubscriptionCard {...props} />}
```

## License

MIT © BetterCone

## Links

- [Documentation](https://docs.bettercone.com)
- [GitHub](https://github.com/bettercone/bettercone)
- [Discord](https://discord.gg/bettercone)
- [Better Auth](https://better-auth.com)
