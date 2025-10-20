/**
 * Usage Dashboard Component
 * Composed view of all usage tracking components with Convex real-time data
 */

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ApiUsageCard, ApiUsageCardSkeleton } from "./api-usage-card";
import { StorageUsageCard, StorageUsageCardSkeleton } from "./storage-usage-card";
import { FeatureAccessCard, FeatureAccessCardSkeleton } from "./feature-access-card";

export function UsageDashboard() {
  const router = useRouter();
  
  // Get current user session
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const activeOrg = organizations?.[0];
  
  // Fetch real-time usage data from Convex
  const usageData = useQuery(
    api.usage.getCurrentUsage,
    session?.user?.id
      ? {
          userId: session.user.id,
          organizationId: activeOrg?.id,
        }
      : "skip"
  );
  
  // Fetch feature access
  const featureAccess = useQuery(
    api.usage.getFeatureAccess,
    session?.user?.id
      ? {
          userId: session.user.id,
          organizationId: activeOrg?.id,
        }
      : "skip"
  );

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  // Show loading state
  if (!session || usageData === undefined || featureAccess === undefined) {
    return (
      <div className="space-y-6">
        <ApiUsageCardSkeleton />
        <StorageUsageCardSkeleton />
        <FeatureAccessCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Usage */}
      <ApiUsageCard
        current={usageData.apiCalls}
        limit={usageData.apiLimit}
        onUpgrade={handleUpgrade}
      />

      {/* Storage Usage */}
      <StorageUsageCard
        currentBytes={usageData.storageBytes}
        limitBytes={usageData.storageLimit}
        onUpgrade={handleUpgrade}
      />

      {/* Feature Access */}
      <FeatureAccessCard
        features={featureAccess}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
