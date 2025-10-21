# BetterCone Components

Production-ready B2B SaaS components following **Better Auth UI patterns** with domain-based organization. All components are fully typed, support localization, and include skeleton loading states.

## 🚀 Quick Start

### Single Import Pattern (Recommended)

Import all BetterCone components from the main index:

```tsx
import {
  // Billing
  BillingDashboard,
  SubscriptionCard,
  PaymentMethodCard,
  InvoiceHistoryCard,
  
  // Pricing
  PricingDashboard,
  PricingCard,
  
  // Team
  TeamDashboard,
  SeatAllocationCard,
  TeamBillingCard,
  
  // Usage
  UsageDashboard,
  ApiUsageCard,
  StorageUsageCard,
  FeatureAccessCard,
} from "@/components";
```

### Category-Specific Imports

Or import from specific categories:

```tsx
import { BillingDashboard, SubscriptionCard } from "@/components/billing";
import { PricingDashboard, PricingCard } from "@/components/pricing";
import { TeamDashboard, SeatAllocationCard } from "@/components/team";
import { UsageDashboard, ApiUsageCard } from "@/components/usage";
```

## 📁 Folder Structure

```
src/components/
├── index.ts         # Main export file (import everything from here)
├── ui/              # shadcn/ui components (base components)
├── billing/         # Billing & subscription components
│   ├── cards/
│   ├── shared/
│   ├── billing-dashboard.tsx
│   ├── localization.ts
│   └── index.ts
├── pricing/         # Pricing plans & checkout components
│   ├── pricing-dashboard.tsx
│   ├── pricing-card.tsx
│   ├── localization.ts
│   └── index.ts
├── team/            # Team management & seat allocation
│   ├── team-dashboard.tsx
│   ├── seat-allocation-card.tsx
│   ├── team-billing-card.tsx
│   └── index.ts
├── usage/           # Usage tracking & limits
│   ├── usage-dashboard.tsx
│   ├── api-usage-card.tsx
│   ├── storage-usage-card.tsx
│   ├── feature-access-card.tsx
│   ├── types.ts
│   └── index.ts
├── layouts/         # Page templates and layouts
└── header.tsx       # Global header component
```

## 🏗️ Component Categories

### 💳 Billing Components (`billing/`)

Complete billing management with Stripe integration:

- **`BillingDashboard`** - Full billing overview with subscription, payment methods, and invoices
- **`SubscriptionCard`** - Current subscription details with upgrade/cancel options
- **`PaymentMethodCard`** - Payment method management with Stripe
- **`InvoiceHistoryCard`** - Invoice list with download functionality
- **`PlanBadge`** - Plan status badge
- **`SubscriptionStatusBadge`** - Subscription status indicator
- **`PriceDisplay`** - Formatted price display

```tsx
import { BillingDashboard } from "@/components";

export default function BillingPage() {
  return <BillingDashboard />;
}
```

### 💰 Pricing Components (`pricing/`)

Pricing tables and plan selection with Stripe Checkout:

- **`PricingDashboard`** - Complete pricing table with plan comparison
- **`PricingCard`** - Individual pricing plan card with features
- **`PricingHeader`** - Pricing page header with billing toggle
- **`OrganizationSelector`** - Organization selector for team plans

```tsx
import { PricingDashboard } from "@/components";

export default function PricingPage() {
  return (
    <PricingDashboard
      successUrl="/dashboard"
      cancelUrl="/pricing"
    />
  );
}
```

### 👥 Team Components (`team/`)

Team management with member roles and seat allocation:

- **`TeamDashboard`** - Complete team management interface
- **`SeatAllocationCard`** - Seat usage and limit management
- **`TeamBillingCard`** - Team billing summary with plan details

```tsx
import { TeamDashboard } from "@/components";

export default function TeamPage() {
  return <TeamDashboard />;
}
```

### 📊 Usage Components (`usage/`)

Real-time usage tracking with Convex:

- **`UsageDashboard`** - Complete usage overview dashboard
- **`ApiUsageCard`** - API call tracking with limits
- **`StorageUsageCard`** - Storage usage monitoring
- **`FeatureAccessCard`** - Feature availability by plan

```tsx
import { UsageDashboard } from "@/components";

export default function UsagePage() {
  return <UsageDashboard />;
}
```

## 📋 Better Auth UI Pattern Compliance

All BetterCone components follow the same patterns as Better Auth UI:

### 1. TypeScript Props Interface

```typescript
export interface ComponentProps {
  className?: string;           // Root element styling
  classNames?: {                // Granular styling control
    base?: string;
    header?: string;
    title?: string;
    content?: string;
    footer?: string;
  };
  localization?: Partial<LocalizationType>; // Text customization
  // ... component-specific props
}
```

### 2. Skeleton Loading States

Every component has a matching skeleton for loading states:

```tsx
import { SubscriptionCard, SubscriptionCardSkeleton } from "@/components";

export function BillingPage() {
  const { data, isPending } = useSubscription();
  
  if (isPending) {
    return <SubscriptionCardSkeleton />;
  }
  
  return <SubscriptionCard />;
}
```

### 3. Undefined State Handling

Components gracefully handle undefined data:

```tsx
export function ApiUsageCard({ current, limit }: Props) {
  // Return skeleton when data is undefined
  if (current === undefined || limit === undefined) {
    return <ApiUsageCardSkeleton />;
  }
  
  // Safe to use data here
  return <Card>...</Card>;
}
```

### 4. Localization Support

All text is customizable via localization props:

```tsx
import { BillingDashboard, defaultBillingLocalization } from "@/components";

const customLocalization = {
  ...defaultBillingLocalization,
  currentPlan: "Plan Actual",
  upgradeButton: "Actualizar Plan",
};

<BillingDashboard localization={customLocalization} />
```

### 5. Granular Styling

Components support detailed styling through `classNames`:

```tsx
<SubscriptionCard
  className="custom-card-wrapper"
  classNames={{
    header: "bg-primary text-white",
    title: "text-2xl font-bold",
    content: "p-6",
    footer: "border-t",
  }}
/>
```

## 🔄 Comparison with Better Auth UI

| Feature | Better Auth UI | BetterCone |
|---------|---------------|------------|
| **Purpose** | Authentication & user management | Billing, pricing, teams, usage |
| **Import Pattern** | `@daveyplate/better-auth-ui` | `@/components` |
| **Component Pattern** | Dashboard + Individual Cards | Dashboard + Individual Cards |
| **Props Pattern** | `className`, `classNames`, `localization` | ✅ Same |
| **Loading States** | Skeleton components | ✅ Same |
| **TypeScript** | Fully typed | ✅ Same |
| **Undefined Handling** | Graceful fallbacks | ✅ Same |
| **Convex Integration** | Built-in | ✅ Built-in |

## 📦 What's Exported

### From `@/components` (Main Index)

**Billing:**
- `BillingDashboard`, `SubscriptionCard`, `PaymentMethodCard`, `InvoiceHistoryCard`
- `PlanBadge`, `SubscriptionStatusBadge`, `PriceDisplay`
- Skeletons: `SubscriptionCardSkeleton`, `PaymentMethodCardSkeleton`, `InvoiceHistoryCardSkeleton`

**Pricing:**
- `PricingDashboard`, `PricingCard`, `PricingHeader`, `OrganizationSelector`
- `pricingPlans`, `defaultPricingLocalization`
- Skeletons: `PricingDashboardSkeleton`, `PricingCardSkeleton`, etc.

**Team:**
- `TeamDashboard`, `SeatAllocationCard`, `TeamBillingCard`
- Skeletons: `SeatAllocationCardSkeleton`, `TeamBillingCardSkeleton`

**Usage:**
- `UsageDashboard`, `ApiUsageCard`, `StorageUsageCard`, `FeatureAccessCard`
- Skeletons: All usage card skeletons

**UI Components (Re-exported):**
- `Button`, `Card`, `Badge`, `Input`, `Label`, `Skeleton`, `Progress`

**Utilities:**
- `ThemeProvider`, `ModeToggle`

## 🎯 Best Practices

### 1. Use the Main Index

```tsx
// ✅ Good - Single import
import { BillingDashboard, PricingDashboard } from "@/components";

// ❌ Avoid - Multiple imports
import { BillingDashboard } from "@/components/billing";
import { PricingDashboard } from "@/components/pricing";
```

### 2. Handle Loading States

```tsx
// ✅ Good - Use skeletons
if (isPending) return <SubscriptionCardSkeleton />;

// ❌ Avoid - Generic loading
if (isPending) return <div>Loading...</div>;
```

### 3. Customize with Localization

```tsx
// ✅ Good - Use localization for text
<BillingDashboard localization={{ upgradeButton: "Upgrade Now" }} />

// ❌ Avoid - Hardcoding text changes
// (Component text is already configurable)
```

### 4. Style with classNames

```tsx
// ✅ Good - Granular styling
<SubscriptionCard classNames={{ header: "bg-primary" }} />

// ⚠️ OK but less flexible - Root only
<SubscriptionCard className="custom-styles" />
```

## 🚀 Migration from Old Patterns

If you have old imports, update them:

```tsx
// Old
import { BillingDashboard } from "@/components/billing/billing-dashboard";

// New
import { BillingDashboard } from "@/components";
```
Support granular customization:
```typescript
<Card className={cn("w-full", className, classNames?.base)}>
  <CardHeader className={classNames?.header}>
    <CardTitle className={classNames?.title}>
      {localization?.title || defaultLocalization.title}
    </CardTitle>
  </CardHeader>
</Card>
```

### Barrel Exports
Use index.ts for clean imports:
```typescript
// index.ts
export { UsageCard } from "./usage-card";
export type { UsageCardProps } from "./usage-card";
export { defaultBillingLocalization, type BillingLocalization } from "./localization";
```

## 🎯 Usage Examples

### Using Billing Components
```tsx
import { UsageCard } from "@/components/billing";

<UsageCard
  title="API Calls"
  description="Monthly API usage"
  current={8500}
  limit={10000}
  icon={<TrendingUp />}
  onUpgrade={() => console.log("Upgrade clicked")}
  localization={{ upgradeToIncreaseLimit: "Upgrade for more" }}
  classNames={{
    base: "border-primary",
    title: "text-primary"
  }}
/>
```

### Using Subscription Components
```tsx
import { FeatureAccessCard } from "@/components/subscription";

<FeatureAccessCard
  title="Feature Access"
  description="Available features"
  features={{
    advancedAnalytics: true,
    apiAccess: true,
    customBranding: false
  }}
  onUpgrade={(feature) => console.log(`Upgrade for ${feature}`)}
/>
```

### Using Analytics Components
```tsx
import { UsageAnalytics } from "@/components/analytics";

<UsageAnalytics
  usageData={{
    apiCalls: { current: 8500, limit: 10000, period: "monthly" },
    storage: { current: 45, limit: 100, unit: "GB", period: "monthly" },
    teamMembers: { current: 3, limit: 5, period: "monthly" },
    features: { advancedAnalytics: true, apiAccess: false }
  }}
  onUpgrade={(resource) => console.log(`Upgrade ${resource}`)}
/>
```

### Using Layout Components
```tsx
import { DemoLayout, DemoPageTemplate } from "@/components/layouts";

<DemoLayout
  title="Feature Gating"
  description="Control feature access by subscription"
  category="Subscription"
>
  {/* Your content */}
</DemoLayout>

<DemoPageTemplate
  title="Usage Tracking"
  description="Monitor your usage and limits"
  maxWidth="max-w-6xl"
>
  <UsageAnalytics usageData={data} />
</DemoPageTemplate>
```

## 🔧 Development Workflow

1. **Identify the domain**: Determine if your component belongs to billing, subscription, analytics, or layouts
2. **Create the component**: Follow the better-auth-ui pattern with TypeScript interfaces
3. **Add localization**: Define localization types and default values
4. **Support styling**: Add className and classNames props for customization
5. **Export properly**: Add to index.ts with both component and type exports
6. **Document usage**: Add examples to this README

## 🎨 Component Features

### Type Safety
- Strong TypeScript interfaces for all props
- Exported type definitions for consumers
- Proper typing for event handlers and callbacks

### Customization
- `className` prop for root styling
- `classNames` object for nested element styling
- `localization` prop for text customization
- Event handlers for user interactions

### Consistency
- All components follow the same props pattern
- Predictable structure across domains
- Easy to learn and use

### Reusability
- Components can be used independently
- Composable for complex UIs
- No hard-coded values or assumptions

## 📦 Migration from Legacy Structure

The project is migrating from Atomic Design to domain-based organization:

- `molecules/` → Split between `billing/` and `subscription/`
- `organisms/` → Moved to `analytics/`
- `templates/` → Renamed to `layouts/`

Legacy imports still work but should be updated:
```typescript
// Old (deprecated)
import { UsageCard } from "@/components/molecules";
import { UsageAnalytics } from "@/components/organisms";
import { DemoPageTemplate } from "@/components/templates";

// New (recommended)
import { UsageCard } from "@/components/billing";
import { UsageAnalytics } from "@/components/analytics";
import { DemoPageTemplate } from "@/components/layouts";
```

## 🔧 Development Workflow

1. **Identify the domain**: Determine if your component belongs to billing, subscription, analytics, or layouts
2. **Check for existing components**: Look for reusable components before creating new ones
3. **Create the component**: Follow the established patterns and naming conventions
4. **Add to index**: Export from the appropriate index.ts file
5. **Update documentation**: Keep this README current with new components

## 📚 Resources

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Better Auth UI Components](https://better-auth-ui.com/)