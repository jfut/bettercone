/**
 * Storage Usage Card Component
 * Real-time storage tracking
 * Backend-agnostic - accepts usage data as props
 */

"use client";

import { Database, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress } from "../progress";
import { Badge } from "../badge";
import { Button } from "../button";
import { Skeleton } from "../skeleton";

export interface StorageUsageCardProps {
  /** Current storage usage in bytes */
  currentBytes: number | undefined;
  
  /** Maximum storage limit in bytes */
  limitBytes: number | undefined;
  
  /** Percentage threshold to show warning (default: 80) */
  warningThreshold?: number;
  
  /** Callback when upgrade button is clicked */
  onUpgrade?: () => void;
  
  /** Optional CSS class name */
  className?: string;
}

export function StorageUsageCard({
  currentBytes,
  limitBytes,
  warningThreshold = 80,
  onUpgrade,
  className,
}: StorageUsageCardProps) {
  // Handle undefined states
  if (currentBytes === undefined || limitBytes === undefined) {
    return <StorageUsageCardSkeleton className={className} />;
  }

  const usagePercentage = (currentBytes / limitBytes) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isNearLimit = usagePercentage >= 90;

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <Card className={cn(
      "w-full",
      isNearLimit && "border-destructive",
      className
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Storage</CardTitle>
          </div>
          <Badge variant={isNearLimit ? "destructive" : isWarning ? "secondary" : "outline"}>
            {formatBytes(currentBytes)} / {formatBytes(limitBytes)}
          </Badge>
        </div>
        <CardDescription>Data storage consumption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {Math.round(usagePercentage)}% used
            </span>
            {isWarning && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs font-medium">High Usage</span>
              </div>
            )}
          </div>
          <Progress
            value={usagePercentage}
            className={cn(
              isNearLimit && "[&>*]:bg-destructive",
              isWarning && !isNearLimit && "[&>*]:bg-orange-500"
            )}
          />
        </div>

        {/* Storage Breakdown */}
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Available</span>
            <span>{formatBytes(limitBytes - currentBytes)}</span>
          </div>
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              {isNearLimit 
                ? "You're running out of storage space. Upgrade to get more storage."
                : "You're using more than 80% of your storage."
              }
            </p>
            {onUpgrade && (
              <Button 
                onClick={onUpgrade} 
                size="sm" 
                variant={isNearLimit ? "destructive" : "default"} 
                className="w-full"
              >
                Upgrade Storage
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StorageUsageCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
