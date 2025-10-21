/**
 * Usage Component Types
 * Shared types for usage tracking components
 */

export interface UsageData {
  apiCalls: number;
  apiLimit: number;
  storageBytes: number;
  storageLimit: number;
  period: string;
  periodStart: number;
  periodEnd: number;
  lastUpdated: number;
}

export interface FeatureAccess {
  advancedAnalytics: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
  planId: string;
  updatedAt: number;
}

export interface ApiCallLog {
  _id: string;
  userId: string;
  organizationId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}

export interface UsageCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  current: number | undefined;
  limit: number | undefined;
  unit?: string;
  description?: string;
  warningThreshold?: number; // Show warning when usage exceeds this percentage (default: 80%)
  onUpgrade?: () => void;
}
