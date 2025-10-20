/**
 * Team Dashboard Component
 * Composed view of team management components for B2B SaaS
 */

"use client";

import { SeatAllocationCard, SeatAllocationCardSkeleton } from "./seat-allocation-card";
import { TeamBillingCard, TeamBillingCardSkeleton } from "./team-billing-card";
import { authClient } from "@/lib/auth-client";

export interface TeamDashboardProps {
  /** Custom className for the container */
  className?: string;
  /** Show member list in seat allocation card */
  showMemberList?: boolean;
  /** Callback for upgrade actions */
  onUpgrade?: () => void;
  /** Callback for manage billing actions */
  onManageBilling?: () => void;
}

export function TeamDashboard({
  className,
  showMemberList = true,
  onUpgrade,
  onManageBilling
}: TeamDashboardProps) {
  // Check if user has an active organization by deriving from list
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];
  
  // Show loading state while organizations are being fetched
  if (orgsPending) {
    return (
      <div className={className}>
        <div className="grid gap-6 md:grid-cols-2">
          <SeatAllocationCardSkeleton />
          <TeamBillingCardSkeleton />
        </div>
      </div>
    );
  }

  // If no active organization, show message
  if (!activeOrg) {
    return (
      <div className={className}>
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
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2">
        <SeatAllocationCard 
          showMemberList={showMemberList}
          onUpgrade={onUpgrade}
        />
        
        <TeamBillingCard 
          onManageBilling={onManageBilling}
        />
      </div>
    </div>
  );
}
