/**
 * Team Dashboard Component
 * Composed view of team management components for B2B SaaS
 */

"use client";

import { cn } from "../../lib/utils";
import { SeatAllocationCard, SeatAllocationCardProps, SeatAllocationCardSkeleton } from "./seat-allocation-card";
import { TeamBillingCard, TeamBillingCardProps, TeamBillingCardSkeleton } from "./team-billing-card";
import type { BetterAuthOrganization, BetterAuthSubscription } from "../../types/auth";

export interface TeamDashboardProps {
  /** Organization data */
  organization?: BetterAuthOrganization;
  /** Subscription data */
  subscription?: BetterAuthSubscription;
  /** Seat allocation data */
  seatAllocation?: SeatAllocationCardProps["data"];
  /** Custom className for the container */
  className?: string;
  /** Custom classNames for individual elements */
  classNames?: {
    container?: string;
    grid?: string;
    seatCard?: string;
    billingCard?: string;
  };
  /** Layout type: grid or stack */
  layout?: "grid" | "stack";
  /** Loading state */
  isLoading?: boolean;
  /** Show member list in seat allocation card */
  showMemberList?: boolean;
  /** Props to pass to SeatAllocationCard */
  seatAllocationCardProps?: Omit<SeatAllocationCardProps, "data">;
  /** Props to pass to TeamBillingCard */
  teamBillingCardProps?: Omit<TeamBillingCardProps, "organization" | "subscription">;
}

/**
 * TeamDashboard - Composition of team management components
 * 
 * Combines seat allocation and team billing cards into a unified
 * team management dashboard view for B2B SaaS applications.
 * 
 * @example
 * ```tsx
 * <TeamDashboard
 *   organization={activeOrg}
 *   subscription={orgSubscription}
 *   seatAllocation={{
 *     usedSeats: 8,
 *     totalSeats: 10,
 *     planName: "Team",
 *     members: teamMembers
 *   }}
 *   seatAllocationCardProps={{
 *     onUpgrade: () => router.push("/pricing"),
 *     onInviteMember: () => setInviteDialogOpen(true)
 *   }}
 *   teamBillingCardProps={{
 *     onManageBilling: handleManageBilling,
 *     onChangePlan: () => router.push("/pricing")
 *   }}
 * />
 * ```
 */
export function TeamDashboard({
  organization,
  subscription,
  seatAllocation,
  className,
  classNames,
  layout = "grid",
  isLoading = false,
  showMemberList = true,
  seatAllocationCardProps,
  teamBillingCardProps,
}: TeamDashboardProps) {
  const isGrid = layout === "grid";

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className, classNames?.container)}>
        <div className={cn(isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6", classNames?.grid)}>
          <SeatAllocationCardSkeleton />
          <TeamBillingCardSkeleton />
        </div>
      </div>
    );
  }

  // If no organization, show message
  if (!organization) {
    return (
      <div className={cn("space-y-6", className, classNames?.container)}>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Active Organization</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You need to create or select an organization to view team management features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className, classNames?.container)}>
      <div className={cn(isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6", classNames?.grid)}>
        {/* Seat Allocation Card */}
        {seatAllocation && (
          <SeatAllocationCard
            data={seatAllocation}
            showMemberList={showMemberList}
            className={classNames?.seatCard}
            {...seatAllocationCardProps}
          />
        )}

        {/* Team Billing Card */}
        <TeamBillingCard
          organizationId={organization?.id}
          className={classNames?.billingCard}
          {...teamBillingCardProps}
        />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for TeamDashboard
 */
export function TeamDashboardSkeleton({
  className,
  layout = "grid",
}: {
  className?: string;
  layout?: "grid" | "stack";
}) {
  const isGrid = layout === "grid";

  return (
    <div className={cn("space-y-6", className)}>
      <div className={cn(isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6")}>
        <SeatAllocationCardSkeleton />
        <TeamBillingCardSkeleton />
      </div>
    </div>
  );
}
