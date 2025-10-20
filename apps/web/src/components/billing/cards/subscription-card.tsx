/**
 * SubscriptionCard Component
 * Displays current subscription with management actions
 * Integrates with Better Auth Stripe plugin
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, ExternalLink, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { BillingLocalization, defaultBillingLocalization } from "../localization";

export interface SubscriptionCardProps {
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    title?: string;
    description?: string;
    content?: string;
    footer?: string;
    actions?: string;
  };
  localization?: Partial<BillingLocalization>;
  showActions?: boolean;
  onAction?: (action: "manage" | "cancel" | "upgrade") => void;
}

export function SubscriptionCard({
  className,
  classNames,
  localization,
  showActions = true,
  onAction,
}: SubscriptionCardProps) {
  const loc = { ...defaultBillingLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[] | undefined>(undefined);

  // Better Auth hooks
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: organizations, isPending: isOrgsPending } = authClient.useListOrganizations();

  // Fetch subscriptions following Better Auth pattern
  useEffect(() => {
    if (!session?.user) return;
    
    authClient.subscription
      .list()
      .then(({ data, error }: any) => {
        if (error) {
          console.error("[SubscriptionCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err: any) => {
        console.error("[SubscriptionCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user]);

  // Build complete list of valid reference IDs (user + all orgs)
  const validReferenceIds = [
    ...(session?.user?.id ? [session.user.id] : []),
    ...(organizations || []).map((org: any) => org.id),
  ];

  // Find active subscription matching any of the user's organizations or personal account
  const subscription =
    subscriptions?.find(
      (sub: any) =>
        validReferenceIds.includes(sub.referenceId) &&
        (sub.status === "active" || sub.status === "trialing")
    ) ||
    subscriptions?.find((sub: any) => validReferenceIds.includes(sub.referenceId));

  // Determine which org this subscription belongs to
  const activeOrg = subscription
    ? organizations?.find((org: any) => org.id === subscription.referenceId)
    : organizations?.[0];

  // Show skeleton while any data is still loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return (
      <Card className={cn("w-full", className, classNames?.base)}>
        <CardHeader className={classNames?.header}>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className={cn("space-y-4", classNames?.content)}>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Helper functions
  const handleManageSubscription = async () => {
    if (!subscription) {
      toast.error("No active subscription found");
      return;
    }

    setIsPortalLoading(true);
    try {
      // Call our new portal API endpoint
      const response = await fetch("/api/billing/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          returnUrl: "/demo/billing/current-plan?portal=true" 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to open billing portal");
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      toast.error(error instanceof Error ? error.message : "Failed to open billing portal");
      setIsPortalLoading(false);
    }
  };

  const getStatusVariant = (
    status?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "canceled":
      case "past_due":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    // Convex timestamps are already in milliseconds, don't multiply by 1000
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // No subscription state
  if (!subscription) {
    return (
      <Card className={cn("w-full", className, classNames?.base)}>
        <CardHeader className={classNames?.header}>
          <CardTitle className={cn("flex items-center gap-2", classNames?.title)}>
            <CreditCard className="h-5 w-5" />
            {loc.currentPlan}
          </CardTitle>
          <CardDescription className={classNames?.description}>
            {loc.noActiveSubscription}
          </CardDescription>
        </CardHeader>
        <CardContent className={classNames?.content}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {loc.startSubscription}
              </p>
              {showActions && (
                <Button
                  onClick={() => {
                    onAction?.("upgrade");
                    window.location.href = "/demo/pricing";
                  }}
                >
                  {loc.viewPlans}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className={cn("flex items-center gap-2", classNames?.title)}>
          <CreditCard className="h-5 w-5" />
          {loc.currentPlan}
        </CardTitle>
        <CardDescription className={classNames?.description}>
          {activeOrg
            ? `${activeOrg.name} subscription`
            : "Your personal subscription"}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
        {/* Plan Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Plan</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold capitalize">
                {subscription.plan?.replace(/-/g, " ") || "Unknown Plan"}
              </span>
              <Badge variant={getStatusVariant(subscription.status)}>
                {subscription.status?.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>

          {/* Seats (for team plans) */}
          {subscription.seats && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seats</span>
              <span className="text-sm font-medium">
                {subscription.seats}
              </span>
            </div>
          )}

          {/* Next Billing Date */}
          {subscription.periodEnd && subscription.status === "active" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next billing date</span>
              <span className="text-sm font-medium">
                {formatDate(subscription.periodEnd)}
              </span>
            </div>
          )}

          {/* Trial End Date */}
          {subscription.status === "trialing" && subscription.trialEnd && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trial ends</span>
              <span className="text-sm font-medium">
                {formatDate(subscription.trialEnd)}
              </span>
            </div>
          )}

          {/* Cancel at Period End Warning */}
          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-destructive">
                Cancels on {formatDate(subscription.periodEnd)}
              </span>
            </div>
          )}
        </div>

        {/* Reference Info */}
        {activeOrg && subscription.referenceId === activeOrg.id && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              This is an organization subscription. All members have access to premium features.
            </p>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className={cn("flex gap-2", classNames?.footer, classNames?.actions)}>
          <Button
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="flex items-center gap-2"
          >
            {isPortalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Settings className="h-4 w-4" />
            )}
            {loc.manageSubscription}
          </Button>
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            {loc.billingPortal}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Skeleton export
export function SubscriptionCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}
