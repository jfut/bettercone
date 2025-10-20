/**
 * Pricing Card Component
 * Individual pricing plan card with Stripe integration
 * Following Better Auth UI patterns
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan, BillingInterval, Organization } from "./types";
import { OrganizationSelector } from "./organization-selector";

export interface PricingCardLocalization {
  popularBadge: string;
  freeLabel: string;
  monthlyLabel: string;
  yearlyLabel: string;
  savingsLabel: (amount: number) => string;
  seatsLabel: (min: number, max: number) => string;
  createOrgFirst: string;
  processing: string;
  getStarted: string;
  startTrial: string;
}

const defaultLocalization: PricingCardLocalization = {
  popularBadge: "Most Popular",
  freeLabel: "Free",
  monthlyLabel: "/month",
  yearlyLabel: "/year",
  savingsLabel: (amount) => `Save $${amount}/year`,
  seatsLabel: (min, max) => `per user, ${min}-${max} seats`,
  createOrgFirst: "Create an organization first to purchase team plans",
  processing: "Processing...",
  getStarted: "Get Started",
  startTrial: "Start Free Trial"
};

export interface PricingCardProps {
  plan: PricingPlan;
  billingInterval: BillingInterval;
  isLoading?: boolean;
  organizations?: Organization[];
  orgsLoaded?: boolean;
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

export function PricingCard({
  plan,
  billingInterval,
  isLoading = false,
  organizations = [],
  orgsLoaded = true,
  selectedOrgId = null,
  onOrgChange,
  onSubscribe,
  className,
  classNames,
  localization,
  formatPrice: customFormatPrice,
  getSavingsText: customGetSavingsText
}: PricingCardProps) {
  const loc = { ...defaultLocalization, ...localization };
  
  // Default price formatter
  const defaultFormatPrice = (price: number, interval: BillingInterval) => {
    if (price === 0) return loc.freeLabel;
    // Price is already the correct value for the interval (monthly or yearly)
    // No need to multiply - just display it
    return `$${price}${interval === "yearly" ? loc.yearlyLabel : loc.monthlyLabel}`;
  };

  // Default savings calculator
  const defaultGetSavingsText = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return null;
    // Calculate actual savings: (monthly × 12) - yearly price
    const monthlyCostPerYear = monthlyPrice * 12;
    const yearlyPrice = plan.price.yearly;
    const savings = monthlyCostPerYear - yearlyPrice;
    if (savings <= 0) return null; // No savings
    return loc.savingsLabel(savings);
  };

  const formatPrice = customFormatPrice || defaultFormatPrice;
  const getSavingsText = customGetSavingsText || defaultGetSavingsText;

  const isTeamPlan = plan.id === "team";
  const requiresOrg = isTeamPlan && organizations.length > 0;
  const hasNoOrgs = isTeamPlan && orgsLoaded && organizations.length === 0;
  const isDisabled =
    isLoading ||
    (isTeamPlan && (!orgsLoaded || (organizations.length > 0 && !selectedOrgId)));

  return (
    <Card
      className={cn(
        "relative",
        plan.popular && "border-primary shadow-md ring-2 ring-primary/20",
        classNames?.base,
        className
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className={classNames?.badge}>
            <Star className="w-3 h-3 mr-1" />
            {loc.popularBadge}
          </Badge>
        </div>
      )}

      {/* Card Header */}
      <CardHeader className={cn("text-center", classNames?.header)}>
        <CardTitle className={cn("text-2xl", classNames?.title)}>
          {plan.name}
        </CardTitle>
        <CardDescription className={classNames?.description}>
          {plan.description}
        </CardDescription>
        
        {/* Price Display */}
        <div className="mt-4">
          <div className={cn("text-4xl font-bold", classNames?.price)}>
            {formatPrice(plan.price[billingInterval], billingInterval)}
          </div>
          
          {/* Savings Text */}
          {billingInterval === "yearly" && plan.price.monthly > 0 && (
            <div className={cn("text-sm text-muted-foreground mt-1", classNames?.savings)}>
              {getSavingsText(plan.price.monthly)}
            </div>
          )}
          
          {/* Seats Info */}
          {plan.seats && (
            <div className={cn("text-sm text-muted-foreground mt-1", classNames?.savings)}>
              {loc.seatsLabel(plan.seats.min, plan.seats.max)}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Features List */}
      <CardContent className={classNames?.content}>
        <ul className={cn("space-y-3", classNames?.featureList)}>
          {plan.features.map((feature, index) => (
            <li key={index} className={cn("flex items-center gap-3", classNames?.featureItem)}>
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Footer with CTA */}
      <CardFooter className={cn("flex flex-col gap-3", classNames?.footer)}>
        {/* Organization Selector for Team Plans */}
        {requiresOrg && onOrgChange && (
          <OrganizationSelector
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            onOrgChange={onOrgChange}
          />
        )}

        {/* No Organizations Warning */}
        {hasNoOrgs && (
          <div className="w-full p-3 bg-muted border rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{loc.createOrgFirst}</span>
            </div>
          </div>
        )}

        {/* Subscribe Button */}
        <Button
          className={cn("w-full", classNames?.button)}
          variant={plan.popular ? "default" : "outline"}
          onClick={onSubscribe}
          disabled={isDisabled}
        >
          {isLoading
            ? loc.processing
            : plan.price.monthly === 0
            ? loc.getStarted
            : loc.startTrial}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PricingCardSkeleton({
  className,
  classNames
}: Pick<PricingCardProps, "className" | "classNames">) {
  return (
    <Card className={cn(classNames?.base, className)}>
      <CardHeader className={cn("text-center", classNames?.header)}>
        <Skeleton className={cn("h-6 w-24 mx-auto mb-2", classNames?.title)} />
        <Skeleton className={cn("h-4 w-full mb-4", classNames?.description)} />
        <Skeleton className={cn("h-10 w-32 mx-auto", classNames?.price)} />
      </CardHeader>
      <CardContent className={classNames?.content}>
        <div className={cn("space-y-3", classNames?.featureList)}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("flex items-center gap-3", classNames?.featureItem)}>
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className={classNames?.footer}>
        <Skeleton className={cn("h-10 w-full", classNames?.button)} />
      </CardFooter>
    </Card>
  );
}
