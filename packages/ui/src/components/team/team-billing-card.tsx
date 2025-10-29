/**
 * Team Billing Card Component
 * Displays organization-level billing summary
 * Backend-agnostic - accepts subscription and organization data as props
 */

"use client";

import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import type { BetterAuthSubscription, BetterAuthOrganization } from "../../types/auth";

export interface TeamBillingCardProps {
  /** Organization data */
  organization: BetterAuthOrganization | undefined;
  
  /** Subscription data for the organization */
  subscription: BetterAuthSubscription | undefined;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Callback when manage billing is clicked */
  onManageBilling?: () => void;
  
  /** Callback when change plan is clicked */
  onChangePlan?: () => void;
}

export function TeamBillingCard({ 
  organization,
  subscription,
  className,
  onManageBilling,
  onChangePlan,
}: TeamBillingCardProps) {
  // Show skeleton while loading
  if (!organization) {
    return <TeamBillingCardSkeleton className={className} />;
  }

  const planName = subscription?.planId || "Free";
  const nextBillingDate = subscription?.currentPeriodEnd 
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : "N/A";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Billing</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {organization.name}
          </Badge>
        </div>
        <CardDescription>
          Billing overview for your organization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-2xl font-bold capitalize">{planName}</p>
            </div>
          </div>

          {/* Next Billing Date */}
          {subscription && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next billing: {nextBillingDate}</span>
            </div>
          )}
        </div>

        {subscription && (
          <>
            <Separator />

            {/* Subscription Details */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Subscription Details</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{subscription.status}</span>
                </div>
                {subscription.cancelAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cancellation</span>
                    <span className="font-medium text-destructive">Cancels at period end</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Estimated Cost Summary */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Subscription Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Manage your subscription in the billing portal
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onManageBilling && (
            <Button 
              onClick={onManageBilling}
              className="flex-1"
              variant="default"
            >
              Manage Billing
            </Button>
          )}
          
          {onChangePlan && (
            <Button 
              onClick={onChangePlan}
              variant="outline"
              className="flex-1"
            >
              Change Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
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

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
