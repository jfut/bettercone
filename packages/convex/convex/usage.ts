/**
 * Usage Tracking Queries and Mutations
 * Real-time usage data with Convex
 */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get current usage for a user
 */
export const getCurrentUsage = query({
  args: {
    userId: v.string(),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const currentPeriod = new Date(now).toISOString().slice(0, 7); // "2024-10"
    
    // Query by organization if provided, otherwise by user
    const usage = await ctx.db
      .query("usage")
      .withIndex(
        args.organizationId ? "by_org_period" : "by_user_period",
        (q) => args.organizationId 
          ? q.eq("organizationId", args.organizationId).eq("period", currentPeriod)
          : q.eq("userId", args.userId).eq("period", currentPeriod)
      )
      .first();
    
    // If no usage record exists, create a default one
    if (!usage) {
      return {
        apiCalls: 0,
        apiLimit: 10000, // Default limit
        storageBytes: 0,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
        period: currentPeriod,
        periodStart: new Date(now).setDate(1),
        periodEnd: new Date(new Date(now).getFullYear(), new Date(now).getMonth() + 1, 0).getTime(),
        lastUpdated: now,
      };
    }
    
    return usage;
  },
});

/**
 * Get feature access for user/organization
 */
export const getFeatureAccess = query({
  args: {
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Query by organization first, fall back to user
    let features = null;
    
    if (args.organizationId) {
      features = await ctx.db
        .query("featureAccess")
        .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
        .first();
    }
    
    if (!features && args.userId) {
      features = await ctx.db
        .query("featureAccess")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .first();
    }
    
    // Default features for free plan
    return features || {
      advancedAnalytics: false,
      apiAccess: true,
      customIntegrations: false,
      prioritySupport: false,
      planId: "free",
      updatedAt: Date.now(),
    };
  },
});

/**
 * Get API call logs for the current period
 */
export const getApiCallLogs = query({
  args: {
    userId: v.string(),
    organizationId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    
    const logs = await ctx.db
      .query("apiCallLogs")
      .withIndex(
        args.organizationId ? "by_organization" : "by_user",
        (q) => args.organizationId 
          ? q.eq("organizationId", args.organizationId)
          : q.eq("userId", args.userId)
      )
      .order("desc")
      .take(limit);
    
    return logs;
  },
});

/**
 * Increment API call count
 */
export const incrementApiCalls = mutation({
  args: {
    userId: v.string(),
    organizationId: v.optional(v.string()),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const currentPeriod = new Date(now).toISOString().slice(0, 7);
    const count = args.count || 1;
    
    // Find existing usage record
    const usage = await ctx.db
      .query("usage")
      .withIndex(
        args.organizationId ? "by_org_period" : "by_user_period",
        (q) => args.organizationId 
          ? q.eq("organizationId", args.organizationId).eq("period", currentPeriod)
          : q.eq("userId", args.userId).eq("period", currentPeriod)
      )
      .first();
    
    if (usage) {
      // Update existing record
      await ctx.db.patch(usage._id, {
        apiCalls: usage.apiCalls + count,
        lastUpdated: now,
      });
    } else {
      // Create new usage record
      const periodStart = new Date(now);
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0);
      periodEnd.setHours(23, 59, 59, 999);
      
      await ctx.db.insert("usage", {
        userId: args.userId,
        organizationId: args.organizationId,
        apiCalls: count,
        apiLimit: 10000,
        storageBytes: 0,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
        period: currentPeriod,
        periodStart: periodStart.getTime(),
        periodEnd: periodEnd.getTime(),
        lastUpdated: now,
      });
    }
    
    return { success: true };
  },
});

/**
 * Log an API call
 */
export const logApiCall = mutation({
  args: {
    userId: v.string(),
    organizationId: v.optional(v.string()),
    endpoint: v.string(),
    method: v.string(),
    statusCode: v.number(),
    responseTime: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const currentPeriod = new Date(now).toISOString().slice(0, 7);
    
    // Log the API call
    await ctx.db.insert("apiCallLogs", {
      userId: args.userId,
      organizationId: args.organizationId,
      endpoint: args.endpoint,
      method: args.method,
      statusCode: args.statusCode,
      responseTime: args.responseTime,
      timestamp: now,
    });
    
    // Also increment the API call counter
    const usage = await ctx.db
      .query("usage")
      .withIndex(
        args.organizationId ? "by_org_period" : "by_user_period",
        (q) => args.organizationId 
          ? q.eq("organizationId", args.organizationId).eq("period", currentPeriod)
          : q.eq("userId", args.userId).eq("period", currentPeriod)
      )
      .first();
    
    if (usage) {
      await ctx.db.patch(usage._id, {
        apiCalls: usage.apiCalls + 1,
        lastUpdated: now,
      });
    } else {
      // Create new usage record
      const periodStart = new Date(now);
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0);
      periodEnd.setHours(23, 59, 59, 999);
      
      await ctx.db.insert("usage", {
        userId: args.userId,
        organizationId: args.organizationId,
        apiCalls: 1,
        apiLimit: 10000,
        storageBytes: 0,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
        period: currentPeriod,
        periodStart: periodStart.getTime(),
        periodEnd: periodEnd.getTime(),
        lastUpdated: now,
      });
    }
    
    return { success: true };
  },
});

/**
 * Update storage usage
 */
export const updateStorageUsage = mutation({
  args: {
    userId: v.string(),
    organizationId: v.optional(v.string()),
    bytes: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const currentPeriod = new Date(now).toISOString().slice(0, 7);
    
    const usage = await ctx.db
      .query("usage")
      .withIndex(
        args.organizationId ? "by_org_period" : "by_user_period",
        (q) => args.organizationId 
          ? q.eq("organizationId", args.organizationId).eq("period", currentPeriod)
          : q.eq("userId", args.userId).eq("period", currentPeriod)
      )
      .first();
    
    if (usage) {
      await ctx.db.patch(usage._id, {
        storageBytes: args.bytes,
        lastUpdated: now,
      });
    } else {
      // Create new record with storage data
      const periodStart = new Date(now);
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0);
      periodEnd.setHours(23, 59, 59, 999);
      
      await ctx.db.insert("usage", {
        userId: args.userId,
        organizationId: args.organizationId,
        apiCalls: 0,
        apiLimit: 10000,
        storageBytes: args.bytes,
        storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
        period: currentPeriod,
        periodStart: periodStart.getTime(),
        periodEnd: periodEnd.getTime(),
        lastUpdated: now,
      });
    }
    
    return { success: true };
  },
});

/**
 * Update feature access (typically triggered by subscription changes)
 */
export const updateFeatureAccess = mutation({
  args: {
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    planId: v.string(),
    advancedAnalytics: v.boolean(),
    apiAccess: v.boolean(),
    customIntegrations: v.boolean(),
    prioritySupport: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Find existing feature access
    let existing = null;
    if (args.organizationId) {
      existing = await ctx.db
        .query("featureAccess")
        .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
        .first();
    } else if (args.userId) {
      existing = await ctx.db
        .query("featureAccess")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .first();
    }
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        planId: args.planId,
        advancedAnalytics: args.advancedAnalytics,
        apiAccess: args.apiAccess,
        customIntegrations: args.customIntegrations,
        prioritySupport: args.prioritySupport,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("featureAccess", {
        userId: args.userId,
        organizationId: args.organizationId,
        planId: args.planId,
        advancedAnalytics: args.advancedAnalytics,
        apiAccess: args.apiAccess,
        customIntegrations: args.customIntegrations,
        prioritySupport: args.prioritySupport,
        updatedAt: now,
      });
    }
    
    return { success: true };
  },
});
