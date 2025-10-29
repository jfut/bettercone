/**
 * InvoiceHistoryCard Component
 * Displays past invoices with download functionality
 * Backend-agnostic - works with any Better Auth implementation
 */

"use client";

import { useState, useEffect } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import type { BetterAuthClient, BetterAuthSubscription, BetterAuthOrganization } from "../../types/auth";
import type { BillingLocalization } from "../../types/localization";

export interface InvoiceHistoryCardProps {
  /** Better Auth client instance */
  authClient: BetterAuthClient;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    invoice?: string;
  };
  
  /** Localization strings */
  localization?: Partial<BillingLocalization>;
  
  /** Maximum number of invoices to display */
  maxInvoices?: number;
  
  /** Callback when view invoices is clicked */
  onViewInvoices?: (subscription?: BetterAuthSubscription, organization?: BetterAuthOrganization) => Promise<void> | void;
}

const defaultInvoiceLocalization = {
  invoiceHistory: "Invoice History",
  viewDownloadInvoices: "View and download your invoices",
  noInvoices: "No invoices yet",
  invoicesAppearHere: "Invoices will appear here after your first payment",
  viewAllInvoices: "Open Billing Portal",
} as const;

export function InvoiceHistoryCard({
  authClient,
  className,
  classNames,
  localization,
  maxInvoices = 5,
  onViewInvoices,
}: InvoiceHistoryCardProps) {
  const loc = { ...defaultInvoiceLocalization, ...localization };
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
          console.error("[InvoiceHistoryCard] Error fetching subscriptions:", error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
      })
      .catch((err) => {
        console.error("[InvoiceHistoryCard] Exception fetching subscriptions:", err);
        setSubscriptions([]);
      });
  }, [session?.user, authClient]);

  // Show skeleton while loading
  if (isSessionPending || isOrgsPending || subscriptions === undefined) {
    return <InvoiceHistoryCardSkeleton className={cn(className, classNames?.base)} />;
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
    : undefined;

  const handleViewInvoices = async () => {
    if (!onViewInvoices) return;
    
    try {
      await onViewInvoices(subscription, activeOrg);
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
          {loc.viewDownloadInvoices}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-3", classNames?.content)}>
        {!subscription ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {loc.noInvoices}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {loc.invoicesAppearHere}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View and manage your invoices, payment history, and billing details in the billing portal.
            </p>
            {onViewInvoices && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewInvoices}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {loc.viewAllInvoices}
              </Button>
            )}
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
