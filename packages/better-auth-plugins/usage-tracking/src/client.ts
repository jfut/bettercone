import { atom, type Atom } from "nanostores";
import { usageTracking } from "./index";
import type { FeatureAccess } from "./index";

export interface UsageData {
  api: {
    current: number;
    limit: number;
    resetDate?: Date;
  };
  features: FeatureAccess | null;
  planId: string;
  resetMode: string;
  resetPeriod: string;
}

export interface UsageHistoryEntry {
  id: string;
  organizationId: string;
  metricType: string;
  value: number;
  date: Date;
  createdAt: Date;
}

export const usageTrackingClient = () => {
  return {
    id: "usage-tracking",
    $InferServerPlugin: {} as ReturnType<typeof usageTracking>,

    // Type-safe actions for API calls
    getActions: ($fetch: any) => {
      return {
        /**
         * Fetch current usage data for the active organization
         */
        async getUsage(options?: {
          organizationId?: string;
        }): Promise<UsageData> {
          const queryParams = new URLSearchParams();
          if (options?.organizationId) {
            queryParams.append("organizationId", options.organizationId);
          }

          const response = await $fetch(
            `/usage-tracking/get-usage?${queryParams.toString()}`,
            {
              method: "GET",
            }
          );

          return response.data || response;
        },

        /**
         * Fetch usage history for analytics
         */
        async getUsageHistory(options?: {
          organizationId?: string;
          limit?: number;
        }): Promise<{ history: UsageHistoryEntry[] }> {
          const queryParams = new URLSearchParams();
          if (options?.organizationId) {
            queryParams.append("organizationId", options.organizationId);
          }
          if (options?.limit) {
            queryParams.append("limit", options.limit.toString());
          }

          const response = await $fetch(
            `/usage-tracking/get-usage-history?${queryParams.toString()}`,
            {
              method: "GET",
            }
          );

          return response.data || response;
        },

        /**
         * Manually reset usage (requires admin/owner permission)
         */
        async resetUsage(data: {
          organizationId: string;
          resetApi?: boolean;
        }): Promise<{ success: boolean }> {
          const response = await $fetch("/usage-tracking/reset", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });

          return response.data || response;
        },

        /**
         * Update usage limits (requires admin/owner permission)
         */
        async updateLimits(data: {
          organizationId: string;
          apiLimit?: number;
          resetMode?: "lazy" | "scheduled" | "manual";
          resetPeriod?: "daily" | "weekly" | "monthly" | "yearly";
        }): Promise<{ success: boolean }> {
          const response = await $fetch("/usage-tracking/update-limits", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });

          return response.data || response;
        },
      };
    },

    // Reactive atoms for state management
    getAtoms: ($fetch: any) => {
      const usageAtom = atom<UsageData | null>(null);
      const historyAtom = atom<UsageHistoryEntry[]>([]);
      const loadingAtom = atom<boolean>(false);
      const errorAtom = atom<Error | null>(null);

      return {
        usageAtom,
        historyAtom,
        loadingAtom,
        errorAtom,

        /**
         * Helper to fetch and update usage atom
         */
        async fetchUsage(organizationId?: string) {
          loadingAtom.set(true);
          errorAtom.set(null);

          try {
            const queryParams = new URLSearchParams();
            if (organizationId) {
              queryParams.append("organizationId", organizationId);
            }

            const response = await $fetch(
              `/usage-tracking/get-usage?${queryParams.toString()}`,
              {
                method: "GET",
              }
            );

            const data = response.data || response;
            if (data && !data.error) {
              usageAtom.set(data);
            } else if (data.error) {
              errorAtom.set(new Error(data.error));
            }
          } catch (err) {
            errorAtom.set(err as Error);
          } finally {
            loadingAtom.set(false);
          }
        },

        /**
         * Helper to fetch and update history atom
         */
        async fetchUsageHistory(options?: {
          organizationId?: string;
          limit?: number;
        }) {
          loadingAtom.set(true);
          errorAtom.set(null);

          try {
            const queryParams = new URLSearchParams();
            if (options?.organizationId) {
              queryParams.append("organizationId", options.organizationId);
            }
            if (options?.limit) {
              queryParams.append("limit", options.limit.toString());
            }

            const response = await $fetch(
              `/usage-tracking/get-usage-history?${queryParams.toString()}`,
              {
                method: "GET",
              }
            );

            const data = response.data || response;
            if (data && !data.error) {
              historyAtom.set(data.history || []);
            } else if (data.error) {
              errorAtom.set(new Error(data.error));
            }
          } catch (err) {
            errorAtom.set(err as Error);
          } finally {
            loadingAtom.set(false);
          }
        },
      } as any; // Cast to any since Better Auth expects Record<string, Atom<any>> but we need helper functions
    },
  };
};
