/**
 * API Usage Card Component
 * Real-time API call tracking with Convex
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle } from "lucide-react";
import type { UsageCardProps } from "./types";

export function ApiUsageCard({
  current,
  limit,
  warningThreshold = 80,
  onUpgrade,
}: Omit<UsageCardProps, "title" | "icon" | "description" | "unit">) {
  // Handle undefined states following Better Auth UI pattern
  if (current === undefined || limit === undefined) {
    return <ApiUsageCardSkeleton />;
  }

  const usagePercentage = (current / limit) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isNearLimit = usagePercentage >= 90;

  return (
    <Card className={isNearLimit ? "border-destructive" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>API Calls</CardTitle>
          </div>
          <Badge variant={isNearLimit ? "destructive" : isWarning ? "secondary" : "default"}>
            {Math.round(usagePercentage)}%
          </Badge>
        </div>
        <CardDescription>Monthly API calls usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Numbers */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {current.toLocaleString()} / {limit.toLocaleString()} calls
          </span>
          {isWarning && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-medium">High Usage</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Progress
          value={usagePercentage}
          className={isNearLimit ? "[&>*]:bg-destructive" : isWarning ? "[&>*]:bg-orange-500" : ""}
        />

        {/* Warning Message */}
        {isWarning && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              {isNearLimit 
                ? "You're approaching your API limit. Upgrade to avoid service interruption."
                : "You're using more than 80% of your monthly API calls."
              }
            </p>
            {onUpgrade && (
              <Button onClick={onUpgrade} size="sm" variant={isNearLimit ? "destructive" : "default"} className="w-full">
                Upgrade Plan
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton
export function ApiUsageCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-2 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
