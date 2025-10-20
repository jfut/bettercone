# Components Architecture

This project follows **better-auth-ui component patterns** combined with domain-based organization. Components are organized by feature domain with consistent props patterns and TypeScript interfaces.

## 📁 Folder Structure

```
src/components/
├── ui/              # shadcn/ui components (base components)
├── billing/         # Billing & subscription display components
│   ├── usage-card.tsx
│   ├── localization.ts
│   └── index.ts
├── subscription/    # Subscription management components
│   ├── feature-access-card.tsx
│   ├── localization.ts
│   └── index.ts
├── analytics/       # Analytics & reporting components
│   ├── usage-analytics.tsx
│   ├── localization.ts
│   └── index.ts
├── layouts/         # Page templates and layouts
│   ├── demo-layout.tsx
│   ├── demo-page-template.tsx
│   ├── admin-dashboard-template.tsx
│   └── index.ts
├── molecules/       # Legacy - being phased out
├── organisms/       # Legacy - being phased out
└── templates/       # Legacy - migrated to layouts/
```

## 🏗️ Component Organization

### Domain-Based Structure
Components are organized by feature domain, following better-auth-ui patterns:

### Billing Components (`billing/`)
Components for displaying billing information and usage metrics:
- `UsageCard` - Individual usage metric display with progress bar
- Localization support for all billing text
- Consistent props patterns (className, classNames, localization)

### Subscription Components (`subscription/`)
Components for subscription management features:
- `FeatureAccessCard` - Feature access status with upgrade prompts
- Localization support for subscription-related text
- Type-safe props with optional event handlers

### Analytics Components (`analytics/`)
Components for usage tracking and analytics:
- `UsageAnalytics` - Complete analytics dashboard composition
- Reuses billing and subscription components
- Customizable styling via classNames prop

### Layout Components (`layouts/`)
Page-level layouts and templates:
- `DemoLayout` - Feature demo page layout with category badge
- `DemoPageTemplate` - Simple centered page layout
- `AdminDashboardTemplate` - Admin dashboard with header content

## 📋 Component Standards (Following better-auth-ui Patterns)

### TypeScript Interfaces
All components must have properly typed interfaces:
```typescript
export interface ComponentProps {
  className?: string;           // Root element styling
  classNames?: {                // Granular styling control
    base?: string;
    header?: string;
    title?: string;
    content?: string;
  };
  localization?: Partial<LocalizationType>; // Text customization
  // ... other props
}
```

### Props Pattern
Every component should accept:
- `className`: Override root element styling
- `classNames`: Granular styling control for nested elements
- `localization`: Text customization for internationalization
- Event handlers as needed (onClick, onUpgrade, etc.)

### Localization Support
All text content should be externalized:
```typescript
// localization.ts
export interface BillingLocalization {
  currentPlan: string;
  upgradeButton: string;
  // ... all text strings
}

export const defaultBillingLocalization: BillingLocalization = {
  currentPlan: "Current Plan",
  upgradeButton: "Upgrade",
  // ...
};
```

### Styling with classNames
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