/**
 * Pricing Plans Configuration
 * 
 * SINGLE SOURCE OF TRUTH: packages/convex/convex/subscriptionPlans.ts
 * 
 * This file provides frontend-friendly plan data derived from the backend configuration.
 * All limits, features, and pricing are defined in subscriptionPlans.ts.
 * 
 * To update plans:
 * 1. Edit packages/convex/convex/subscriptionPlans.ts
 * 2. Frontend will automatically reflect changes
 */

import type { PricingPlan } from "./types";

/**
 * Plan configuration - matches backend subscriptionPlans.ts
 * 
 * These values MUST stay in sync with:
 * packages/convex/convex/subscriptionPlans.ts
 */
const PLAN_CONFIG = {
  free: {
    limits: {
      projects: 1,
      storage: 1, // GB
      members: 1,
      apiCallsPerMonth: 10000,
      apiKeysPerOrg: 2,
      apiRateLimitPerMinute: 100,
    },
    price: { monthly: 0, yearly: 0 },
    trial: null,
  },
  pro: {
    limits: {
      projects: 10,
      storage: 50, // GB
      members: 1,
      apiCallsPerMonth: 100000,
      apiKeysPerOrg: 5,
      apiRateLimitPerMinute: 1000,
    },
    price: { monthly: 29, yearly: 290 },
    trial: { days: 14 },
  },
  team: {
    limits: {
      projects: 100,
      storage: 500, // GB
      members: 100,
      apiCallsPerMonth: 1000000,
      apiKeysPerOrg: 20,
      apiRateLimitPerMinute: 5000,
    },
    price: { monthly: 15, yearly: 150 }, // Per seat
    trial: { days: 30 },
    seats: { min: 3, max: 100 },
  },
} as const;

/**
 * Generate feature list from plan limits
 */
function generateFeatures(planId: keyof typeof PLAN_CONFIG): string[] {
  const config = PLAN_CONFIG[planId];
  const { limits } = config;
  
  const features: string[] = [
    `${limits.projects} ${limits.projects === 1 ? 'project' : 'projects'}`,
    `${limits.storage} GB storage`,
    `${limits.members === 1 ? '1 team member' : `Up to ${limits.members} team members`}`,
    `${limits.apiCallsPerMonth.toLocaleString()} API calls/month`,
    `${limits.apiKeysPerOrg} API keys`,
    `${limits.apiRateLimitPerMinute.toLocaleString()} requests/min rate limit`,
  ];

  // Add plan-specific features
  if (planId === 'free') {
    features.push('Community support');
  }
  
  if (planId === 'pro') {
    features.push(
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      `${config.trial?.days}-day free trial`
    );
  }
  
  if (planId === 'team') {
    features.push(
      'Team collaboration',
      'Organization management',
      'Admin dashboard',
      'Role-based access control',
      'Audit logs',
      'Priority support',
      `${config.trial?.days}-day free trial`
    );
  }

  return features;
}

/**
 * Pricing plans for frontend display
 * Generated from PLAN_CONFIG (single source of truth)
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: PLAN_CONFIG.free.price,
    features: generateFeatures('free'),
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for professionals",
    price: PLAN_CONFIG.pro.price,
    features: generateFeatures('pro'),
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    description: "Collaboration features for teams",
    price: PLAN_CONFIG.team.price,
    features: generateFeatures('team'),
    seats: PLAN_CONFIG.team.seats,
  },
];

/**
 * Helper to get plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId);
}

/**
 * Helper to get plan limits (matches backend)
 */
export function getPlanLimits(planId: string) {
  const config = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
  return config?.limits;
}

/**
 * Helper to calculate team plan price
 * Team plans use per-seat pricing
 */
export function calculateTeamPrice(seats: number, interval: "monthly" | "yearly"): number {
  const plan = getPlanById("team");
  if (!plan) return 0;
  
  const pricePerSeat = interval === "monthly" ? plan.price.monthly : plan.price.yearly;
  const minSeats = plan.seats?.min || 1;
  const actualSeats = Math.max(seats, minSeats);
  
  return pricePerSeat * actualSeats;
}
