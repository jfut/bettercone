/**
 * Usage Dashboard Component
 * Composed view of all usage tracking components
 * 
 * Three-Tier Pattern:
 * - Tier 1 (Self-Contained): Auto-fetches all cards via AuthUIContext
 * - Tier 2 (Agnostic): Custom authClient cascades to all cards
 * - Tier 3 (Presentational): Manual props for each card (backward compatible)
 * 
 * NOTE: StorageUsageCard removed - cannot be Better Auth compliant
 */

"use client";

import { cn } from "../../lib/utils";
import { ApiUsageCard, ApiUsageCardProps, ApiUsageCardSkeleton } from "./api-usage-card";
import { FeatureAccessCard, FeatureAccessCardProps, FeatureAccessCardSkeleton, type FeatureAccess } from "./feature-access-card";

export interface UsageDashboardProps {
  /** 
   * API usage data (Tier 3 - Presentational)
   * Optional - will auto-fetch if not provided
   */
  apiUsage?: {
    current: number;
    limit: number;
  };
  
  /** 
   * Feature access data (Tier 3 - Presentational)
   * Optional - will auto-fetch if not provided
   */
  featureAccess?: FeatureAccess;
  
  /**
   * Better Auth client instance (Tier 2 - Agnostic)
   * Pass custom authClient with usageTracking plugin
   * Cascades to all child cards
   */
  authClient?: any;
  
  /**
   * Organization ID
   * Used for fetching specific organization data
   */
  organizationId?: string;
  
  /** Custom className for the container */
  className?: string;
  
  /** Custom classNames for individual elements */
  classNames?: {
    container?: string;
    apiCard?: string;
    featureCard?: string;
  };
  
  /** Layout type: grid or stack */
  layout?: "grid" | "stack";
  
  /** Loading state override */
  isLoading?: boolean;
  
  /** Props to pass to ApiUsageCard */
  apiUsageCardProps?: Omit<ApiUsageCardProps, "current" | "limit" | "authClient" | "organizationId">;
  
  /** Props to pass to FeatureAccessCard */
  featureAccessCardProps?: Omit<FeatureAccessCardProps, "features" | "authClient" | "organizationId">;
}

/**
 * UsageDashboard - Composition of usage tracking components
 * 
 * Three-Tier Pattern:
 * 1. Self-Contained: <UsageDashboard /> - Auto-fetches all cards via context
 * 2. Agnostic: <UsageDashboard authClient={custom} /> - Custom backend
 * 3. Presentational: <UsageDashboard apiUsage={...} featureAccess={...} /> - Manual props
 * 
 * Can also mix tiers - some auto-fetched, some manual
 * 
 * NOTE: StorageUsageCard removed - cannot be Better Auth compliant
 * 
 * @example
 * // Tier 1: Self-Contained (all cards auto-fetch)
 * <AuthUIProvider authClient={authClient}>
 *   <UsageDashboard />
 * </AuthUIProvider>
 * 
 * @example
 * // Tier 2: Agnostic (custom backend)
 * <UsageDashboard authClient={customAuthClient} />
 * 
 * @example
 * // Tier 3: Presentational (manual props)
 * <UsageDashboard
 *   apiUsage={{ current: 8500, limit: 10000 }}
 *   featureAccess={{
 *     planId: "pro",
 *     advancedAnalytics: true,
 *     apiAccess: true
 *   }}
 * />
 */
export function UsageDashboard({
  apiUsage,
  featureAccess,
  authClient: authClientProp,
  organizationId,
  className,
  classNames,
  layout = "stack",
  isLoading = false,
  apiUsageCardProps,
  featureAccessCardProps,
}: UsageDashboardProps) {
  const isGrid = layout === "grid";

  // Show loading state
  if (isLoading) {
    return (
      <UsageDashboardSkeleton 
        className={cn(className, classNames?.container)} 
        layout={layout}
      />
    );
  }

  return (
    <div
      className={cn(
        isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6",
        className,
        classNames?.container
      )}
    >
      {/* Each card handles its own three-tier logic */}
      <ApiUsageCard
        current={apiUsage?.current}
        limit={apiUsage?.limit}
        authClient={authClientProp}
        organizationId={organizationId}
        className={classNames?.apiCard}
        {...apiUsageCardProps}
      />

      <FeatureAccessCard
        features={featureAccess}
        authClient={authClientProp}
        organizationId={organizationId}
        className={classNames?.featureCard}
        {...featureAccessCardProps}
      />
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
        isGrid ? "grid gap-6 md:grid-cols-2" : "space-y-6",
        className
      )}
    >
      <ApiUsageCardSkeleton />
      <FeatureAccessCardSkeleton />
    </div>
  );
}
