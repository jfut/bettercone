/**
 * Billing Dashboard Component
 * Composed view combining all billing-related cards
 */

"use client";

import { cn } from "../../lib/utils";
import { SubscriptionCard, SubscriptionCardProps } from "./subscription-card";
import { PaymentMethodCard, PaymentMethodCardProps } from "./payment-method-card";
import { InvoiceHistoryCard, InvoiceHistoryCardProps } from "./invoice-history-card";
import type { BetterAuthClient } from "../../types/auth";
import type { BillingLocalization } from "../../types/localization";

export interface BillingDashboardProps {
  /** Better Auth client instance */
  authClient: BetterAuthClient;
  /** Custom className for the container */
  className?: string;
  /** Custom classNames for individual elements */
  classNames?: {
    container?: string;
    grid?: string;
    subscriptionCard?: string;
    paymentCard?: string;
    invoiceCard?: string;
  };
  /** Localization strings */
  localization?: Partial<BillingLocalization>;
  /** Layout type: grid or stack */
  layout?: "grid" | "stack";
  /** Props to pass to SubscriptionCard */
  subscriptionCardProps?: Omit<SubscriptionCardProps, "authClient" | "localization">;
  /** Props to pass to PaymentMethodCard */
  paymentMethodCardProps?: Omit<PaymentMethodCardProps, "authClient" | "localization">;
  /** Props to pass to InvoiceHistoryCard */
  invoiceHistoryCardProps?: Omit<InvoiceHistoryCardProps, "authClient" | "localization">;
}

/**
 * BillingDashboard - Composition of billing components
 * 
 * Combines subscription, payment method, and invoice history cards
 * into a unified billing dashboard view.
 * 
 * @example
 * ```tsx
 * <BillingDashboard
 *   authClient={authClient}
 *   layout="grid"
 *   subscriptionCardProps={{
 *     onManageSubscription: handleManageSubscription
 *   }}
 *   paymentMethodCardProps={{
 *     onManagePayment: handleManagePayment
 *   }}
 * />
 * ```
 */
export function BillingDashboard({
  authClient,
  className,
  classNames,
  localization,
  layout = "grid",
  subscriptionCardProps,
  paymentMethodCardProps,
  invoiceHistoryCardProps,
}: BillingDashboardProps) {
  const isGrid = layout === "grid";

  return (
    <div className={cn("space-y-6", className, classNames?.container)}>
      {/* Main Subscription Card - Full Width */}
      <SubscriptionCard
        authClient={authClient}
        className={classNames?.subscriptionCard}
        localization={localization}
        {...subscriptionCardProps}
      />

      {/* Secondary Cards Grid */}
      <div
        className={cn(
          isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6",
          classNames?.grid
        )}
      >
        <PaymentMethodCard
          authClient={authClient}
          className={classNames?.paymentCard}
          localization={localization}
          {...paymentMethodCardProps}
        />
        <InvoiceHistoryCard
          authClient={authClient}
          className={classNames?.invoiceCard}
          localization={localization}
          {...invoiceHistoryCardProps}
        />
      </div>
    </div>
  );
}
