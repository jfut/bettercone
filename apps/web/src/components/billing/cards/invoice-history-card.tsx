/**
 * InvoiceHistoryCard Component
 * Displays past invoices with download functionality
 * Integrates with Better Auth Stripe plugin
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { BillingLocalization, defaultBillingLocalization } from "../localization";

export interface InvoiceHistoryCardProps {
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    invoice?: string;
  };
  localization?: Partial<BillingLocalization>;
  maxInvoices?: number;
}

export function InvoiceHistoryCard({
  className,
  classNames,
  localization,
  maxInvoices = 5,
}: InvoiceHistoryCardProps) {
  const loc = { ...defaultBillingLocalization, ...localization };
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
          console.error("[InvoiceHistoryCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err: any) => {
        console.error("[InvoiceHistoryCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user]);

  // Show skeleton while data is loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return <InvoiceHistoryCardSkeleton className={className} />;
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

  /**
   * Better Auth Stripe plugin uses Stripe's hosted billing portal for invoice management
   * This is the recommended approach as it keeps billing data secure and up-to-date
   */
  const handleViewInvoices = async () => {
    try {
      const result = await authClient.subscription.billingPortal({
        referenceId: subscription?.referenceId || session?.user?.id,
        returnUrl: window.location.href,
      });

      if (result.data?.url) {
        window.location.href = result.data.url;
      } else if (result.error) {
        console.error("[InvoiceHistoryCard] Error opening billing portal:", result.error);
      }
    } catch (error) {
      console.error("[InvoiceHistoryCard] Exception opening billing portal:", error);
    }
  };

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {loc.invoiceHistory}
        </CardTitle>
        <CardDescription>
          {loc.viewDownloadInvoices || "View and download your invoices"}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-3", classNames?.content)}>
        {!subscription || !subscription.stripeCustomerId ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {loc.noInvoices}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {loc.invoicesAppearHere || "Invoices will appear here after your first payment"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View and manage your invoices, payment history, and billing details in the Stripe billing portal.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewInvoices}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {loc.viewAllInvoices || "Open Billing Portal"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function InvoiceHistoryCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
