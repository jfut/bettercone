/**
 * Usage Dashboard Component
 * Composed view of all usage tracking components
 */

"use client";

import { cn } from "../../lib/utils";
import { ApiUsageCard, ApiUsageCardProps, ApiUsageCardSkeleton } from "./api-usage-card";
import { StorageUsageCard, StorageUsageCardProps, StorageUsageCardSkeleton } from "./storage-usage-card";
import { FeatureAccessCard, FeatureAccessCardProps, FeatureAccessCardSkeleton, type FeatureAccess } from "./feature-access-card";

export interface UsageDashboardProps {
  /** API usage data */
  apiUsage?: {
    current: number;
    limit: number;
  };
  /** Storage usage data */
  storageUsage?: {
    currentBytes: number;
    limitBytes: number;
  };
  /** Feature access data */
  featureAccess?: FeatureAccess;
  /** Custom className for the container */
  className?: string;
  /** Custom classNames for individual elements */
  classNames?: {
    container?: string;
    apiCard?: string;
    storageCard?: string;
    featureCard?: string;
  };
  /** Layout type: grid or stack */
  layout?: "grid" | "stack";
  /** Loading state */
  isLoading?: boolean;
  /** Props to pass to ApiUsageCard */
  apiUsageCardProps?: Omit<ApiUsageCardProps, "current" | "limit">;
  /** Props to pass to StorageUsageCard */
  storageUsageCardProps?: Omit<StorageUsageCardProps, "currentBytes" | "limitBytes">;
  /** Props to pass to FeatureAccessCard */
  featureAccessCardProps?: Omit<FeatureAccessCardProps, "features">;
}

/**
 * UsageDashboard - Composition of usage tracking components
 * 
 * Combines API usage, storage usage, and feature access cards
 * into a unified usage dashboard view.
 * 
 * @example
 * ```tsx
 * <UsageDashboard
 *   apiUsage={{ current: 8500, limit: 10000 }}
 *   storageUsage={{ currentBytes: 4500000000, limitBytes: 5000000000 }}
 *   featureAccess={{
 *     planId: "pro",
 *     advancedAnalytics: true,
 *     apiAccess: true,
 *     customIntegrations: false
 *   }}
 *   apiUsageCardProps={{
 *     onUpgrade: () => router.push("/pricing")
 *   }}
 * />
 * ```
 */
export function UsageDashboard({
  apiUsage,
  storageUsage,
  featureAccess,
  className,
  classNames,
  layout = "stack",
  isLoading = false,
  apiUsageCardProps,
  storageUsageCardProps,
  featureAccessCardProps,
}: UsageDashboardProps) {
  const isGrid = layout === "grid";

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className, classNames?.container)}>
        <ApiUsageCardSkeleton />
        <StorageUsageCardSkeleton />
        <FeatureAccessCardSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        isGrid ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-6",
        className,
        classNames?.container
      )}
    >
      {/* API Usage */}
      {apiUsage && (
        <ApiUsageCard
          current={apiUsage.current}
          limit={apiUsage.limit}
          className={classNames?.apiCard}
          {...apiUsageCardProps}
        />
      )}

      {/* Storage Usage */}
      {storageUsage && (
        <StorageUsageCard
          currentBytes={storageUsage.currentBytes}
          limitBytes={storageUsage.limitBytes}
          className={classNames?.storageCard}
          {...storageUsageCardProps}
        />
      )}

      {/* Feature Access */}
      {featureAccess && (
        <FeatureAccessCard
          features={featureAccess}
          className={classNames?.featureCard}
          {...featureAccessCardProps}
        />
      )}
    </div>
  );
}

/**
 * Loading skeleton for UsageDashboard
 */
export function UsageDashboardSkeleton({
  className,
  layout = "stack",
}: {
  className?: string;
  layout?: "grid" | "stack";
}) {
  const isGrid = layout === "grid";

  return (
    <div
      className={cn(
        isGrid ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-6",
        className
      )}
    >
      <ApiUsageCardSkeleton />
      <StorageUsageCardSkeleton />
      <FeatureAccessCardSkeleton />
    </div>
  );
}
