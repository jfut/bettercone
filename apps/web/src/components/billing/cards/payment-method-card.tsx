/**
 * PaymentMethodCard Component
 * Displays and manages payment methods via Stripe
 * Integrates with Better Auth Stripe plugin
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { BillingLocalization, defaultBillingLocalization } from "../localization";

export interface PaymentMethodCardProps {
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  localization?: Partial<BillingLocalization>;
  showActions?: boolean;
}

export function PaymentMethodCard({
  className,
  classNames,
  localization,
  showActions = true,
}: PaymentMethodCardProps) {
  const loc = { ...defaultBillingLocalization, ...localization };
  const [isLoading, setIsLoading] = useState(false);
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
          console.error("[PaymentMethodCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err: any) => {
        console.error("[PaymentMethodCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user]);

  // Show skeleton while data is loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return <PaymentMethodCardSkeleton className={className} />;
  }

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

  // Open Stripe billing portal to manage payment methods
  const handleManagePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.subscription.billingPortal({
        returnUrl: window.location.href,
      });

      if (error) {
        throw new Error(error.message || "Failed to open billing portal");
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open payment management");
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {loc.paymentMethod || "Payment Method"}
        </CardTitle>
        <CardDescription>
          {loc.managePaymentDescription || "Manage your payment methods and billing information"}
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
                {loc.configuredInStripe || "Configured in Stripe"}
              </p>
              <p className="text-xs text-muted-foreground">
                {loc.manageViaPortal || "Manage via billing portal"}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {loc.stripe || "Stripe"}
          </Badge>
        </div>

        {activeOrg && (
          <div className="text-xs text-muted-foreground">
            {loc.organizationBilling || "Payment method for"} {activeOrg.name}
          </div>
        )}
      </CardContent>

      {showActions && (
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
            {loc.updatePaymentMethod || "Update Payment Method"}
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
