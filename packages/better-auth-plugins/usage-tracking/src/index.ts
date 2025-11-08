import type { BetterAuthPlugin } from "better-auth";

export type ResetMode = "lazy" | "scheduled" | "manual";
export type ResetPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface UsageTrackingOptions {
  // Reset configuration
  resetMode?: ResetMode;
  resetPeriod?: ResetPeriod;
  resetDay?: number; // Day of month (1-31) or day of week (0-6)

  // API Usage defaults
  defaultApiLimit?: number;

  // Feature defaults
  defaultPlanId?: string;

  // Hooks
  onLimitExceeded?: (context: LimitExceededContext) => Promise<void>;
  onUsageWarning?: (context: UsageWarningContext) => Promise<void>;
  onUsageReset?: (context: UsageResetContext) => Promise<void>;
}

export interface LimitExceededContext {
  organizationId: string;
  metricType: "api";
  current: number;
  limit: number;
}

export interface UsageWarningContext {
  organizationId: string;
  metricType: "api";
  current: number;
  limit: number;
  percentage: number;
}

export interface UsageResetContext {
  organizationId: string;
  resetType: "lazy" | "scheduled" | "manual";
  previousCount: number;
  resetDate: Date;
}

export interface FeatureAccess {
  [key: string]: boolean | string | undefined;
}

// Helper function to calculate next reset date
function calculateNextReset(
  from: Date,
  period: ResetPeriod,
  dayOfPeriod: number = 1
): Date {
  const next = new Date(from);

  switch (period) {
    case "daily":
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      break;

    case "weekly":
      const daysUntilReset = (7 - next.getDay() + dayOfPeriod) % 7 || 7;
      next.setDate(next.getDate() + daysUntilReset);
      next.setHours(0, 0, 0, 0);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      next.setDate(Math.min(dayOfPeriod, getDaysInMonth(next)));
      next.setHours(0, 0, 0, 0);
      break;

    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      next.setMonth(0);
      next.setDate(dayOfPeriod);
      next.setHours(0, 0, 0, 0);
      break;
  }

  return next;
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export const usageTracking = (options: UsageTrackingOptions = {}): BetterAuthPlugin => {
  const {
    resetMode = "lazy",
    resetPeriod = "monthly",
    resetDay = 1,
    defaultApiLimit = 1000,
    defaultPlanId = "free",
    onLimitExceeded,
    onUsageWarning,
    onUsageReset,
  } = options;

  return {
    id: "usage-tracking",

    // Extend organization schema
    schema: {
      organization: {
        fields: {
          // API Usage
          apiCallCount: {
            type: "number",
            required: false,
            defaultValue: 0,
          },
          apiCallLimit: {
            type: "number",
            required: false,
            defaultValue: defaultApiLimit,
          },
          apiCallResetDate: {
            type: "date",
            required: false,
          },

          // Features (stored as JSON string)
          features: {
            type: "string",
            required: false,
          },
          planId: {
            type: "string",
            required: false,
            defaultValue: defaultPlanId,
          },

          // Reset configuration
          resetMode: {
            type: "string",
            required: false,
            defaultValue: resetMode,
          },
          resetPeriod: {
            type: "string",
            required: false,
            defaultValue: resetPeriod,
          },
        },
      },

      // Usage history table
      usageHistory: {
        fields: {
          id: {
            type: "string",
            required: true,
          },
          organizationId: {
            type: "string",
            required: true,
            references: {
              model: "organization",
              field: "id",
              onDelete: "cascade",
            },
          },
          metricType: {
            type: "string", // "api" or "feature"
            required: true,
          },
          value: {
            type: "number",
            required: true,
          },
          date: {
            type: "date",
            required: true,
          },
          createdAt: {
            type: "date",
            required: true,
          },
        },
      },
    },

    // Hooks for automatic tracking
    hooks: {
      // Before hook: Check if reset is needed (lazy mode)
      before: [
        {
          matcher: (context: any) => {
            return (
              resetMode === "lazy" &&
              context.path.startsWith("/") &&
              !context.path.includes("/usage-tracking/")
            );
          },
          handler: async (ctx: any) => {
            try {
              const session = ctx.context?.session || ctx.session;
              if (!session?.activeOrganizationId) {
                return;
              }

              const orgId = session.activeOrganizationId;

              // Get organization
              const org = await ctx.context.adapter.findOne({
                model: "organization",
                where: [{ field: "id", value: orgId }],
              });

              if (!org) {
                return;
              }

              // Check if reset is needed
              const now = new Date();
              const resetDate = org.apiCallResetDate
                ? new Date(org.apiCallResetDate)
                : null;

              if (!resetDate || now >= resetDate) {
                // Reset needed
                const nextResetDate = calculateNextReset(
                  now,
                  (org.resetPeriod as ResetPeriod) || resetPeriod,
                  resetDay
                );

                const previousCount = org.apiCallCount || 0;

                await ctx.context.adapter.update({
                  model: "organization",
                  where: [{ field: "id", value: orgId }],
                  update: {
                    apiCallCount: 0,
                    apiCallResetDate: nextResetDate,
                  },
                });

                // Trigger reset callback
                if (onUsageReset && previousCount > 0) {
                  await onUsageReset({
                    organizationId: orgId,
                    resetType: "lazy",
                    previousCount,
                    resetDate: now,
                  });
                }

                // Record in history
                await ctx.context.adapter.create({
                  model: "usageHistory",
                  data: {
                    id: crypto.randomUUID(),
                    organizationId: orgId,
                    metricType: "api",
                    value: previousCount,
                    date: now,
                    createdAt: now,
                  },
                });
              }
            } catch (error) {
              console.error("Usage tracking before hook error:", error);
            }
          },
        },
      ],

      // After hook: Track API usage
      after: [
        {
          matcher: (context: any) => {
            return (
              context.path.startsWith("/") &&
              !context.path.includes("/usage-tracking/")
            );
          },
          handler: async (ctx: any) => {
            try {
              const session = ctx.context?.session || ctx.session;
              if (!session?.activeOrganizationId) {
                return;
              }

              const orgId = session.activeOrganizationId;

              // Get current organization data
              const org = await ctx.context.adapter.findOne({
                model: "organization",
                where: [{ field: "id", value: orgId }],
              });

              if (!org) {
                return;
              }

              const newCount = (org.apiCallCount || 0) + 1;
              const limit = org.apiCallLimit || defaultApiLimit;

              // Update count
              await ctx.context.adapter.update({
                model: "organization",
                where: [{ field: "id", value: orgId }],
                update: {
                  apiCallCount: newCount,
                },
              });

              // Check if limit exceeded
              if (newCount >= limit) {
                if (onLimitExceeded) {
                  await onLimitExceeded({
                    organizationId: orgId,
                    metricType: "api",
                    current: newCount,
                    limit,
                  });
                }
              }

              // Check for warning threshold (80%)
              const warningThreshold = limit * 0.8;
              if (
                newCount >= warningThreshold &&
                newCount < limit &&
                onUsageWarning
              ) {
                await onUsageWarning({
                  organizationId: orgId,
                  metricType: "api",
                  current: newCount,
                  limit,
                  percentage: (newCount / limit) * 100,
                });
              }
            } catch (error) {
              console.error("Usage tracking after hook error:", error);
            }
          },
        },
      ],
    },

    // Endpoints
    endpoints: {
      // Get usage for active organization
      getUsage: {
        path: "/usage-tracking/get-usage",
        handler: async (ctx: any) => {
          try {
            const session = ctx.context.session;
            const queryOrgId = ctx.request.url.searchParams.get("organizationId");
            const orgId = queryOrgId || session?.activeOrganizationId;

            if (!orgId) {
              return ctx.json({ error: "No organization found" }, { status: 400 });
            }

            const org = await ctx.context.adapter.findOne({
              model: "organization",
              where: [{ field: "id", value: orgId }],
            });

            if (!org) {
              return ctx.json({ error: "Organization not found" }, { status: 404 });
            }

            return ctx.json({
              api: {
                current: org.apiCallCount || 0,
                limit: org.apiCallLimit || defaultApiLimit,
                resetDate: org.apiCallResetDate,
              },
              features: org.features ? JSON.parse(org.features) : null,
              planId: org.planId || defaultPlanId,
              resetMode: org.resetMode || resetMode,
              resetPeriod: org.resetPeriod || resetPeriod,
            });
          } catch (error) {
            console.error("Get usage error:", error);
            return ctx.json({ error: "Internal server error" }, { status: 500 });
          }
        },
      },

      // Get usage history
      getUsageHistory: {
        path: "/usage-tracking/get-usage-history",
        handler: async (ctx: any) => {
          try {
            const session = ctx.context.session;
            const queryOrgId = ctx.request.url.searchParams.get("organizationId");
            const orgId = queryOrgId || session?.activeOrganizationId;

            if (!orgId) {
              return ctx.json({ error: "No organization found" }, { status: 400 });
            }

            const limit = parseInt(
              ctx.request.url.searchParams.get("limit") || "30"
            );

            const history = await ctx.context.adapter.findMany({
              model: "usageHistory",
              where: [{ field: "organizationId", value: orgId }],
              limit,
              sortBy: { field: "date", direction: "desc" },
            });

            return ctx.json({ history });
          } catch (error) {
            console.error("Get usage history error:", error);
            return ctx.json({ error: "Internal server error" }, { status: 500 });
          }
        },
      },

      // Manual reset endpoint
      resetUsage: {
        path: "/usage-tracking/reset",
        handler: async (ctx: any) => {
          try {
            const session = ctx.context.session;
            if (!session) {
              return ctx.json({ error: "Unauthorized" }, { status: 401 });
            }

            const body = await ctx.request.json();
            const { organizationId, resetApi = true } = body;

            // TODO: Check if user has permission (owner/admin)
            // This should integrate with Better Auth organization permissions

            const org = await ctx.context.adapter.findOne({
              model: "organization",
              where: [{ field: "id", value: organizationId }],
            });

            if (!org) {
              return ctx.json({ error: "Organization not found" }, { status: 404 });
            }

            if (resetApi) {
              const now = new Date();
              const nextResetDate = calculateNextReset(
                now,
                (org.resetPeriod as ResetPeriod) || resetPeriod,
                resetDay
              );

              const previousCount = org.apiCallCount || 0;

              await ctx.context.adapter.update({
                model: "organization",
                where: [{ field: "id", value: organizationId }],
                update: {
                  apiCallCount: 0,
                  apiCallResetDate: nextResetDate,
                },
              });

              // Record in history
              await ctx.context.adapter.create({
                model: "usageHistory",
                data: {
                  id: crypto.randomUUID(),
                  organizationId,
                  metricType: "api",
                  value: previousCount,
                  date: now,
                  createdAt: now,
                },
              });

              if (onUsageReset) {
                await onUsageReset({
                  organizationId,
                  resetType: "manual",
                  previousCount,
                  resetDate: now,
                });
              }
            }

            return ctx.json({ success: true });
          } catch (error) {
            console.error("Reset usage error:", error);
            return ctx.json({ error: "Internal server error" }, { status: 500 });
          }
        },
      },

      // Scheduled reset endpoint (for cron jobs)
      resetExpired: {
        path: "/usage-tracking/reset-expired",
        handler: async (ctx: any) => {
          try {
            const body = await ctx.request.json();
            const { apiKey } = body;

            // Verify API key
            const envApiKey = typeof process !== 'undefined' ? process.env?.USAGE_TRACKING_API_KEY : undefined;
            if (!apiKey || apiKey !== envApiKey) {
              return ctx.json({ error: "Unauthorized" }, { status: 401 });
            }

            const now = new Date();

            // Find all organizations with expired reset dates in "scheduled" mode
            const orgs = await ctx.context.adapter.findMany({
              model: "organization",
              where: [
                { field: "resetMode", value: "scheduled" },
              ],
            });

            // Filter organizations that need reset
            const orgsToReset = orgs.filter((org: any) => {
              const resetDate = org.apiCallResetDate
                ? new Date(org.apiCallResetDate)
                : null;
              return !resetDate || now >= resetDate;
            });

            // Reset them
            for (const org of orgsToReset) {
              const nextResetDate = calculateNextReset(
                now,
                (org.resetPeriod as ResetPeriod) || resetPeriod,
                resetDay
              );

              const previousCount = org.apiCallCount || 0;

              await ctx.context.adapter.update({
                model: "organization",
                where: [{ field: "id", value: org.id }],
                update: {
                  apiCallCount: 0,
                  apiCallResetDate: nextResetDate,
                },
              });

              // Record in history
              await ctx.context.adapter.create({
                model: "usageHistory",
                data: {
                  id: crypto.randomUUID(),
                  organizationId: org.id,
                  metricType: "api",
                  value: previousCount,
                  date: now,
                  createdAt: now,
                },
              });

              if (onUsageReset) {
                await onUsageReset({
                  organizationId: org.id,
                  resetType: "scheduled",
                  previousCount,
                  resetDate: now,
                });
              }
            }

            return ctx.json({
              success: true,
              resetCount: orgsToReset.length,
              organizations: orgsToReset.map((o: any) => o.id),
            });
          } catch (error) {
            console.error("Reset expired error:", error);
            return ctx.json({ error: "Internal server error" }, { status: 500 });
          }
        },
      },

      // Update limits (admin only)
      updateLimits: {
        path: "/usage-tracking/update-limits",
        handler: async (ctx: any) => {
          try {
            const session = ctx.context.session;
            if (!session) {
              return ctx.json({ error: "Unauthorized" }, { status: 401 });
            }

            const body = await ctx.request.json();
            const {
              organizationId,
              apiLimit,
              resetMode: newResetMode,
              resetPeriod: newResetPeriod,
            } = body;

            // TODO: Check if user is admin/owner of the organization
            // This should use Better Auth organization plugin's permission system

            const updates: Record<string, any> = {};

            if (apiLimit !== undefined) {
              updates.apiCallLimit = apiLimit;
            }
            if (newResetMode !== undefined) {
              updates.resetMode = newResetMode;
            }
            if (newResetPeriod !== undefined) {
              updates.resetPeriod = newResetPeriod;
            }

            await ctx.context.adapter.update({
              model: "organization",
              where: [{ field: "id", value: organizationId }],
              update: updates,
            });

            return ctx.json({ success: true });
          } catch (error) {
            console.error("Update limits error:", error);
            return ctx.json({ error: "Internal server error" }, { status: 500 });
          }
        },
      },
    } as any,
  } satisfies BetterAuthPlugin;
};
