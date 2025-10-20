import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  
  // Usage tracking tables
  usage: defineTable({
    userId: v.string(),
    organizationId: v.optional(v.string()),
    
    // API Usage
    apiCalls: v.number(),
    apiLimit: v.number(),
    
    // Storage Usage
    storageBytes: v.number(),
    storageLimit: v.number(),
    
    // Period tracking
    period: v.string(), // "2024-01", "2024-02", etc.
    periodStart: v.number(),
    periodEnd: v.number(),
    
    // Metadata
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_user_period", ["userId", "period"])
    .index("by_org_period", ["organizationId", "period"]),
  
  // API call logs for detailed tracking
  apiCallLogs: defineTable({
    userId: v.string(),
    organizationId: v.optional(v.string()),
    endpoint: v.string(),
    method: v.string(),
    statusCode: v.number(),
    responseTime: v.number(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_timestamp", ["timestamp"]),
  
  // Feature flags per user/org
  featureAccess: defineTable({
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    
    // Features
    advancedAnalytics: v.boolean(),
    apiAccess: v.boolean(),
    customIntegrations: v.boolean(),
    prioritySupport: v.boolean(),
    
    // Metadata
    planId: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"]),
  
  // API rate limiting - per minute tracking
  apiRateLimit: defineTable({
    organizationId: v.string(),
    apiKeyId: v.optional(v.string()),
    
    // Rate limit tracking
    requestCount: v.number(),
    windowStart: v.number(), // Timestamp of current window start
    
    // Plan limits
    maxRequestsPerMinute: v.number(),
    
    // Last request info
    lastRequestAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_api_key", ["apiKeyId"])
    .index("by_org_window", ["organizationId", "windowStart"]),
});
