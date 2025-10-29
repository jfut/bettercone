export { cn } from "./lib/utils";

// Types
export type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthOrganization,
  BetterAuthSubscription,
} from "./types/auth";

export type { BillingLocalization } from "./types/localization";

// UI Primitives
export { Button, buttonVariants } from "./components/button";
export { Badge, badgeVariants } from "./components/badge";
export { Skeleton } from "./components/skeleton";
export { Progress } from "./components/progress";
export { Separator } from "./components/separator";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "./components/card";

// ============================================================================
// Billing Components
// ============================================================================
export {
  SubscriptionCard,
  SubscriptionCardSkeleton
} from "./components/billing/subscription-card";
export type { SubscriptionCardProps } from "./components/billing/subscription-card";

export {
  PaymentMethodCard,
  PaymentMethodCardSkeleton
} from "./components/billing/payment-method-card";
export type { PaymentMethodCardProps } from "./components/billing/payment-method-card";

export {
  InvoiceHistoryCard,
  InvoiceHistoryCardSkeleton
} from "./components/billing/invoice-history-card";
export type { InvoiceHistoryCardProps } from "./components/billing/invoice-history-card";

export {
  BillingDashboard
} from "./components/billing/billing-dashboard";
export type { BillingDashboardProps } from "./components/billing/billing-dashboard";

// Pricing Components
export {
  PricingCard,
  PricingCardSkeleton
} from "./components/pricing/pricing-card";
export type { 
  PricingCardProps,
  PricingPlan,
  BillingInterval
} from "./components/pricing/pricing-card";

// Usage Components
export {
  ApiUsageCard,
  ApiUsageCardSkeleton
} from "./components/usage/api-usage-card";
export type { 
  ApiUsageCardProps,
  ApiUsageCardClassNames,
  ApiUsageCardLocalization
} from "./components/usage/api-usage-card";

export {
  StorageUsageCard,
  StorageUsageCardSkeleton
} from "./components/usage/storage-usage-card";
export type { StorageUsageCardProps } from "./components/usage/storage-usage-card";

export {
  FeatureAccessCard,
  FeatureAccessCardSkeleton
} from "./components/usage/feature-access-card";
export type { 
  FeatureAccessCardProps,
  FeatureAccess,
  FeatureConfig
} from "./components/usage/feature-access-card";

export {
  UsageDashboard,
  UsageDashboardSkeleton
} from "./components/usage/usage-dashboard";
export type { UsageDashboardProps } from "./components/usage/usage-dashboard";

// Team Components
export {
  SeatAllocationCard,
  SeatAllocationCardSkeleton
} from "./components/team/seat-allocation-card";
export type { 
  SeatAllocationCardProps,
  SeatAllocationData,
  TeamMember
} from "./components/team/seat-allocation-card";

export {
  TeamBillingCard,
  TeamBillingCardSkeleton
} from "./components/team/team-billing-card";
export type { TeamBillingCardProps } from "./components/team/team-billing-card";

export {
  TeamDashboard,
  TeamDashboardSkeleton
} from "./components/team/team-dashboard";
export type { TeamDashboardProps } from "./components/team/team-dashboard";
