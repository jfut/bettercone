/**
 * Team Billing Card Component
 * Displays organization-level billing summary with auto-fetch capability
 * 
 * Can auto-fetch subscription data using Better Auth Stripe plugin or display
 * subscription data passed via props.
 */

"use client";

import { useState, useEffect, useContext } from "react";
import { CreditCard, Calendar, DollarSign, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { Subscription } from "../../types/subscription";
import type { BillingLocalization } from "../../types/localization";

export interface TeamBillingCardProps {
  data?: Subscription;
  organizationId?: string;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  localization?: Partial<BillingLocalization>;
  showActions?: boolean;
  onBeforeManage?: () => Promise<void> | void;
  onBeforeChangePlan?: () => Promise<void> | void;
  viewPlansUrl?: string;
}

const defaultTeamBillingLocalization = {
  teamBilling: "Team Billing",
  billingOverviewOrg: "Billing overview for your organization",
  currentPlan: "Current Plan",
  nextBilling: "Next billing",
  subscriptionDetails: "Subscription Details",
  status: "Status",
  cancellation: "Cancellation",
  cancelsAtPeriodEnd: "Cancels at period end",
  subscriptionActive: "Subscription Active",
  manageSubscriptionPortal: "Manage your subscription in the billing portal",
  manageBilling: "Manage Billing",
  changePlan: "Change Plan",
  noBillingPortal: "Billing portal not configured",
  active: "Active",
  trialing: "Trialing",
  canceled: "Canceled",
  past_due: "Past Due",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete (Expired)",
  paused: "Paused",
} as const;

// Auto-fetch component (uses AuthUIContext and subscription.list())
function TeamBillingCardAutoFetch({
  organizationId,
  className,
  classNames,
  localization,
  showActions,
  onBeforeManage,
  onBeforeChangePlan,
  viewPlansUrl,
}: TeamBillingCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultTeamBillingLocalization, ...localization };
  const [subscription, setSubscription] = useState<Subscription | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const activeOrg = context?.hooks?.useActiveOrganization?.()?.data;
  const actualOrgId = organizationId || activeOrg?.id;

  useEffect(() => {
    if (!actualOrgId || !context?.authClient?.subscription?.list) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    context.authClient.subscription
      .list({ referenceId: actualOrgId })
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message || "Failed to fetch subscription"));
          setSubscription(null);
        } else {
          const activeSub = data?.find(
            (sub: Subscription) => sub.status === "active" || sub.status === "trialing"
          ) || data?.[0] || null;
          setSubscription(activeSub);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err);
        setSubscription(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [actualOrgId, context?.authClient]);

  if (isLoading) {
    return <TeamBillingCardSkeleton className={cn(className, classNames?.base)} />;
  }

  if (error) {
    return <TeamBillingCardError error={error} className={cn(className, classNames?.base)} />;
  }

  return (
    <TeamBillingCardPresentational
      data={subscription || undefined}
      organizationId={actualOrgId}
      className={className}
      classNames={classNames}
      localization={localization}
      showActions={showActions}
      onBeforeManage={onBeforeManage}
      onBeforeChangePlan={onBeforeChangePlan}
      viewPlansUrl={viewPlansUrl}
    />
  );
}

// Presentational component (displays subscription data)
function TeamBillingCardPresentational({
  data: subscription,
  organizationId,
  className,
  classNames,
  localization,
  showActions = true,
  onBeforeManage,
  onBeforeChangePlan,
  viewPlansUrl,
}: TeamBillingCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultTeamBillingLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const activeOrg = context?.hooks?.useActiveOrganization?.()?.data;
  const actualOrgId = organizationId || activeOrg?.id;

  const planName = subscription?.plan?.name || "Free";
  const nextBillingDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : "N/A";

  const handleManageBilling = async () => {
    if (!context?.authClient?.subscription?.billingPortal) {
      console.error("[TeamBillingCard] Billing portal not available");
      return;
    }

    setIsPortalLoading(true);
    try {
      if (onBeforeManage) {
        await onBeforeManage();
      }

      const { data, error } = await context.authClient.subscription.billingPortal({
        referenceId: actualOrgId,
        returnUrl: window.location.href,
      });

      if (error) {
        context.toast?.({
          variant: "error",
          message: "Failed to open billing portal",
        });
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to manage billing:", error);
      context?.toast?.({
        variant: "error",
        message: "Failed to open billing portal",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (onBeforeChangePlan) {
      await onBeforeChangePlan();
    }

    if (viewPlansUrl) {
      context?.navigate?.(viewPlansUrl);
    }
  };

  const statusBadgeVariant = (status?: string) => {
    switch (status) {
      case "active":
      case "trialing":
        return "default";
      case "canceled":
      case "past_due":
      case "unpaid":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{loc.teamBilling}</CardTitle>
          </div>
          {activeOrg?.name && (
            <Badge variant="outline" className="text-xs">
              {activeOrg.name}
            </Badge>
          )}
        </div>
        <CardDescription>{loc.billingOverviewOrg}</CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
        {/* Current Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{loc.currentPlan}</p>
              <p className="text-2xl font-bold capitalize">{planName}</p>
            </div>
          </div>

          {/* Next Billing Date */}
          {subscription && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {loc.nextBilling}: {nextBillingDate}
              </span>
            </div>
          )}
        </div>

        {subscription && (
          <>
            <Separator />

            {/* Subscription Details */}
            <div className="space-y-2">
              <p className="text-sm font-medium">{loc.subscriptionDetails}</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{loc.status}</span>
                  <Badge variant={statusBadgeVariant(subscription.status)}>
                    {loc[subscription.status as keyof typeof loc] || subscription.status}
                  </Badge>
                </div>
                {subscription.cancelAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{loc.cancellation}</span>
                    <span className="font-medium text-destructive">
                      {loc.cancelsAtPeriodEnd}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Subscription Active Notice */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{loc.subscriptionActive}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {loc.manageSubscriptionPortal}
              </p>
            </div>
          </>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className={cn("flex gap-2", classNames?.footer)}>
          {context?.authClient?.subscription?.billingPortal && (
            <Button
              onClick={handleManageBilling}
              disabled={isPortalLoading}
              className="flex-1 flex items-center gap-2"
            >
              {isPortalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {loc.manageBilling}
            </Button>
          )}

          {viewPlansUrl && (
            <Button onClick={handleChangePlan} variant="outline" className="flex-1">
              {loc.changePlan}
            </Button>
          )}

          {!context?.authClient?.subscription?.billingPortal && !viewPlansUrl && (
            <div className="w-full text-center text-sm text-muted-foreground">
              {loc.noBillingPortal}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// Main component with auto-detection
export function TeamBillingCard(props: TeamBillingCardProps) {
  const context = useContext(AuthUIContext);
  
  // Mode A: Auto-fetch if authClient.subscription.list is available and no data prop
  const hasSubscriptionAPI = context?.authClient?.subscription?.list;
  
  if (!props.data && hasSubscriptionAPI) {
    return <TeamBillingCardAutoFetch {...props} />;
  }
  
  // Mode C: Presentational (data provided via props or no auto-fetch available)
  return <TeamBillingCardPresentational {...props} />;
}

export function TeamBillingCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
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
          </div>
          <Skeleton className="h-4 w-full" />
        </div>

        <Separator />

        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>

        <Separator />

        <Skeleton className="h-24 w-full rounded-lg" />
      </CardContent>

      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}

export function TeamBillingCardError({
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
          Error Loading Team Billing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load team billing data"}
        </p>
      </CardContent>
    </Card>
  );
}
