/**
 * API Usage Card Component
 * Real-time API call tracking
 * Backend-agnostic - accepts usage data as props
 */

"use client";

import { TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress } from "../progress";
import { Badge } from "../badge";
import { Button } from "../button";
import { Skeleton } from "../skeleton";

export interface ApiUsageCardClassNames {
  base?: string;
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  icon?: string;
  badge?: string;
  warning?: string;
  progress?: string;
  footer?: string;
  button?: string;
  skeleton?: string;
}

export interface ApiUsageCardLocalization {
  API_CALLS: string;
  API_CALLS_DESCRIPTION: string;
  CALLS: string;
  HIGH_USAGE: string;
  APPROACHING_LIMIT: string;
  ABOVE_THRESHOLD: string;
  UPGRADE_PLAN: string;
}

const defaultLocalization: ApiUsageCardLocalization = {
  API_CALLS: "API Calls",
  API_CALLS_DESCRIPTION: "Monitor your API usage and limits",
  CALLS: "calls",
  HIGH_USAGE: "High usage",
  APPROACHING_LIMIT: "You're approaching your API call limit. Consider upgrading your plan.",
  ABOVE_THRESHOLD: "Your usage is above normal levels. Monitor closely to avoid hitting limits.",
  UPGRADE_PLAN: "Upgrade Plan",
};

export interface ApiUsageCardProps {
  /** Current usage count */
  current: number | undefined;
  
  /** Maximum allowed usage */
  limit: number | undefined;
  
  /** Percentage threshold to show warning (default: 80) */
  warningThreshold?: number;
  
  /** Callback when upgrade button is clicked */
  onUpgrade?: () => void;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: ApiUsageCardClassNames;
  
  /** Localization strings */
  localization?: Partial<ApiUsageCardLocalization>;
}

export function ApiUsageCard({
  current,
  limit,
  warningThreshold = 80,
  onUpgrade,
  className,
  classNames,
  localization: localizationProp,
}: ApiUsageCardProps) {
  const localization = { ...defaultLocalization, ...localizationProp };

  // Handle undefined states
  if (current === undefined || limit === undefined) {
    return <ApiUsageCardSkeleton classNames={classNames} />;
  }

  const usagePercentage = (current / limit) * 100;
  const isWarning = usagePercentage >= warningThreshold;
  const isNearLimit = usagePercentage >= 90;

  return (
    <Card className={cn(
      "w-full",
      isNearLimit && "border-destructive",
      className,
      classNames?.base
    )}>
      <CardHeader className={cn(classNames?.header)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("h-5 w-5 text-primary", classNames?.icon)} />
            <CardTitle className={cn(classNames?.title)}>
              {localization.API_CALLS}
            </CardTitle>
          </div>
          <Badge 
            variant={isNearLimit ? "destructive" : isWarning ? "secondary" : "default"}
            className={cn(classNames?.badge)}
          >
            {Math.round(usagePercentage)}%
          </Badge>
        </div>
        <CardDescription className={cn(classNames?.description)}>
          {localization.API_CALLS_DESCRIPTION}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-4", classNames?.content)}>
        {/* Usage Numbers */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {current.toLocaleString()} / {limit.toLocaleString()} {localization.CALLS}
          </span>
          {isWarning && (
            <div className={cn("flex items-center gap-1 text-orange-600", classNames?.warning)}>
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-medium">{localization.HIGH_USAGE}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Progress
          value={usagePercentage}
          className={cn(
            isNearLimit && "[&>*]:bg-destructive",
            isWarning && !isNearLimit && "[&>*]:bg-orange-500",
            classNames?.progress
          )}
        />

        {/* Warning Message */}
        {isWarning && (
          <div className={cn("pt-2 border-t", classNames?.footer)}>
            <p className="text-sm text-muted-foreground mb-3">
              {isNearLimit 
                ? localization.APPROACHING_LIMIT
                : localization.ABOVE_THRESHOLD
              }
            </p>
            {onUpgrade && (
              <Button 
                onClick={onUpgrade} 
                size="sm" 
                variant={isNearLimit ? "destructive" : "default"} 
                className={cn("w-full", classNames?.button)}
              >
                {localization.UPGRADE_PLAN}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ApiUsageCardSkeleton({ 
  classNames 
}: { 
  classNames?: ApiUsageCardClassNames 
}) {
  return (
    <Card className={cn("w-full", classNames?.base)}>
      <CardHeader className={cn(classNames?.header)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className={cn("h-5 w-5", classNames?.skeleton)} />
            <Skeleton className={cn("h-5 w-24", classNames?.skeleton)} />
          </div>
          <Skeleton className={cn("h-5 w-12", classNames?.skeleton)} />
        </div>
        <Skeleton className={cn("h-4 w-full mt-2", classNames?.skeleton)} />
      </CardHeader>
      <CardContent className={cn("space-y-4", classNames?.content)}>
        <Skeleton className={cn("h-4 w-full", classNames?.skeleton)} />
        <Skeleton className={cn("h-2 w-full", classNames?.skeleton)} />
      </CardContent>
    </Card>
  );
}
