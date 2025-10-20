/**
 * Pricing Dashboard Component
 * Composed view of pricing page following Better Auth UI patterns
 */

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { PricingHeader } from "./pricing-header";
import { PricingCard, PricingCardSkeleton } from "./pricing-card";
import { pricingPlans } from "./plans";
import type { BillingInterval, SubscriptionParams } from "./types";
import { cn } from "@/lib/utils";

export interface PricingDashboardProps {
  className?: string;
  classNames?: {
    container?: string;
    header?: string;
    grid?: string;
    footer?: string;
  };
  successUrl?: string;
  cancelUrl?: string;
  defaultInterval?: BillingInterval;
  showFooter?: boolean;
}

export function PricingDashboard({
  className,
  classNames,
  successUrl = "/demo/billing/current-plan",
  cancelUrl = "/demo/pricing",
  defaultInterval = "monthly",
  showFooter = true
}: PricingDashboardProps) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(defaultInterval);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedOrgForTeam, setSelectedOrgForTeam] = useState<string | null>(null);

  // Better Auth hooks
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  
  const isInitialLoading = sessionPending || orgsPending;


  /**
   * Map plan name and billing interval to Stripe price ID
   * These should match your Stripe dashboard price IDs
   * Set via environment variables: STRIPE_PRICE_FREE_MONTHLY, STRIPE_PRICE_PRO_MONTHLY, etc.
   */
  const getPriceId = (planId: string, interval: BillingInterval): string => {
    const priceMap: Record<string, Record<BillingInterval, string>> = {
      free: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_MONTHLY || "price_free_monthly",
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_YEARLY || "price_free_annual",
      },
      pro: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || "price_pro_annual",
      },
      team: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY || "price_team_monthly",
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_YEARLY || "price_team_annual",
      },
    };

    return priceMap[planId]?.[interval] || "";
  };

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);

    try {
      // For team plans, require organization selection
      if (planId === "team" && organizations && organizations.length > 0) {
        if (!selectedOrgForTeam) {
          toast.warning("Organization Required", {
            description: "Please select an organization for the team plan or create one first."
          });
          setIsLoading(null);
          return;
        }
      }

      // Handle free plan - no checkout needed
      if (planId === "free") {
        // Use Better Auth's subscription upgrade for free plan
        const { data, error } = await authClient.subscription.upgrade({
          plan: "free",
          successUrl: `${window.location.origin}${successUrl}`,
          cancelUrl: `${window.location.origin}${cancelUrl}`,
        });

        if (error) {
          toast.error("Error", {
            description: error.message || "Failed to switch to free plan."
          });
        } else {
          toast.success("Plan Updated", {
            description: "Switched to free plan successfully!"
          });
          setTimeout(() => {
            window.location.href = successUrl;
          }, 1500);
        }
        setIsLoading(null);
        return;
      }

      // For paid plans, use our custom checkout API
      const priceId = getPriceId(planId, billingInterval);
      
      if (!priceId) {
        toast.error("Configuration Error", {
          description: "Invalid plan configuration. Please contact support."
        });
        setIsLoading(null);
        return;
      }

      // Call our custom checkout API
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          organizationId: planId === "team" ? selectedOrgForTeam : undefined,
          mode: "subscription",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe Checkout
      toast.loading("Redirecting to checkout...");
      window.location.href = url;

    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Subscription Error", {
        description: err instanceof Error ? err.message : "An error occurred while processing your subscription. Please try again."
      });
      setIsLoading(null);
    }
  };

  return (
    <div className={cn("container max-w-7xl py-12 mx-auto", classNames?.container, className)}>
      {/* Header with Billing Toggle */}
      <div className={cn(classNames?.header)}>
        <PricingHeader
          billingInterval={billingInterval}
          onIntervalChange={setBillingInterval}
        />
      </div>

      {/* Pricing Cards Grid */}
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto", classNames?.grid)}>
        {isInitialLoading ? (
          // Show skeletons while fetching data
          <>
            <PricingCardSkeleton />
            <PricingCardSkeleton />
            <PricingCardSkeleton />
          </>
        ) : (
          // Show actual pricing cards
          pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              isLoading={isLoading === plan.id}
              organizations={organizations || []}
              orgsLoaded={!orgsPending}
              selectedOrgId={selectedOrgForTeam}
              onOrgChange={setSelectedOrgForTeam}
              onSubscribe={() => handleSubscribe(plan.id)}
            />
          ))
        )}
      </div>

      {/* Footer Info */}
      {showFooter && (
        <div className={cn("mt-16 text-center", classNames?.footer)}>
          <p className="text-muted-foreground">
            All plans include 14-day free trial. No credit card required to start.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Questions? <a href="mailto:support@example.com" className="text-primary hover:underline">Contact support</a>
          </p>
        </div>
      )}
    </div>
  );
}

export function PricingDashboardSkeleton() {
  return (
    <div className="container max-w-7xl py-12 mx-auto">
      <div className="text-center mb-12 space-y-4">
        <div className="h-10 w-64 bg-muted rounded-lg mx-auto" />
        <div className="h-6 w-96 bg-muted rounded-lg mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCardSkeleton />
        <PricingCardSkeleton />
        <PricingCardSkeleton />
      </div>
    </div>
  );
}
