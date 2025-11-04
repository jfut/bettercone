/**
 * PaymentMethodCard Component
 * Displays payment method information and billing portal access
 * 
 * Better Auth Stripe plugin manages payment methods through the billing portal.
 * This component provides UI to access that portal.
 */

"use client";

import { useState, useContext } from "react";
import { CreditCard, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { PaymentMethod } from "../../types/subscription";
import type { BillingLocalization } from "../../types/localization";

export interface PaymentMethodCardProps {
  data?: PaymentMethod;
  referenceId?: string;
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
}

const defaultPaymentLocalization = {
  paymentMethod: "Payment Method",
  managePaymentDescription: "Manage your payment methods and billing information",
  configuredInStripe: "Managed via Stripe",
  manageViaPortal: "Update payment methods in the billing portal",
  stripe: "Stripe",
  updatePaymentMethod: "Manage Payment Methods",
  noBillingPortal: "Billing portal not configured",
} as const;

export function PaymentMethodCard({
  data: paymentMethod,
  referenceId,
  className,
  classNames,
  localization,
  showActions = true,
  onBeforeManage,
}: PaymentMethodCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultPaymentLocalization, ...localization };
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
  const session = context?.hooks?.useSession?.()?.data;
  const actualReferenceId = referenceId || session?.user?.id;
  
  const handleManagePayment = async () => {
    if (!context?.authClient?.subscription?.billingPortal) {
      console.error("[PaymentMethodCard] Billing portal not available");
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
      console.error("Failed to manage payment:", error);
      context?.toast?.({
        variant: "error",
        message: "Failed to open billing portal"
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const formatCardBrand = (brand?: string) => {
    if (!brand) return "";
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const formatExpiry = (month?: number, year?: number) => {
    if (!month || !year) return "";
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
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
              {paymentMethod ? (
                <>
                  <p className="text-sm font-medium">
                    {formatCardBrand(paymentMethod.brand)} •••• {paymentMethod.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {paymentMethod.expiryMonth && paymentMethod.expiryYear
                      ? `Expires ${formatExpiry(paymentMethod.expiryMonth, paymentMethod.expiryYear)}`
                      : loc.manageViaPortal
                    }
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    {loc.configuredInStripe}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loc.manageViaPortal}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {loc.stripe}
            </Badge>
            {paymentMethod?.isDefault && (
              <Badge variant="default">Default</Badge>
            )}
          </div>
        </div>
      </CardContent>

      {showActions && context?.authClient?.subscription?.billingPortal && (
        <CardFooter className={classNames?.footer}>
          <Button
            onClick={handleManagePayment}
            disabled={isPortalLoading}
            className="w-full flex items-center gap-2"
          >
            {isPortalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {loc.updatePaymentMethod}
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

export function PaymentMethodCardError({ 
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
          Error Loading Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load payment method data"}
        </p>
      </CardContent>
    </Card>
  );
}
