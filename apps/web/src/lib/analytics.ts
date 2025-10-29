import { posthog } from "./posthog";

/**
 * Analytics helper functions for tracking key events
 */

export const analytics = {
  // User events
  identify: (userId: string, traits?: Record<string, any>) => {
    if (posthog) {
      posthog.identify(userId, traits);
    }
  },

  reset: () => {
    if (posthog) {
      posthog.reset();
    }
  },

  // Authentication events
  signUp: (method: string, userId?: string) => {
    if (posthog) {
      posthog.capture("user_signed_up", {
        method, // "email", "google", "github"
        userId,
      });
    }
  },

  signIn: (method: string, userId?: string) => {
    if (posthog) {
      posthog.capture("user_signed_in", {
        method,
        userId,
      });
    }
  },

  signOut: () => {
    if (posthog) {
      posthog.capture("user_signed_out");
    }
  },

  // Subscription events
  subscriptionCreated: (plan: string, interval: "monthly" | "yearly", amount: number) => {
    if (posthog) {
      posthog.capture("subscription_created", {
        plan,
        interval,
        amount,
      });
    }
  },

  subscriptionUpgraded: (fromPlan: string, toPlan: string, amount: number) => {
    if (posthog) {
      posthog.capture("subscription_upgraded", {
        from_plan: fromPlan,
        to_plan: toPlan,
        amount,
      });
    }
  },

  subscriptionCancelled: (plan: string, reason?: string) => {
    if (posthog) {
      posthog.capture("subscription_cancelled", {
        plan,
        reason,
      });
    }
  },

  subscriptionReactivated: (plan: string) => {
    if (posthog) {
      posthog.capture("subscription_reactivated", {
        plan,
      });
    }
  },

  // Team/Organization events
  teamCreated: (organizationId: string, memberCount: number) => {
    if (posthog) {
      posthog.capture("team_created", {
        organization_id: organizationId,
        member_count: memberCount,
      });
    }
  },

  teamMemberInvited: (organizationId: string, role: string) => {
    if (posthog) {
      posthog.capture("team_member_invited", {
        organization_id: organizationId,
        role,
      });
    }
  },

  teamMemberJoined: (organizationId: string, role: string) => {
    if (posthog) {
      posthog.capture("team_member_joined", {
        organization_id: organizationId,
        role,
      });
    }
  },

  teamMemberRemoved: (organizationId: string, role: string) => {
    if (posthog) {
      posthog.capture("team_member_removed", {
        organization_id: organizationId,
        role,
      });
    }
  },

  // API events
  apiKeyCreated: (organizationId: string) => {
    if (posthog) {
      posthog.capture("api_key_created", {
        organization_id: organizationId,
      });
    }
  },

  apiKeyRevoked: (organizationId: string) => {
    if (posthog) {
      posthog.capture("api_key_revoked", {
        organization_id: organizationId,
      });
    }
  },

  apiCallMade: (endpoint: string, statusCode: number, responseTime: number) => {
    if (posthog) {
      posthog.capture("api_call_made", {
        endpoint,
        status_code: statusCode,
        response_time: responseTime,
      });
    }
  },

  // Feature usage
  featureUsed: (featureName: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture("feature_used", {
        feature: featureName,
        ...properties,
      });
    }
  },

  // Custom events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture(eventName, properties);
    }
  },
};
