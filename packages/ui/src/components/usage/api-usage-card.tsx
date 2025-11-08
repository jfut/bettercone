/**
 * API Usage Card Component
 * Real-time API call tracking
 * 
 * Three-Tier Pattern:
 * - Tier 1 (Self-Contained): Auto-fetches via AuthUIContext
 * - Tier 2 (Agnostic): Custom authClient prop
 * - Tier 3 (Presentational): Manual props (backward compatible)
 */

"use client";

import { useContext, useEffect, useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";

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
  /** 
   * Current usage count
   * Tier 3 (Presentational): Required if not using authClient or context
   */
  current?: number;
  
  /** 
   * Maximum allowed usage
   * Tier 3 (Presentational): Required if not using authClient or context
   */
  limit?: number;
  
  /**
   * Better Auth client instance
   * Tier 2 (Agnostic): Provide custom authClient with usageTracking plugin
   */
  authClient?: any; // ReturnType<typeof createAuthClient>
  
  /**
   * Organization ID - defaults to active organization
   * Used when fetching data via context or authClient
   */
  organizationId?: string;
  
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

/**
 * ApiUsageCard Component
 * 
 * Three-Tier Pattern:
 * 1. Self-Contained: <ApiUsageCard /> - Auto-fetches via AuthUIContext
 * 2. Agnostic: <ApiUsageCard authClient={custom} /> - Custom backend
 * 3. Presentational: <ApiUsageCard current={100} limit={1000} /> - Manual props
 * 
 * @example
 * // Tier 1: Self-Contained (Context-based)
 * <AuthUIProvider authClient={authClient}>
 *   <ApiUsageCard />
 * </AuthUIProvider>
 * 
 * @example
 * // Tier 2: Agnostic (Custom client)
 * <ApiUsageCard authClient={customAuthClient} />
 * 
 * @example
 * // Tier 3: Presentational (Manual props)
 * <ApiUsageCard current={8500} limit={10000} />
 */
export function ApiUsageCard({
  current: currentProp,
  limit: limitProp,
  authClient: authClientProp,
  organizationId,
  warningThreshold = 80,
  onUpgrade,
  className,
  classNames,
  localization: localizationProp,
}: ApiUsageCardProps) {
  const localization = { ...defaultLocalization, ...localizationProp };
  const context = useContext(AuthUIContext);
  
  // State for fetched data
  const [usageData, setUsageData] = useState<{ current?: number; limit?: number } | undefined>();
  const [isPending, setIsPending] = useState(false);
  
  // Determine which authClient to use (context or prop)
  const authClient = authClientProp || context?.authClient;
  
  // Tier 1 & 2: Fetch from authClient with plugin
  useEffect(() => {
    // Skip if manual props provided (Tier 3)
    if (currentProp !== undefined || limitProp !== undefined) {
      return;
    }
    
    // Skip if no authClient or no plugin
    if (!authClient || !(authClient as any).usageTracking) {
      return;
    }
    
    const fetchUsage = async () => {
      setIsPending(true);
      try {
        const plugin = (authClient as any).usageTracking;
        const data = await plugin.getUsage({ organizationId });
        
        setUsageData({
          current: data.api.current,
          limit: data.api.limit,
        });
      } catch (error) {
        console.error("Failed to fetch usage:", error);
        setUsageData(undefined);
      } finally {
        setIsPending(false);
      }
    };
    
    fetchUsage();
  }, [authClient, organizationId, currentProp, limitProp]);
  
  // Tier 3: Use manual props
  const finalData = (currentProp !== undefined || limitProp !== undefined)
    ? { current: currentProp, limit: limitProp }
    : usageData;
  
  // Show loading skeleton
  if (isPending) {
    return <ApiUsageCardSkeleton classNames={classNames} />;
  }
  
  // Extract final values
  const current = finalData?.current;
  const limit = finalData?.limit;
  
  // Show skeleton if no data
  if (current === undefined || limit === undefined) {
    return <ApiUsageCardSkeleton classNames={classNames} />;
  }
  
  // Render UI
  return (
    <ApiUsageCardUI
      current={current}
      limit={limit}
      warningThreshold={warningThreshold}
      onUpgrade={onUpgrade}
      className={className}
      classNames={classNames}
      localization={localization}
    />
  );
}

/**
 * ApiUsageCardUI - Pure presentational component
 * Separated for cleanliness and reusability
 */
function ApiUsageCardUI({
  current,
  limit,
  warningThreshold = 80,
  onUpgrade,
  className,
  classNames,
  localization,
}: {
  current: number;
  limit: number;
  warningThreshold?: number;
  onUpgrade?: () => void;
  className?: string;
  classNames?: ApiUsageCardClassNames;
  localization: ApiUsageCardLocalization;
}) {
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
