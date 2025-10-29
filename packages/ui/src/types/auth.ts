/**
 * Better Auth Client Interface
 * Defines the minimal interface components need from the auth client
 * Works with any Better Auth client implementation (@convex-dev/better-auth, better-auth/react, etc.)
 */

export interface BetterAuthSession {
  user: {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    [key: string]: any;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface BetterAuthOrganization {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  [key: string]: any;
}

export interface BetterAuthSubscription {
  id: string;
  referenceId: string; // user ID or organization ID
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid";
  planId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  trialEnd?: Date;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface BetterAuthClient {
  // Session management
  useSession: () => {
    data: BetterAuthSession | null;
    isPending: boolean;
    error?: Error;
  };

  // Organization management
  useListOrganizations: () => {
    data: BetterAuthOrganization[] | null;
    isPending: boolean;
    error?: Error;
  };

  // Subscription management (Better Auth Stripe plugin)
  subscription?: {
    list: () => Promise<{
      data?: BetterAuthSubscription[];
      error?: Error;
    }>;
    createPortalSession?: (referenceId: string) => Promise<{
      url?: string;
      error?: Error;
    }>;
  };

  // Additional plugin methods can be added here
  [key: string]: any;
}
