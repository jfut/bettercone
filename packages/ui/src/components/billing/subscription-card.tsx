/**
 * SubscriptionCard Component
 * Displays current subscription with management actions
 * 
 * Supports three modes:
 * 1. Auto-fetch: Uses Better Auth Stripe plugin (authClient.subscription.list())
 * 2. Custom backend: Uses custom authClient.subscription implementation
 * 3. Presentational: Manual data passing via props
 * 
 * @see https://www.better-auth.com/docs/plugins/stripe
 */

"use client";

import { useState, useEffect, useContext } from "react";
import { CreditCard, ExternalLink, Settings, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { Subscription } from "../../types/subscription";
import type { BillingLocalization } from "../../types/localization";

export interface SubscriptionCardProps {
  /**
   * Subscription data (optional)
   * If not provided, component will auto-fetch using authClient.subscription.list()
   */
  data?: Subscription;
  
  /**
   * Reference ID to fetch subscription for
   * Defaults to current user ID
   */
  referenceId?: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * CSS class names for specific parts
   */
  classNames?: {
    base?: string;
    header?: string;
    title?: string;
    description?: string;
    content?: string;
    footer?: string;
    actions?: string;
  };
  
  /**
   * Localization strings
   */
  localization?: Partial<BillingLocalization>;
  
  /**
   * Show action buttons
   */
  showActions?: boolean;
  
  /**
   * Callback before opening billing portal
   */
  onBeforeManage?: (subscription: Subscription) => Promise<void> | void;
  
  /**
   * Callback for action buttons
   */
  onAction?: (action: "manage" | "cancel" | "upgrade", subscription?: Subscription) => void;
  
  /**
   * Custom URL for viewing plans
   */
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

/**
 * SubscriptionCard - Main component with auto-detection
 */
export function SubscriptionCard(props: SubscriptionCardProps) {
  const context = useContext(AuthUIContext);
  
  // Check if auto-fetch is possible
  const hasSubscriptionAPI = context?.authClient?.subscription?.list;
  const shouldAutoFetch = hasSubscriptionAPI && !props.data;
  
  if (shouldAutoFetch) {
    return <SubscriptionCardAutoFetch {...props} />;
  }
  
  return <SubscriptionCardPresentational {...props} />;
}

/**
 * Auto-fetch implementation
 */
function SubscriptionCardAutoFetch(props: SubscriptionCardProps) {
  const context = useContext(AuthUIContext);
  
  if (!context) {
    return <SubscriptionCardError 
      message="AuthUIContext not found. Wrap component in AuthUIProvider." 
      className={props.className}
    />;
  }
  
  const { authClient, toast, hooks } = context;
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: session } = hooks.useSession();
  const referenceId = props.referenceId || session?.user?.id;
  
  useEffect(() => {
    if (!authClient.subscription?.list) {
      setError(new Error("authClient.subscription.list not available"));
      setIsLoading(false);
      return;
    }
    
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await authClient.subscription!.list({
          referenceId
        });
        
        if (fetchError) {
          setError(fetchError);
          toast({
            variant: "error",
            message: "Failed to load subscription"
          });
        } else {
          setSubscriptions(data || []);
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          variant: "error",
          message: "Failed to load subscription"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [referenceId, authClient, toast]);
  
  if (isLoading) {
    return <SubscriptionCardSkeleton className={props.className} />;
  }
  
  if (error) {
    return <SubscriptionCardError error={error} className={props.className} />;
  }
  
  const activeSubscription = subscriptions?.find(
    sub => sub.status === "active" || sub.status === "trialing"
  );
  
  return (
    <SubscriptionCardPresentational 
      {...props} 
      data={activeSubscription || undefined}
    />
  );
}

/**
 * Presentational implementation
 */
function SubscriptionCardPresentational({
  data: subscription,
  className,
  classNames,
  localization,
  showActions = true,
  onBeforeManage,
  onAction,
  viewPlansUrl = "/pricing",
}: SubscriptionCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultSubscriptionLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
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

  const handleManageSubscription = async () => {
    if (!subscription || !context?.authClient?.subscription?.billingPortal) return;

    setIsPortalLoading(true);
    try {
      if (onBeforeManage) {
        await onBeforeManage(subscription);
      }

      const { data, error } = await context.authClient.subscription.billingPortal({
        referenceId: subscription.referenceId,
        returnUrl: window.location.href
      });

      if (error) {
        context.toast({
          variant: "error",
          message: "Failed to open billing portal"
        });
      } else if (data?.url) {
        window.location.href = data.url;
      }
      
      onAction?.("manage", subscription);
    } catch (error) {
      console.error("Failed to manage subscription:", error);
      context?.toast({
        variant: "error",
        message: "Failed to open billing portal"
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

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
              {showActions && context?.navigate && (
                <Button
                  onClick={() => {
                    context.navigate(viewPlansUrl);
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
          Subscription for {subscription.referenceId}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
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

          {subscription.periodEnd && subscription.status === "active" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next billing date</span>
              <span className="text-sm font-medium">
                {formatDate(subscription.periodEnd)}
              </span>
            </div>
          )}

          {subscription.status === "trialing" && subscription.trialEnd && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trial ends</span>
              <span className="text-sm font-medium">
                {formatDate(subscription.trialEnd)}
              </span>
            </div>
          )}

          {subscription.cancelAtPeriodEnd && subscription.periodEnd && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-destructive">
                Cancels on {formatDate(subscription.periodEnd)}
              </span>
            </div>
          )}

          {subscription.seats && subscription.seats > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seats</span>
              <span className="text-sm font-medium">{subscription.seats}</span>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && context?.authClient?.subscription?.billingPortal && (
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
          {context?.navigate && (
            <Button
              variant="outline"
              onClick={() => {
                context.navigate(viewPlansUrl);
                onAction?.("upgrade", subscription);
              }}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {loc.viewPlans}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

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

export function SubscriptionCardError({ 
  error, 
  message,
  className 
}: { 
  error?: Error
  message?: string
  className?: string 
}) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Error Loading Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load subscription data"}
        </p>
      </CardContent>
    </Card>
  );
}
