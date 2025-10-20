/**
 * Pricing Header Component
 * Billing interval toggle and page header
 * Follows better-auth-ui patterns
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BillingInterval } from "./types";

export interface PricingHeaderLocalization {
  title: string;
  description: string;
  monthlyLabel: string;
  yearlyLabel: string;
  savingsText: string;
}

const defaultLocalization: PricingHeaderLocalization = {
  title: "Choose Your Plan",
  description: "Start free and upgrade as you grow. All plans include a 14-day free trial.",
  monthlyLabel: "Monthly",
  yearlyLabel: "Yearly",
  savingsText: "Save 20%"
};

export interface PricingHeaderProps {
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

export function PricingHeader({
  billingInterval,
  onIntervalChange,
  className,
  classNames,
  localization,
  showToggle = true
}: PricingHeaderProps) {
  const loc = { ...defaultLocalization, ...localization };

  return (
    <div className={cn("text-center mb-12", classNames?.container, className)}>
      <h1 className={cn("text-4xl font-bold mb-4", classNames?.title)}>
        {loc.title}
      </h1>
      <p className={cn("text-lg text-muted-foreground mb-8", classNames?.description)}>
        {loc.description}
      </p>

      {showToggle && (
        <div className={cn("flex items-center justify-center gap-4 mb-8", classNames?.toggle)}>
          <span
            className={cn(
              "text-sm font-medium",
              billingInterval === "monthly" ? "text-foreground" : "text-muted-foreground",
              classNames?.toggleLabel
            )}
          >
            {loc.monthlyLabel}
          </span>
          <Switch
            checked={billingInterval === "yearly"}
            onCheckedChange={(checked) => onIntervalChange(checked ? "yearly" : "monthly")}
            className="data-[state=checked]:bg-primary"
          />
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                billingInterval === "yearly" ? "text-foreground" : "text-muted-foreground",
                classNames?.toggleLabel
              )}
            >
              {loc.yearlyLabel}
            </span>
            <Badge variant="secondary" className={cn("text-xs", classNames?.badge)}>
              {loc.savingsText}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}

export function PricingHeaderSkeleton({ 
  className,
  classNames
}: Pick<PricingHeaderProps, "className" | "classNames">) {
  return (
    <div className={cn("text-center mb-12", classNames?.container, className)}>
      <Skeleton className={cn("h-10 w-64 mx-auto mb-4", classNames?.title)} />
      <Skeleton className={cn("h-6 w-96 mx-auto mb-8", classNames?.description)} />
      <div className={cn("flex items-center justify-center gap-4 mb-8", classNames?.toggle)}>
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-11" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
