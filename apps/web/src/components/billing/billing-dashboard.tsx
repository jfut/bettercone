/**
 * Billing Dashboard Component
 * Composed view combining all billing-related cards
 * Follows Better Auth UI composition pattern
 */

"use client";

import { cn } from "@/lib/utils";
import { SubscriptionCard } from "./cards/subscription-card";
import { PaymentMethodCard } from "./cards/payment-method-card";
import { InvoiceHistoryCard } from "./cards/invoice-history-card";
import { BillingLocalization } from "./localization";

export interface BillingDashboardProps {
  className?: string;
  classNames?: {
    container?: string;
    grid?: string;
    subscriptionCard?: string;
    paymentCard?: string;
    invoiceCard?: string;
  };
  localization?: Partial<BillingLocalization>;
  layout?: "grid" | "stack";
}

export function BillingDashboard({
  className,
  classNames,
  localization,
  layout = "grid",
}: BillingDashboardProps) {
  const isGrid = layout === "grid";

  return (
    <div className={cn("space-y-6", className, classNames?.container)}>
      {/* Main Subscription Card - Full Width */}
      <SubscriptionCard
        className={classNames?.subscriptionCard}
        localization={localization}
      />

      {/* Secondary Cards Grid */}
      <div
        className={cn(
          isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6",
          classNames?.grid
        )}
      >
        <PaymentMethodCard
          className={classNames?.paymentCard}
          localization={localization}
        />
        <InvoiceHistoryCard
          className={classNames?.invoiceCard}
          localization={localization}
        />
      </div>
    </div>
  );
}
