/**
 * Pricing Component Types
 * Shared types for pricing components
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  seats?: {
    min: number;
    max: number;
  };
  stripePriceId?: {
    monthly: string;
    yearly: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export type BillingInterval = "monthly" | "yearly";

export interface SubscriptionParams {
  plan: string;
  successUrl: string;
  cancelUrl: string;
  annual: boolean;
  referenceId?: string;
  seats?: number;
}
