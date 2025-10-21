/**
 * BetterCone Components
 * Production-ready B2B SaaS components for billing, pricing, teams, and usage tracking
 * Following Better Auth UI patterns and conventions
 */

// ============================================================================
// BILLING COMPONENTS
// ============================================================================

// Billing Dashboard & Cards
export {
  BillingDashboard,
  SubscriptionCard,
  SubscriptionCardSkeleton,
  PaymentMethodCard,
  PaymentMethodCardSkeleton,
  InvoiceHistoryCard,
  InvoiceHistoryCardSkeleton,
} from "./billing";

// Billing Shared Components
export {
  PlanBadge,
  SubscriptionStatusBadge,
  PriceDisplay,
  BillingCardHeader,
} from "./billing";

// Billing Localization & Types
export {
  defaultBillingLocalization,
  type BillingLocalization,
} from "./billing";

// ============================================================================
// PRICING COMPONENTS
// ============================================================================

// Pricing Dashboard & Cards
export {
  PricingDashboard,
  PricingDashboardSkeleton,
  PricingCard,
  PricingCardSkeleton,
  PricingHeader,
  PricingHeaderSkeleton,
  OrganizationSelector,
  OrganizationSelectorSkeleton,
} from "./pricing";

// Pricing Types & Props
export type {
  PricingDashboardProps,
  PricingCardProps,
  PricingCardLocalization,
  PricingHeaderProps,
  PricingHeaderLocalization,
  OrganizationSelectorProps,
  OrganizationSelectorLocalization,
  PricingPlan,
  BillingInterval,
  SubscriptionParams,
} from "./pricing";

// Pricing Localization & Plans
export {
  pricingPlans,
  defaultPricingLocalization,
  mergePricingLocalization,
  type PricingLocalization,
} from "./pricing";

// ============================================================================
// TEAM COMPONENTS
// ============================================================================

// Team Dashboard & Cards
export {
  TeamDashboard,
  SeatAllocationCard,
  SeatAllocationCardSkeleton,
  TeamBillingCard,
  TeamBillingCardSkeleton,
} from "./team";

// Team Types
export type {
  TeamDashboardProps,
  SeatAllocationCardProps,
  SeatAllocationData,
  TeamBillingCardProps,
} from "./team";

// ============================================================================
// USAGE COMPONENTS
// ============================================================================

// Usage Dashboard & Cards
export {
  UsageDashboard,
  ApiUsageCard,
  ApiUsageCardSkeleton,
  StorageUsageCard,
  StorageUsageCardSkeleton,
  FeatureAccessCard,
  FeatureAccessCardSkeleton,
} from "./usage";

// Usage Types
export type {
  UsageData,
  FeatureAccess,
  ApiCallLog,
  UsageCardProps,
} from "./usage";

// ============================================================================
// UI COMPONENTS (re-export commonly used shadcn/ui components)
// ============================================================================

export { Button } from "./ui/button";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
export { Badge } from "./ui/badge";
export { Input } from "./ui/input";
export { Label } from "./ui/label";
export { Skeleton } from "./ui/skeleton";
export { Progress } from "./ui/progress";

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

export { ThemeProvider } from "./theme-provider";
export { ModeToggle } from "./mode-toggle";
