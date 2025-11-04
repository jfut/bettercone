/**
 * Seat Allocation Card Component
 * Displays team seat usage with auto-fetch capability
 * 
 * Can auto-fetch seat data from Better Auth Stripe subscription or display
 * seat data passed via props.
 */

"use client";

import { useState, useEffect, useContext } from "react";
import { Users, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { Subscription } from "../../types/subscription";
import type { BillingLocalization } from "../../types/localization";

export interface TeamMember {
  id: string;
  name?: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface SeatAllocationData {
  usedSeats: number;
  totalSeats: number;
  planName?: string;
  members?: TeamMember[];
}

export interface SeatAllocationCardProps {
  data?: SeatAllocationData;
  organizationId?: string;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  localization?: Partial<BillingLocalization>;
  warningThreshold?: number;
  showMemberList?: boolean;
  showActions?: boolean;
  onUpgrade?: () => Promise<void> | void;
  onInviteMember?: () => Promise<void> | void;
}

const defaultSeatLocalization = {
  teamSeats: "Team Seats",
  manageTeamAllocation: "Manage your team member allocation",
  seatsUsed: "Seats Used",
  criticalSeatLimit: "Critical: Seat limit reached",
  warningSeatLimit: "Warning: Running out of seats",
  criticalSeatMessage: "You've used all available seats. Upgrade to add more team members.",
  warningSeatMessage: "You're using {percentage}% of your seats. Consider upgrading soon.",
  teamMembers: "Team Members",
  noName: "No name",
  inviteMember: "Invite Member",
  upgradePlan: "Upgrade Plan",
  viewPlans: "View Plans",
} as const;

// Auto-fetch component (uses AuthUIContext and subscription.list())
function SeatAllocationCardAutoFetch({
  organizationId,
  className,
  classNames,
  localization,
  warningThreshold,
  showMemberList,
  showActions,
  onUpgrade,
  onInviteMember,
}: SeatAllocationCardProps) {
  const context = useContext(AuthUIContext);
  const loc = { ...defaultSeatLocalization, ...localization };
  const [seatData, setSeatData] = useState<SeatAllocationData | null | undefined>(undefined);
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
          setSeatData(null);
        } else {
          const subscription = data?.find(
            (sub: Subscription) => sub.status === "active" || sub.status === "trialing"
          ) || data?.[0];

          if (subscription) {
            // Note: Better Auth Stripe plugin stores total seats in subscription.seats
            // usedSeats would need to come from organization members count
            setSeatData({
              usedSeats: 0, // Would need to fetch from organization members API
              totalSeats: subscription.seats || 1,
              planName: subscription.plan,
              members: undefined, // Members would come from org API
            });
          } else {
            setSeatData(null);
          }
          setError(null);
        }
      })
      .catch((err) => {
        setError(err);
        setSeatData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [actualOrgId, context?.authClient]);

  if (isLoading) {
    return <SeatAllocationCardSkeleton className={cn(className, classNames?.base)} />;
  }

  if (error) {
    return <SeatAllocationCardError error={error} className={cn(className, classNames?.base)} />;
  }

  return (
    <SeatAllocationCardPresentational
      data={seatData || undefined}
      organizationId={actualOrgId}
      className={className}
      classNames={classNames}
      localization={localization}
      warningThreshold={warningThreshold}
      showMemberList={showMemberList}
      showActions={showActions}
      onUpgrade={onUpgrade}
      onInviteMember={onInviteMember}
    />
  );
}

// Presentational component (displays seat data)
function SeatAllocationCardPresentational({
  data,
  className,
  classNames,
  localization,
  warningThreshold = 80,
  showMemberList = false,
  showActions = true,
  onUpgrade,
  onInviteMember,
}: SeatAllocationCardProps) {
  const loc = { ...defaultSeatLocalization, ...localization };

  // Show skeleton if no data
  if (!data) {
    return <SeatAllocationCardSkeleton className={cn(className, classNames?.base)} />;
  }

  const { usedSeats, totalSeats, planName = "Basic", members = [] } = data;

  const usagePercentage = (usedSeats / totalSeats) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isCritical = usagePercentage >= 90;

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{loc.teamSeats}</CardTitle>
          </div>
          <Badge
            variant={isCritical ? "destructive" : "default"}
            className={cn(
              isWarning &&
                !isCritical &&
                "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
            )}
          >
            {planName}
          </Badge>
        </div>
        <CardDescription>{loc.manageTeamAllocation}</CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-4", classNames?.content)}>
        {/* Seat Usage Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{loc.seatsUsed}</span>
            <span className="font-medium">
              {usedSeats} / {totalSeats}
            </span>
          </div>

          <Progress
            value={usagePercentage}
            className={cn(
              "h-2",
              isCritical && "bg-destructive/20",
              isWarning && !isCritical && "bg-warning/20"
            )}
          />
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-sm",
              isCritical
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : "border-warning/50 bg-warning/10 text-warning"
            )}
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">
                {isCritical ? loc.criticalSeatLimit : loc.warningSeatLimit}
              </p>
              <p className="text-xs opacity-90">
                {isCritical
                  ? loc.criticalSeatMessage
                  : loc.warningSeatMessage.replace("{percentage}", Math.round(usagePercentage).toString())}
              </p>
            </div>
          </div>
        )}

        {/* Member List (Optional) */}
        {showMemberList && members.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{loc.teamMembers}</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{member.name || loc.noName}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                  {member.role && (
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {member.role}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className={cn("flex gap-2", classNames?.footer)}>
          {usedSeats < totalSeats && onInviteMember ? (
            <Button onClick={onInviteMember} className="flex-1" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              {loc.inviteMember}
            </Button>
          ) : onUpgrade ? (
            <Button onClick={onUpgrade} className="flex-1" variant="default">
              {loc.upgradePlan}
            </Button>
          ) : null}

          {!isCritical && onUpgrade && (
            <Button onClick={onUpgrade} variant="outline" className="flex-1">
              {loc.viewPlans}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// Main component with auto-detection
export function SeatAllocationCard(props: SeatAllocationCardProps) {
  const context = useContext(AuthUIContext);

  // Mode A: Auto-fetch if authClient.subscription.list is available and no data prop
  const hasSubscriptionAPI = context?.authClient?.subscription?.list;

  if (!props.data && hasSubscriptionAPI) {
    return <SeatAllocationCardAutoFetch {...props} />;
  }

  // Mode C: Presentational (data provided via props or no auto-fetch available)
  return <SeatAllocationCardPresentational {...props} />;
}

export function SeatAllocationCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SeatAllocationCardError({
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
          <AlertTriangle className="h-5 w-5" />
          Error Loading Seat Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message || error?.message || "Failed to load seat allocation data"}
        </p>
      </CardContent>
    </Card>
  );
}
