/**
 * SubscriptionCard Component
 * Displays current subscription with management actions
 * Backend-agnostic - works with any Better Auth implementation
 */

"use client";

import { useState, useEffect } from "react";
import { CreditCard, ExternalLink, Settings, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { Badge } from "../badge";
import { Skeleton } from "../skeleton";
import type { BetterAuthClient, BetterAuthSubscription, BetterAuthOrganization } from "../../types/auth";
import type { BillingLocalization } from "../../types/localization";

export interface SubscriptionCardProps {
  /** Better Auth client instance */
  authClient: BetterAuthClient;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: {
    base?: string;
    header?: string;
    title?: string;
    description?: string;
    content?: string;
    footer?: string;
    actions?: string;
  };
  
  /** Localization strings */
  localization?: Partial<BillingLocalization>;
  
  /** Show action buttons */
  showActions?: boolean;
  
  /** Callback when manage subscription is clicked */
  onManageSubscription?: (subscription: BetterAuthSubscription, organization?: BetterAuthOrganization) => Promise<void> | void;
  
  /** Callback for action buttons */
  onAction?: (action: "manage" | "cancel" | "upgrade", subscription?: BetterAuthSubscription) => void;
  
  /** Custom URL for viewing plans */
  viewPlansUrl?: string;
}

const defaultSubscriptionLocalization = {
  currentPlan: "Current Plan",
  planStatus: "Status",
  nextBillingDate: "Next billing date",
  manageBilling: "Manage Billing",
  upgradeNow: "Upgrade Now",
  cancelSubscription: "Cancel Subscription",
  noActiveSubscription: "No active subscription",
  startSubscription: "You don't have an active subscription yet",
  viewPlans: "View Plans",
  manageSubscription: "Manage Subscription",
  billingPortal: "Billing Portal",
} as const;

export function SubscriptionCard({
  authClient,
  className,
  classNames,
  localization,
  showActions = true,
  onManageSubscription,
  onAction,
  viewPlansUrl = "/pricing",
}: SubscriptionCardProps) {
  const loc = { ...defaultSubscriptionLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<BetterAuthSubscription[] | undefined>(undefined);

  // Better Auth hooks
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: organizations, isPending: isOrgsPending } = authClient.useListOrganizations();

  // Fetch subscriptions
  useEffect(() => {
    if (!session?.user || !authClient.subscription?.list) return;
    
    authClient.subscription
      .list()
      .then(({ data, error }) => {
        if (error) {
          console.error("[SubscriptionCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err) => {
        console.error("[SubscriptionCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user, authClient]);

  // Build complete list of valid reference IDs (user + all orgs)
  const validReferenceIds = [
    ...(session?.user?.id ? [session.user.id] : []),
    ...(organizations || []).map((org) => org.id),
  ];

  // Find active subscription
  const subscription =
    subscriptions?.find(
      (sub) =>
        validReferenceIds.includes(sub.referenceId) &&
        (sub.status === "active" || sub.status === "trialing")
    ) ||
    subscriptions?.find((sub) => validReferenceIds.includes(sub.referenceId));

  // Determine which org this subscription belongs to
  const activeOrg = subscription
    ? organizations?.find((org) => org.id === subscription.referenceId)
    : organizations?.[0];

  // Show skeleton while loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return <SubscriptionCardSkeleton className={cn(className, classNames?.base)} />;
  }

  // Helper functions
  const handleManageSubscription = async () => {
    if (!subscription) return;

    setIsPortalLoading(true);
    try {
      if (onManageSubscription) {
        await onManageSubscription(subscription, activeOrg || undefined);
      }
      onAction?.("manage", subscription);
    } catch (error) {
      console.error("Failed to manage subscription:", error);
    } finally {
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

  const formatDate = (date?: Date | number | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "object" ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
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
                {subscription.planId?.replace(/-/g, " ") || "Unknown Plan"}
              </span>
              <Badge variant={getStatusVariant(subscription.status)}>
                {subscription.status?.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>

          {/* Next Billing Date */}
          {subscription.currentPeriodEnd && subscription.status === "active" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next billing date</span>
              <span className="text-sm font-medium">
                {formatDate(subscription.currentPeriodEnd)}
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
          {subscription.cancelAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-destructive">
                Cancels on {formatDate(subscription.cancelAt)}
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

      {showActions && onManageSubscription && (
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
