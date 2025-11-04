/**
 * InvoiceHistoryCard Component
 * Displays invoice history with billing portal access
 * 
 * Better Auth Stripe plugin manages invoices through the billing portal.
 * This component provides UI to access invoice history.
 */

"use client";

import { useState, useContext } from "react";
import { FileText, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { Invoice, InvoiceStatus } from "../../types/subscription";
import type { BillingLocalization } from "../../types/localization";

export interface InvoiceHistoryCardProps {
  data?: Invoice[];
  referenceId?: string;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  localization?: Partial<BillingLocalization>;
  maxInvoices?: number;
  showActions?: boolean;
  onBeforeManage?: () => Promise<void> | void;
}

const defaultInvoiceLocalization = {
  invoiceHistory: "Invoice History",
  viewDownloadInvoices: "View and download your invoices",
  noInvoices: "No invoices yet",
  invoicesAppearHere: "Invoices will appear here after your first payment",
  viewAllInvoices: "View All Invoices",
  noBillingPortal: "Billing portal not configured",
  paid: "Paid",
  open: "Open",
  draft: "Draft",
  void: "Void",
  uncollectible: "Uncollectible",
} as const;

const statusVariants: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  open: "secondary",
  draft: "outline",
  void: "destructive",
  uncollectible: "destructive",
};

export function InvoiceHistoryCard({
  data: invoices,
  referenceId,
  className,
  classNames,
  localization,
  maxInvoices = 5,
  showActions = true,
  onBeforeManage,
}: InvoiceHistoryCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultInvoiceLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
  const session = context?.hooks?.useSession?.()?.data;
  const actualReferenceId = referenceId || session?.user?.id;

  const displayInvoices = invoices?.slice(0, maxInvoices) || [];

  const handleViewInvoices = async () => {
    if (!context?.authClient?.subscription?.billingPortal) {
      console.error("[InvoiceHistoryCard] Billing portal not available");
      return;
    }

    setIsPortalLoading(true);
    try {
      if (onBeforeManage) {
        await onBeforeManage();
      }

      const { data, error } = await context.authClient.subscription.billingPortal({
        referenceId: actualReferenceId,
        returnUrl: window.location.href
      });

      if (error) {
        context.toast?.({
          variant: "error",
          message: "Failed to open billing portal"
        });
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to view invoices:", error);
      context?.toast?.({
        variant: "error",
        message: "Failed to open billing portal"
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount?: number, currency?: string) => {
    if (amount === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
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
        {displayInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              {loc.noInvoices}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {loc.invoicesAppearHere}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(invoice.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.number || invoice.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                    <Badge variant={statusVariants[invoice.status]} className="text-xs">
                      {loc[invoice.status] || invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {showActions && context?.authClient?.subscription?.billingPortal && (
        <CardFooter className={classNames?.footer}>
          <Button
            variant="outline"
            onClick={handleViewInvoices}
            disabled={isPortalLoading}
            className="w-full flex items-center gap-2"
          >
            {isPortalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {loc.viewAllInvoices}
          </Button>
        </CardFooter>
      )}

      {showActions && !context?.authClient?.subscription?.billingPortal && (
        <CardFooter className={classNames?.footer}>
          <div className="w-full text-center text-sm text-muted-foreground">
            {loc.noBillingPortal}
          </div>
        </CardFooter>
      )}
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
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function InvoiceHistoryCardError({ 
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
          Error Loading Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load invoice data"}
        </p>
      </CardContent>
    </Card>
  );
}
