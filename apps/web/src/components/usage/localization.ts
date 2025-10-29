/**
 * Usage Components Localization
 * Following Better Auth UI pattern for internationalization
 */

export interface UsageLocalization {
  // API Usage Card
  API_CALLS: string;
  API_CALLS_DESCRIPTION: string;
  HIGH_USAGE: string;
  APPROACHING_LIMIT: string;
  ABOVE_THRESHOLD: string;
  UPGRADE_PLAN: string;
  
  // Storage Usage Card
  STORAGE: string;
  STORAGE_DESCRIPTION: string;
  STORAGE_WARNING: string;
  INCREASE_STORAGE: string;
  
  // Feature Access Card
  FEATURE_ACCESS: string;
  FEATURE_ACCESS_DESCRIPTION: string;
  AVAILABLE: string;
  UNAVAILABLE: string;
  UPGRADE_TO_ACCESS: string;
  
  // General
  USAGE: string;
  LIMIT: string;
  CALLS: string;
  USED: string;
  REMAINING: string;
}

export const defaultUsageLocalization: UsageLocalization = {
  // API Usage Card
  API_CALLS: "API Calls",
  API_CALLS_DESCRIPTION: "Monthly API calls usage",
  HIGH_USAGE: "High Usage",
  APPROACHING_LIMIT: "You're approaching your API limit. Upgrade to avoid service interruption.",
  ABOVE_THRESHOLD: "You're using more than 80% of your monthly API calls.",
  UPGRADE_PLAN: "Upgrade Plan",
  
  // Storage Usage Card
  STORAGE: "Storage",
  STORAGE_DESCRIPTION: "Current storage usage",
  STORAGE_WARNING: "You're running low on storage space.",
  INCREASE_STORAGE: "Increase Storage",
  
  // Feature Access Card
  FEATURE_ACCESS: "Feature Access",
  FEATURE_ACCESS_DESCRIPTION: "Available features for your plan",
  AVAILABLE: "Available",
  UNAVAILABLE: "Unavailable",
  UPGRADE_TO_ACCESS: "Upgrade to Access",
  
  // General
  USAGE: "Usage",
  LIMIT: "Limit",
  CALLS: "calls",
  USED: "used",
  REMAINING: "remaining",
};
