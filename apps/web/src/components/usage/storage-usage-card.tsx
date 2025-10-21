/**
 * Storage Usage Card Component
 * Real-time storage tracking with Convex
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, AlertTriangle } from "lucide-react";

interface StorageUsageCardProps {
  currentBytes: number | undefined;
  limitBytes: number | undefined;
  warningThreshold?: number;
  onUpgrade?: () => void;
}

export function StorageUsageCard({
  currentBytes,
  limitBytes,
  warningThreshold = 80,
  onUpgrade,
}: StorageUsageCardProps) {
  // Handle undefined states following Better Auth UI pattern
  if (currentBytes === undefined || limitBytes === undefined) {
    return <StorageUsageCardSkeleton />;
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
    <Card className={isNearLimit ? "border-destructive" : ""}>
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
            className={isNearLimit ? "[&>*]:bg-destructive" : isWarning ? "[&>*]:bg-orange-500" : ""}
          />
        </div>

        {/* Storage Breakdown (optional - can be expanded) */}
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
              <Button onClick={onUpgrade} size="sm" variant={isNearLimit ? "destructive" : "default"} className="w-full">
                Upgrade Storage
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton
export function StorageUsageCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
