/**
 * Team Billing Card Component
 * Displays organization-level billing summary with plan, costs, and usage
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export interface TeamBillingCardProps {
  /** Custom className for the card */
  className?: string;
  /** Callback when manage billing is clicked */
  onManageBilling?: () => void;
}

export function TeamBillingCard({ 
  className,
  onManageBilling,
}: TeamBillingCardProps) {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[] | undefined>(undefined);
  
  // Get organization and session data
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  // Fetch subscriptions for the organization
  useEffect(() => {
    if (!activeOrg?.id) return;
    
    authClient.subscription
      .list()
      .then(({ data, error }: any) => {
        if (error) {
          console.error("[TeamBillingCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err: any) => {
        console.error("[TeamBillingCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [activeOrg?.id]);
  
  // Show skeleton while loading
  if (orgsPending || sessionPending || subscriptions === undefined || !activeOrg || !session) {
    return <TeamBillingCardSkeleton />;
  }

  // Find subscription for this organization
  const orgSubscription = subscriptions.find(
    (sub: any) => sub.referenceId === activeOrg.id && (sub.status === "active" || sub.status === "trialing")
  );
  
  // Extract billing data from actual subscription
  const planName = orgSubscription?.plan || "Free";
  const planPrice = 0; // Would need to be fetched from plan config or Stripe
  const billingPeriod = "monthly"; // Would come from subscription metadata
  const nextBillingDate = orgSubscription?.periodEnd 
    ? new Date(orgSubscription.periodEnd).toLocaleDateString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

  const handleManageBilling = () => {
    if (onManageBilling) {
      onManageBilling();
    } else {
      router.push("/demo/advanced/billing-dashboard");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Billing</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {activeOrg.name}
          </Badge>
        </div>
        <CardDescription>
          Billing overview for your organization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-2xl font-bold">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Per {billingPeriod === "monthly" ? "month" : "year"}</p>
              <p className="text-2xl font-bold">{formatCurrency(planPrice)}</p>
            </div>
          </div>

          {/* Next Billing Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next billing: {nextBillingDate}</span>
          </div>
        </div>

        <Separator />

        {/* Subscription Details */}
        {orgSubscription && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Subscription Details</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{orgSubscription.status}</span>
              </div>
              {orgSubscription.cancelAtPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cancellation</span>
                  <span className="font-medium text-destructive">Cancels at period end</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Estimated Cost Summary */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Estimated Total</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatCurrency(planPrice)}</span>
            <span className="text-sm text-muted-foreground">
              / {billingPeriod === "monthly" ? "month" : "year"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            No additional charges this period
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleManageBilling}
            className="flex-1"
            variant="default"
          >
            Manage Billing
          </Button>
          
          <Button 
            onClick={() => router.push("/demo/pricing")}
            variant="outline"
            className="flex-1"
          >
            Change Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamBillingCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
        </div>

        <Separator />

        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>

        <Separator />

        <Skeleton className="h-24 w-full rounded-lg" />

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
