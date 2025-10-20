/**
 * Subscription plans configuration for the B2B SaaS starter.
 *
 * This file contains the default subscription plans following the Better Auth Stripe schema.
 * Each plan must have a valid priceId from your Stripe account.
 *
 * Better Auth Stripe Plan Structure:
 * - name: string (lowercase, required) - The plan identifier
 * - priceId: string (required) - Stripe price ID for monthly billing
 * - annualDiscountPriceId?: string (optional) - Stripe price ID for annual billing
 * - limits?: Record<string, number> (optional) - Feature limits for the plan
 * - freeTrial?: { days: number } (optional) - Trial period configuration
 *
 * NOTE: Better Auth Stripe does NOT use amount, currency, interval, description, or features.
 * These are managed in Stripe and fetched via the Stripe API.
 *
 * For production, replace the priceId values with your actual Stripe price IDs from:
 * https://dashboard.stripe.com/prices
 */
export const subscriptionPlans = [
  {
    name: "free",
    // Free plan should reference a Stripe PRICE id (starts with "price_") if using Stripe-managed subscriptions
    // Prefer the more explicit FREE_MONTHLY env; fallback to legacy STRIPE_PRICE_FREE; finally to placeholder
    priceId:
      process.env.STRIPE_PRICE_FREE_MONTHLY ||
      "price_free_monthly",
    // Provide an annual price as well to support yearly billing for Free when enabled
    annualDiscountPriceId:
      process.env.STRIPE_PRICE_FREE_YEARLY ||
      "price_free_annual",
    limits: {
      projects: 1,
      storage: 1, // GB
      members: 1,
      apiCallsPerMonth: 10000, // 10k API calls/month
      apiKeysPerOrg: 2,
      apiRateLimitPerMinute: 100, // 100 requests per minute
    },
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
    annualDiscountPriceId:
      process.env.STRIPE_PRICE_PRO_YEARLY ||
      "price_pro_annual",
    limits: {
      projects: 10,
      storage: 50, // GB
      members: 1,
      apiCallsPerMonth: 100000, // 100k API calls/month
      apiKeysPerOrg: 5,
      apiRateLimitPerMinute: 1000, // 1000 requests per minute
    },
    freeTrial: {
      days: 14,
    },
  },
  {
    name: "team",
    priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY || "price_team_monthly",
    annualDiscountPriceId:
      process.env.STRIPE_PRICE_TEAM_YEARLY ||
      "price_team_annual",
    limits: {
      projects: 100,
      storage: 500, // GB
      members: 100, // Controlled by seats parameter
      apiCallsPerMonth: 1000000, // 1M API calls/month
      apiKeysPerOrg: 20,
      apiRateLimitPerMinute: 5000, // 5000 requests per minute
    },
    freeTrial: {
      days: 30,
    },
  },
];

/**
 * Get rate limit configuration for a subscription plan
 */
export function getPlanRateLimit(planName: string): {
  requestsPerMinute: number;
  requestsPerMonth: number;
  maxApiKeys: number;
} {
  const plan = subscriptionPlans.find(p => p.name === planName);
  
  if (!plan || !plan.limits) {
    // Default to free tier limits if plan not found
    return {
      requestsPerMinute: 100,
      requestsPerMonth: 10000,
      maxApiKeys: 2,
    };
  }
  
  return {
    requestsPerMinute: plan.limits.apiRateLimitPerMinute || 100,
    requestsPerMonth: plan.limits.apiCallsPerMonth || 10000,
    maxApiKeys: plan.limits.apiKeysPerOrg || 2,
  };
}

/**
 * Get all limits for a subscription plan
 */
export function getPlanLimits(planName: string) {
  const plan = subscriptionPlans.find(p => p.name === planName);
  return plan?.limits || subscriptionPlans[0].limits; // Default to free tier
}

/**
 * Instructions for customizing subscription plans:
 *
 * 1. Create products and prices in your Stripe dashboard: https://dashboard.stripe.com/products
 * 2. Copy the price IDs (format: price_xxxxxxxxxxxxx) 
 * 3. Add them to your .env.local file:
 *    STRIPE_PRICE_FREE=price_xxxxxxxxxxxxx
 *    STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
 *    STRIPE_PRICE_PRO_ANNUAL=price_xxxxxxxxxxxxx
 *    STRIPE_PRICE_TEAM_MONTHLY=price_xxxxxxxxxxxxx
 *    STRIPE_PRICE_TEAM_ANNUAL=price_xxxxxxxxxxxxx
 * 4. Update the limits object to match your feature restrictions
 * 5. Adjust trial periods (days) as needed
 *
 * Example: Adding an enterprise plan
 * {
 *   name: "enterprise",
 *   priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "price_enterprise_monthly",
 *   annualDiscountPriceId: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || "price_enterprise_annual",
 *   limits: {
 *     projects: -1, // unlimited
 *     storage: -1,  // unlimited
 *     members: 1000,
 *   },
 *   freeTrial: {
 *     days: 30,
 *   },
 * }
 */