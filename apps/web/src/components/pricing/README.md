# Pricing Components

A comprehensive set of pricing components built following better-auth-ui patterns and conventions. These components provide a complete pricing page solution with Stripe integration, Better Auth organization support, and full TypeScript type safety.

## Components

### PricingDashboard

The main orchestrator component that manages the pricing page layout and state.

**Features:**
- Better Auth hooks integration (`useSession`, `organization.list`)
- Responsive grid layout for pricing cards
- Billing interval toggle (monthly/yearly)
- Organization-aware for team plans
- Full TypeScript support with granular classNames
- Localization support
- Loading states with skeleton components

**Usage:**

```tsx
import { PricingDashboard } from "@/components/pricing";

export default function PricingPage() {
  return (
    <PricingDashboard
      successUrl="/billing/success"
      cancelUrl="/billing/cancel"
      defaultInterval="monthly"
      showFooter={true}
    />
  );
}
```

**Props:**

```typescript
interface PricingDashboardProps {
  className?: string;
  classNames?: {
    container?: string;
    header?: string;
    grid?: string;
    footer?: string;
  };
  successUrl?: string;
  cancelUrl?: string;
  defaultInterval?: BillingInterval;
  showFooter?: boolean;
}
```

### PricingCard

Individual pricing plan card with features, pricing, and CTA.

**Features:**
- Popular plan highlighting
- Yearly savings calculation
- Team plan organization selector
- Stripe checkout integration
- Custom price formatting
- Localization support
- Granular className customization

**Usage:**

```tsx
import { PricingCard, pricingPlans } from "@/components/pricing";

<PricingCard
  plan={pricingPlans[0]}
  billingInterval="yearly"
  isLoading={false}
  onSubscribe={handleSubscribe}
  classNames={{
    base: "custom-card-class",
    header: "custom-header-class"
  }}
/>
```

**Props:**

```typescript
interface PricingCardProps {
  plan: PricingPlan;
  billingInterval: BillingInterval;
  isLoading?: boolean;
  organizations?: Organization[];
  selectedOrgId?: string | null;
  onOrgChange?: (orgId: string) => void;
  onSubscribe: () => void;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    title?: string;
    description?: string;
    price?: string;
    savings?: string;
    content?: string;
    featureList?: string;
    featureItem?: string;
    footer?: string;
    button?: string;
    badge?: string;
  };
  localization?: Partial<PricingCardLocalization>;
  formatPrice?: (price: number, interval: BillingInterval) => string;
  getSavingsText?: (monthlyPrice: number) => string | null;
}
```

### PricingHeader

Header section with title, description, and billing interval toggle.

**Features:**
- Billing interval toggle (monthly/yearly)
- Savings badge display
- Localization support
- Conditional toggle display
- Granular className customization

**Usage:**

```tsx
import { PricingHeader } from "@/components/pricing";

<PricingHeader
  billingInterval={interval}
  onIntervalChange={setInterval}
  showToggle={true}
  localization={{
    title: "Custom Title",
    savingsText: "Save 25%"
  }}
/>
```

**Props:**

```typescript
interface PricingHeaderProps {
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
    description?: string;
    toggle?: string;
    toggleLabel?: string;
    badge?: string;
  };
  localization?: Partial<PricingHeaderLocalization>;
  showToggle?: boolean;
}
```

### OrganizationSelector

Organization selector for team plan subscriptions.

**Features:**
- Better Auth organization integration
- Automatic hiding when no organizations
- Localization support
- Accessible select component
- Skeleton loader

**Usage:**

```tsx
import { OrganizationSelector } from "@/components/pricing";

<OrganizationSelector
  organizations={organizations}
  selectedOrgId={selectedOrgId}
  onOrgChange={setSelectedOrgId}
  localization={{
    label: "Choose Team:",
    placeholder: "Select your team..."
  }}
/>
```

**Props:**

```typescript
interface OrganizationSelectorProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onOrgChange: (orgId: string) => void;
  className?: string;
  classNames?: {
    container?: string;
    label?: string;
    select?: string;
    description?: string;
  };
  localization?: Partial<OrganizationSelectorLocalization>;
}
```

## Localization

All components support full localization through the `localization` prop.

**Usage:**

```tsx
import { PricingDashboard, defaultPricingLocalization } from "@/components/pricing";

const customLocalization = {
  ...defaultPricingLocalization,
  card: {
    ...defaultPricingLocalization.card,
    popularBadge: "Mais Popular",
    getStarted: "Começar",
    startTrial: "Iniciar Teste Grátis"
  }
};

// Apply to individual components
<PricingCard
  {...props}
  localization={customLocalization.card}
/>
```

**Available Localizations:**

```typescript
interface PricingLocalization {
  dashboard: {
    title: string;
    description: string;
    footer: {
      text: string;
      linkText: string;
    };
  };
  header: PricingHeaderLocalization;
  card: PricingCardLocalization;
  organizationSelector: OrganizationSelectorLocalization;
}
```

## Styling with classNames

All components support granular styling through the `classNames` prop, following better-auth-ui patterns.

**Example:**

```tsx
<PricingDashboard
  className="my-custom-wrapper"
  classNames={{
    container: "max-w-6xl",
    header: "mb-16",
    grid: "grid-cols-2 gap-8",
    footer: "mt-20"
  }}
/>

<PricingCard
  classNames={{
    base: "hover:scale-105 transition-transform",
    header: "bg-gradient-to-r from-blue-500 to-purple-600",
    title: "text-white",
    price: "text-yellow-400",
    button: "bg-white text-black hover:bg-gray-100"
  }}
/>
```

## Skeleton Loaders

All components export skeleton variants for loading states.

**Usage:**

```tsx
import { 
  PricingDashboardSkeleton,
  PricingCardSkeleton,
  PricingHeaderSkeleton,
  OrganizationSelectorSkeleton
} from "@/components/pricing";

{isLoading ? (
  <PricingDashboardSkeleton />
) : (
  <PricingDashboard {...props} />
)}
```

## Integration with Better Auth

The pricing components integrate seamlessly with Better Auth:

**Session Management:**

```tsx
// PricingDashboard uses Better Auth hooks internally
const { data: session, isPending: sessionPending } = authClient.useSession();
const { data: organizations, isPending: orgsPending } = authClient.organization.list();
```

**Organization Support:**

- Team plans automatically show organization selector
- Organization metadata used for billing
- Seat allocation tracking integration

**Stripe Integration:**

```tsx
// Automatic Stripe checkout creation
const handleSubscribe = async (plan: PricingPlan, selectedOrgId?: string) => {
  const session = await authClient.stripe.createCheckoutSession({
    priceId: plan.stripePriceId,
    successUrl: "/billing/success",
    cancelUrl: "/billing/cancel",
    organizationId: selectedOrgId,
    mode: "subscription"
  });
  
  window.location.href = session.url;
};
```

## Types

### PricingPlan

```typescript
interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  popular?: boolean;
  seats?: {
    min: number;
    max: number;
  };
}
```

### BillingInterval

```typescript
type BillingInterval = "monthly" | "yearly";
```

### Organization

```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  metadata?: Record<string, any>;
}
```

## Better Auth UI Patterns

These components follow better-auth-ui conventions:

1. **Props Interface**: Every component exports a Props interface
2. **ClassNames Support**: Granular styling through classNames object
3. **Localization**: Full text customization support
4. **Skeleton Loaders**: Export skeleton components for loading states
5. **Better Auth Hooks**: Use authClient hooks instead of manual fetching
6. **TypeScript**: Strict typing for all props and state
7. **CN Utility**: Use cn() for className merging

## Example: Complete Pricing Page

```tsx
"use client";

import { PricingDashboard } from "@/components/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PricingDashboard
        successUrl="/billing/success"
        cancelUrl="/billing/cancel"
        defaultInterval="yearly"
        showFooter={true}
        classNames={{
          container: "max-w-7xl",
          grid: "grid-cols-1 md:grid-cols-3 gap-8",
          footer: "mt-16 text-center"
        }}
      />
    </div>
  );
}
```

## File Structure

```
components/pricing/
├── index.ts                      # Clean exports with types
├── types.ts                      # TypeScript types
├── plans.ts                      # Pricing plans data
├── localization.ts               # Localization definitions
├── pricing-dashboard.tsx         # Main orchestrator component
├── pricing-card.tsx              # Individual plan card
├── pricing-header.tsx            # Header with billing toggle
├── organization-selector.tsx     # Org selection for team plans
└── README.md                     # This file
```

## Code Reduction

Following the modular approach:

- **Before**: 315 lines in a single pricing page
- **After**: 10 lines using PricingDashboard
- **Reduction**: 97% code reduction
- **Maintainability**: Components are reusable and testable
- **Customization**: Full control through props

## Related Components

- [Billing Components](../billing/README.md) - Subscription management
- [Usage Components](../usage/README.md) - Usage tracking
- [Team Components](../team/README.md) - Organization management
