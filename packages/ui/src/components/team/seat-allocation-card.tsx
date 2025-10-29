/**
 * Seat Allocation Card Component
 * Displays team seat usage with real-time tracking
 * Backend-agnostic - accepts seat data as props
 */

"use client";

import { Users, Plus, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress } from "../progress";
import { Button } from "../button";
import { Badge } from "../badge";
import { Skeleton } from "../skeleton";

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
  /** Seat allocation data */
  data: SeatAllocationData | undefined;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Callback when upgrade button is clicked */
  onUpgrade?: () => void;
  
  /** Callback when invite member button is clicked */
  onInviteMember?: () => void;
  
  /** Warning threshold percentage (default 80) */
  warningThreshold?: number;
  
  /** Show member list */
  showMemberList?: boolean;
}

export function SeatAllocationCard({ 
  data,
  className,
  onUpgrade,
  onInviteMember,
  warningThreshold = 80,
  showMemberList = false
}: SeatAllocationCardProps) {
  // Show skeleton while loading
  if (!data) {
    return <SeatAllocationCardSkeleton className={className} />;
  }

  const { usedSeats, totalSeats, planName = "Basic", members = [] } = data;
  
  const usagePercentage = (usedSeats / totalSeats) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isCritical = usagePercentage >= 90;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Seats</CardTitle>
          </div>
          <Badge 
            variant={isCritical ? "destructive" : "default"} 
            className={cn(
              isWarning && !isCritical && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
            )}
          >
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
            className={cn(
              "h-2",
              isCritical && "bg-destructive/20",
              isWarning && !isCritical && "bg-warning/20"
            )}
          />
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div className={cn(
            "flex items-start gap-2 rounded-lg border p-3 text-sm",
            isCritical 
              ? "border-destructive/50 bg-destructive/10 text-destructive" 
              : "border-warning/50 bg-warning/10 text-warning"
          )}>
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
        {showMemberList && members.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Team Members</p>
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
                      <p className="font-medium truncate">{member.name || "No name"}</p>
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {usedSeats < totalSeats && onInviteMember ? (
            <Button 
              onClick={onInviteMember}
              className="flex-1"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          ) : onUpgrade ? (
            <Button 
              onClick={onUpgrade}
              className="flex-1"
              variant="default"
            >
              Upgrade Plan
            </Button>
          ) : null}
          
          {!isCritical && onUpgrade && (
            <Button 
              onClick={onUpgrade}
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
