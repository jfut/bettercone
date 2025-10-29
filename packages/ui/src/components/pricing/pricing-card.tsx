/**
 * Pricing Card Component
 * Individual pricing plan card
 * Backend-agnostic - accepts plan data as props
 */

"use client";

import { Check, Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
  cta?: string;
}

export type BillingInterval = "monthly" | "yearly";

export interface PricingCardProps {
  /** Pricing plan data */
  plan: PricingPlan;
  
  /** Billing interval */
  billingInterval: BillingInterval;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Callback when subscribe button is clicked */
  onSubscribe: (planId: string, interval: BillingInterval) => void;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: {
    base?: string;
    header?: string;
    title?: string;
    description?: string;
    price?: string;
    content?: string;
    footer?: string;
    button?: string;
  };
}

export function PricingCard({
  plan,
  billingInterval,
  isLoading = false,
  onSubscribe,
  className,
  classNames,
}: PricingCardProps) {
  const price = billingInterval === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const monthlySavings = billingInterval === "yearly" 
    ? ((plan.priceMonthly * 12 - plan.priceYearly) / 12).toFixed(0)
    : null;

  const formatPrice = (amount: number) => {
    if (amount === 0) return "Free";
    return `$${amount}`;
  };

  return (
    <Card className={cn(
      "w-full relative",
      plan.popular && "border-primary shadow-lg",
      className,
      classNames?.base
    )}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className={cn("pt-6", classNames?.header)}>
        <CardTitle className={cn(classNames?.title)}>{plan.name}</CardTitle>
        <CardDescription className={cn(classNames?.description)}>
          {plan.description}
        </CardDescription>
        <div className={cn("mt-4", classNames?.price)}>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{formatPrice(price)}</span>
            {price > 0 && (
              <span className="text-muted-foreground">
                /{billingInterval === "yearly" ? "year" : "month"}
              </span>
            )}
          </div>
          {monthlySavings && parseInt(monthlySavings) > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Save ${monthlySavings}/month
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className={cn(classNames?.footer)}>
        <Button
          onClick={() => onSubscribe(plan.id, billingInterval)}
          disabled={isLoading}
          className={cn("w-full", classNames?.button)}
          variant={plan.popular ? "default" : "outline"}
        >
          {isLoading ? "Processing..." : plan.cta || "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PricingCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-10 w-24 mt-4" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
