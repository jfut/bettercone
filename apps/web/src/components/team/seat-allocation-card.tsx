/**
 * Seat Allocation Card Component
 * Displays team seat usage with real-time tracking from better-auth organizations
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Plus, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export interface SeatAllocationData {
  usedSeats: number;
  totalSeats: number;
  planName: string;
  membersList?: Array<{ id: string; name: string; email: string }>;
}

export interface SeatAllocationCardProps {
  /** Custom className for the card */
  className?: string;
  /** Callback when upgrade button is clicked */
  onUpgrade?: () => void;
  /** Warning threshold percentage (default 80) */
  warningThreshold?: number;
  /** Show member list */
  showMemberList?: boolean;
}

export function SeatAllocationCard({ 
  className,
  onUpgrade,
  warningThreshold = 80,
  showMemberList = false
}: SeatAllocationCardProps) {
  const router = useRouter();
  
  // Get organization data from better-auth
  const { data: organizations, isPending: orgsPending } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];
  const { data: members, isPending: membersPending } = authClient.organization.useListOrganizationMembers({
    organizationId: activeOrg?.id
  });
  
  // Show skeleton while loading
  if (orgsPending || membersPending || !activeOrg) {
    return <SeatAllocationCardSkeleton />;
  }

  // Calculate seat usage from organization members
  // Note: Better Auth organization members includes the owner
  // If members array is empty, count at least 1 (the owner/creator)
  const usedSeats = members?.length || 1;
  
  // Default to 5 seats for basic plan (could be fetched from subscription data)
  const totalSeats = activeOrg.metadata?.seatLimit as number || 5;
  
  const planName = activeOrg.metadata?.planName as string || "Basic";
  const usagePercentage = (usedSeats / totalSeats) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isCritical = usagePercentage >= 90;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push("/demo/pricing");
    }
  };

  const handleInviteMember = () => {
    router.push("/demo/organization/members");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Seats</CardTitle>
          </div>
          <Badge variant={isCritical ? "destructive" : "default"} className={isWarning && !isCritical ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" : ""}>
            {planName}
          </Badge>
        </div>
        <CardDescription>
          Manage your team member allocation
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seat Usage Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seats Used</span>
            <span className="font-medium">
              {usedSeats} / {totalSeats}
            </span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${isCritical ? "bg-destructive/20" : isWarning ? "bg-warning/20" : ""}`}
          />
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
            isCritical 
              ? "border-destructive/50 bg-destructive/10 text-destructive" 
              : "border-warning/50 bg-warning/10 text-warning"
          }`}>
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">
                {isCritical ? "Critical: Seat limit reached" : "Warning: Running out of seats"}
              </p>
              <p className="text-xs opacity-90">
                {isCritical 
                  ? "You've used all available seats. Upgrade to add more team members."
                  : `You're using ${Math.round(usagePercentage)}% of your seats. Consider upgrading soon.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Member List (Optional) */}
        {showMemberList && members && members.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Team Members</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {members.map((member: any) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {member.user.name?.[0]?.toUpperCase() || member.user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{member.user.name || "No name"}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {usedSeats < totalSeats ? (
            <Button 
              onClick={handleInviteMember}
              className="flex-1"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          ) : (
            <Button 
              onClick={handleUpgrade}
              className="flex-1"
              variant="default"
            >
              Upgrade Plan
            </Button>
          )}
          
          {!isCritical && (
            <Button 
              onClick={handleUpgrade}
              variant="outline"
              className="flex-1"
            >
              View Plans
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SeatAllocationCardSkeleton() {
  return (
    <Card>
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
