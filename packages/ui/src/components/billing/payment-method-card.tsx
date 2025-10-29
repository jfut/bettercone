/**
 * PaymentMethodCard Component
 * Displays and manages payment methods
 * Backend-agnostic - works with any Better Auth implementation
 */

"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import type { BetterAuthClient, BetterAuthSubscription, BetterAuthOrganization } from "../../types/auth";
import type { BillingLocalization } from "../../types/localization";

export interface PaymentMethodCardProps {
  /** Better Auth client instance */
  authClient: BetterAuthClient;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  
  /** Localization strings */
  localization?: Partial<BillingLocalization>;
  
  /** Show action buttons */
  showActions?: boolean;
  
  /** Callback when manage payment is clicked */
  onManagePayment?: (subscription?: BetterAuthSubscription, organization?: BetterAuthOrganization) => Promise<void> | void;
}

const defaultPaymentLocalization = {
  paymentMethod: "Payment Method",
  managePaymentDescription: "Manage your payment methods and billing information",
  configuredInStripe: "Configured in Stripe",
  manageViaPortal: "Manage via billing portal",
  stripe: "Stripe",
  organizationBilling: "Payment method for",
  updatePaymentMethod: "Update Payment Method",
} as const;

export function PaymentMethodCard({
  authClient,
  className,
  classNames,
  localization,
  showActions = true,
  onManagePayment,
}: PaymentMethodCardProps) {
  const loc = { ...defaultPaymentLocalization, ...localization };
  const [isLoading, setIsLoading] = useState(false);
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
          console.error("[PaymentMethodCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err) => {
        console.error("[PaymentMethodCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user, authClient]);

  // Show skeleton while loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return <PaymentMethodCardSkeleton className={cn(className, classNames?.base)} />;
  }

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

  const handleManagePayment = async () => {
    if (!onManagePayment) return;
    
    setIsLoading(true);
    try {
      await onManagePayment(subscription, activeOrg || undefined);
    } catch (error) {
      console.error("Failed to manage payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {loc.paymentMethod}
        </CardTitle>
        <CardDescription>
          {loc.managePaymentDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {loc.configuredInStripe}
              </p>
              <p className="text-xs text-muted-foreground">
                {loc.manageViaPortal}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {loc.stripe}
          </Badge>
        </div>

        {activeOrg && (
          <div className="text-xs text-muted-foreground">
            {loc.organizationBilling} {activeOrg.name}
          </div>
        )}
      </CardContent>

      {showActions && onManagePayment && (
        <CardFooter className={classNames?.footer}>
          <Button
            onClick={handleManagePayment}
            disabled={isLoading}
            className="w-full flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {loc.updatePaymentMethod}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function PaymentMethodCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
