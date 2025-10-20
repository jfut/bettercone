/**
 * Billing components exports
 * Modular B2B SaaS billing components following Better Auth UI patterns
 */

// Main Cards
export { SubscriptionCard, SubscriptionCardSkeleton } from "./cards/subscription-card";
export { PaymentMethodCard, PaymentMethodCardSkeleton } from "./cards/payment-method-card";
export { InvoiceHistoryCard, InvoiceHistoryCardSkeleton } from "./cards/invoice-history-card";

// Composed Views
export { BillingDashboard } from "./billing-dashboard";

// Shared Components
export {
  PlanBadge,
  SubscriptionStatusBadge,
  PriceDisplay,
  BillingCardHeader,
} from "./shared";

// Localization
export { 
  defaultBillingLocalization,
  type BillingLocalization 
} from "./localization";
