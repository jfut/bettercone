/**
 * Pricing Card Component
 * Individual pricing plan card with auto-checkout capability
 * 
 * Can auto-handle checkout using Better Auth Stripe plugin or use custom
 * onSubscribe callback.
 */

"use client";

import { useState, useContext } from "react";
import { Check, Star, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { PricingLocalization } from "../../types/localization";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
  cta?: string;
  stripeProductId?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export type BillingInterval = "monthly" | "yearly";

export interface PricingCardProps {
  plan: PricingPlan;
  billingInterval: BillingInterval;
  referenceId?: string;
  className?: string;
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
  localization?: Partial<PricingLocalization>;
  onSubscribe?: (planId: string, interval: BillingInterval) => Promise<void> | void;
  onBeforeCheckout?: () => Promise<void> | void;
  successUrl?: string;
  cancelUrl?: string;
}

const defaultPricingLocalization = {
  mostPopular: "Most Popular",
  free: "Free",
  perMonth: "/month",
  perYear: "/year",
  savePerMonth: "Save ${amount}/month",
  getStarted: "Get Started",
  processing: "Processing...",
  currentPlan: "Current Plan",
  upgrade: "Upgrade",
  downgrade: "Change Plan",
} as const;

export function PricingCard({
  plan,
  billingInterval,
  referenceId,
  className,
  classNames,
  localization,
  onSubscribe,
  onBeforeCheckout,
  successUrl,
  cancelUrl,
}: PricingCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultPricingLocalization, ...localization };
  const [isLoading, setIsLoading] = useState(false);

  const session = context?.hooks?.useSession?.()?.data;
  const actualReferenceId = referenceId || session?.user?.id;

  const price = billingInterval === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const monthlySavings =
    billingInterval === "yearly" ? ((plan.priceMonthly * 12 - plan.priceYearly) / 12).toFixed(0) : null;

  const formatPrice = (amount: number) => {
    if (amount === 0) return loc.free;
    return `$${amount}`;
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      if (onBeforeCheckout) {
        await onBeforeCheckout();
      }

      // Mode A: Auto-checkout with Better Auth Stripe plugin
      if (context?.authClient?.subscription?.upgrade) {
        const stripePriceId =
          billingInterval === "yearly" ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;

        if (!stripePriceId) {
          console.warn("[PricingCard] No Stripe price ID configured for this plan");
          // Fall back to custom callback
          if (onSubscribe) {
            await onSubscribe(plan.id, billingInterval);
          }
          return;
        }

        const { data, error } = await context.authClient.subscription.upgrade({
          planId: plan.id,
          stripePriceId,
          referenceId: actualReferenceId,
          successUrl: successUrl || window.location.href,
          cancelUrl: cancelUrl || window.location.href,
        });

        if (error) {
          context.toast?.({
            variant: "error",
            message: error.message || "Failed to start checkout",
          });
        } else if (data?.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        }
      }
      // Mode B: Custom callback
      else if (onSubscribe) {
        await onSubscribe(plan.id, billingInterval);
      } else {
        console.warn("[PricingCard] No checkout method available");
      }
    } catch (error) {
      console.error("Failed to start checkout:", error);
      context?.toast?.({
        variant: "error",
        message: "Failed to start checkout",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "w-full relative",
        plan.popular && "border-primary shadow-lg",
        className,
        classNames?.base
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {loc.mostPopular}
          </Badge>
        </div>
      )}

      <CardHeader className={cn("pt-6", classNames?.header)}>
        <CardTitle className={cn(classNames?.title)}>{plan.name}</CardTitle>
        <CardDescription className={cn(classNames?.description)}>{plan.description}</CardDescription>
        <div className={cn("mt-4", classNames?.price)}>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{formatPrice(price)}</span>
            {price > 0 && (
              <span className="text-muted-foreground">
                {billingInterval === "yearly" ? loc.perYear : loc.perMonth}
              </span>
            )}
          </div>
          {monthlySavings && parseInt(monthlySavings) > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {loc.savePerMonth.replace("${amount}", monthlySavings)}
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
          onClick={handleSubscribe}
          disabled={isLoading}
          className={cn("w-full", classNames?.button)}
          variant={plan.popular ? "default" : "outline"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {loc.processing}
            </>
          ) : (
            plan.cta || loc.getStarted
          )}
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

export function PricingCardError({
  error,
  message,
  className,
}: {
  error?: Error;
  message?: string;
  className?: string;
}) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Error Loading Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load pricing data"}
        </p>
      </CardContent>
    </Card>
  );
}
