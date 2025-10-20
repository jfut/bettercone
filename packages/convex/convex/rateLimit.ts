import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPlanRateLimit } from "./subscriptionPlans";

/**
 * Check if a request is within rate limits for an organization
 * This implements sliding window rate limiting based on subscription plan
 */
export const checkRateLimit = mutation({
  args: {
    organizationId: v.string(),
    apiKeyId: v.optional(v.string()),
    planName: v.string(), // "free", "pro", "team"
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000; // Round to minute
    
    // Get plan limits
    const limits = getPlanRateLimit(args.planName);
    
    // Find or create rate limit entry for this window
    const existing = await ctx.db
      .query("apiRateLimit")
      .withIndex("by_org_window", (q) =>
        q.eq("organizationId", args.organizationId).eq("windowStart", windowStart)
      )
      .first();
    
    if (existing) {
      // Check if limit exceeded
      if (existing.requestCount >= limits.requestsPerMinute) {
        const resetIn = windowStart + 60000 - now; // Time until window resets
        return {
          allowed: false,
          remaining: 0,
          resetIn,
          limit: limits.requestsPerMinute,
        };
      }
      
      // Increment counter
      await ctx.db.patch(existing._id, {
        requestCount: existing.requestCount + 1,
        lastRequestAt: now,
      });
      
      return {
        allowed: true,
        remaining: limits.requestsPerMinute - existing.requestCount - 1,
        resetIn: windowStart + 60000 - now,
        limit: limits.requestsPerMinute,
      };
    } else {
      // Create new window entry
      await ctx.db.insert("apiRateLimit", {
        organizationId: args.organizationId,
        apiKeyId: args.apiKeyId,
        requestCount: 1,
        windowStart,
        maxRequestsPerMinute: limits.requestsPerMinute,
        lastRequestAt: now,
      });
      
      return {
        allowed: true,
        remaining: limits.requestsPerMinute - 1,
        resetIn: 60000,
        limit: limits.requestsPerMinute,
      };
    }
  },
});

/**
 * Get current rate limit status for an organization
 */
export const getRateLimitStatus = query({
  args: {
    organizationId: v.string(),
    planName: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000;
    
    const limits = getPlanRateLimit(args.planName);
    
    const current = await ctx.db
      .query("apiRateLimit")
      .withIndex("by_org_window", (q) =>
        q.eq("organizationId", args.organizationId).eq("windowStart", windowStart)
      )
      .first();
    
    if (!current) {
      return {
        requestCount: 0,
        remaining: limits.requestsPerMinute,
        limit: limits.requestsPerMinute,
        resetIn: windowStart + 60000 - now,
      };
    }
    
    return {
      requestCount: current.requestCount,
      remaining: Math.max(0, limits.requestsPerMinute - current.requestCount),
      limit: limits.requestsPerMinute,
      resetIn: windowStart + 60000 - now,
    };
  },
});

/**
 * Track API usage for monthly limits
 */
export const trackApiUsage = mutation({
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
    const period = new Date(now).toISOString().slice(0, 7); // "2025-10"
    
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
    
    // Update monthly usage counter
    const targetId = args.organizationId || args.userId;
    const indexName = args.organizationId ? "by_org_period" : "by_user_period";
    const indexQuery = args.organizationId
      ? { organizationId: args.organizationId, period }
      : { userId: args.userId, period };
    
    const usage = await ctx.db
      .query("usage")
      .withIndex(indexName as any, (q: any) =>
        args.organizationId
          ? q.eq("organizationId", args.organizationId).eq("period", period)
          : q.eq("userId", args.userId).eq("period", period)
      )
      .first();
    
    if (usage) {
      await ctx.db.patch(usage._id, {
        apiCalls: usage.apiCalls + 1,
        lastUpdated: now,
      });
    } else {
      // Create new usage entry for this period
      const periodStart = new Date(period + "-01").getTime();
      const periodEnd = new Date(
        new Date(periodStart).setMonth(new Date(periodStart).getMonth() + 1)
      ).getTime();
      
      await ctx.db.insert("usage", {
        userId: args.userId,
        organizationId: args.organizationId,
        apiCalls: 1,
        apiLimit: 10000, // Default, should be updated based on plan
        storageBytes: 0,
        storageLimit: 1073741824, // 1GB default
        period,
        periodStart,
        periodEnd,
        lastUpdated: now,
      });
    }
  },
});

/**
 * Get monthly API usage for an organization or user
 */
export const getMonthlyUsage = query({
  args: {
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    period: v.optional(v.string()), // "2025-10", defaults to current month
  },
  handler: async (ctx, args) => {
    const period = args.period || new Date().toISOString().slice(0, 7);
    
    if (args.organizationId) {
      const usage = await ctx.db
        .query("usage")
        .withIndex("by_org_period", (q) =>
          q.eq("organizationId", args.organizationId!).eq("period", period)
        )
        .first();
      
      return usage || null;
    } else if (args.userId) {
      const usage = await ctx.db
        .query("usage")
        .withIndex("by_user_period", (q) =>
          q.eq("userId", args.userId!).eq("period", period)
        )
        .first();
      
      return usage || null;
    }
    
    return null;
  },
});

/**
 * Clean up old rate limit entries (run periodically)
 */
export const cleanupOldRateLimits = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const cutoff = now - 3600000; // 1 hour ago
    
    const oldEntries = await ctx.db
      .query("apiRateLimit")
      .filter((q) => q.lt(q.field("windowStart"), cutoff))
      .collect();
    
    for (const entry of oldEntries) {
      await ctx.db.delete(entry._id);
    }
    
    return { deleted: oldEntries.length };
  },
});
