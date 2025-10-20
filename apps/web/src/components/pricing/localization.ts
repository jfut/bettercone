/**
 * Pricing Components Localization
 * Centralized localization for all pricing components
 * Following better-auth-ui patterns
 */

import type { 
  PricingDashboardProps,
  PricingCardLocalization,
  PricingHeaderLocalization,
  OrganizationSelectorLocalization
} from "./index";

export interface PricingLocalization {
  dashboard: {
    title: string;
    description: string;
    footer: {
      text: string;
      linkText: string;
    };
  };
  header: PricingHeaderLocalization;
  card: PricingCardLocalization;
  organizationSelector: OrganizationSelectorLocalization;
}

export const defaultPricingLocalization: PricingLocalization = {
  dashboard: {
    title: "Simple, Transparent Pricing",
    description: "Choose the perfect plan for your needs. All plans include a 14-day free trial.",
    footer: {
      text: "Need a custom plan? ",
      linkText: "Contact our sales team"
    }
  },
  header: {
    title: "Choose Your Plan",
    description: "Start free and upgrade as you grow. All plans include a 14-day free trial.",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    savingsText: "Save 20%"
  },
  card: {
    popularBadge: "Most Popular",
    freeLabel: "Free",
    monthlyLabel: "/month",
    yearlyLabel: "/year",
    savingsLabel: (amount) => `Save $${amount}/year`,
    seatsLabel: (min, max) => `per user, ${min}-${max} seats`,
    createOrgFirst: "Create an organization first to purchase team plans",
    processing: "Processing...",
    getStarted: "Get Started",
    startTrial: "Start Free Trial"
  },
  organizationSelector: {
    label: "Select Organization:",
    description: "Team plan will be billed to the selected organization",
    placeholder: "Choose organization..."
  }
};

/**
 * Helper function to merge custom localization with defaults
 */
export function mergePricingLocalization(
  custom?: Partial<PricingLocalization>
): PricingLocalization {
  if (!custom) return defaultPricingLocalization;

  return {
    dashboard: {
      ...defaultPricingLocalization.dashboard,
      ...custom.dashboard,
      footer: {
        ...defaultPricingLocalization.dashboard.footer,
        ...custom.dashboard?.footer
      }
    },
    header: {
      ...defaultPricingLocalization.header,
      ...custom.header
    },
    card: {
      ...defaultPricingLocalization.card,
      ...custom.card
    },
    organizationSelector: {
      ...defaultPricingLocalization.organizationSelector,
      ...custom.organizationSelector
    }
  };
}
