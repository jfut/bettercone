/**
 * Shared billing components
 * Reusable UI elements following Better Auth UI patterns
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Plan Badge Component
export interface PlanBadgeProps {
  plan: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
}

export function PlanBadge({ plan, variant = "default", className }: PlanBadgeProps) {
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {plan.replace(/-/g, " ")}
    </Badge>
  );
}

// Subscription Status Badge Component
export interface SubscriptionStatusBadgeProps {
  status: string;
  className?: string;
}

export function SubscriptionStatusBadge({ status, className }: SubscriptionStatusBadgeProps) {
  const getVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "trialing":
      case "trial":
        return "secondary";
      case "canceled":
      case "cancelled":
      case "past_due":
      case "unpaid":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant(status)} className={cn("capitalize", className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

// Price Display Component
export interface PriceDisplayProps {
  amount: number;
  currency?: string;
  interval?: "month" | "year" | string;
  showInterval?: boolean;
  className?: string;
  classNames?: {
    amount?: string;
    interval?: string;
  };
}

export function PriceDisplay({
  amount,
  currency = "USD",
  interval,
  showInterval = true,
  className,
  classNames,
}: PriceDisplayProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);

  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className={cn("text-3xl font-bold", classNames?.amount)}>
        {formattedAmount}
      </span>
      {showInterval && interval && (
        <span className={cn("text-muted-foreground", classNames?.interval)}>
          /{interval === "year" ? "year" : "month"}
        </span>
      )}
    </div>
  );
}

// Billing Card Header Component
export interface BillingCardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  className?: string;
}

export function BillingCardHeader({
  title,
  description,
  icon,
  badge,
  className,
}: BillingCardHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {badge && (
          <Badge variant={badge.variant || "default"}>
            {badge.text}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
