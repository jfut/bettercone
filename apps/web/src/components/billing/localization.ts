/**
 * Localization types for billing components
 * Following better-auth-ui localization patterns
 */

export interface BillingLocalization {
  // Subscription Card
  currentPlan: string;
  planStatus: string;
  nextBillingDate: string;
  manageBilling: string;
  upgradeNow: string;
  cancelSubscription: string;
  noActiveSubscription: string;
  startSubscription: string;
  viewPlans: string;
  manageSubscription: string;
  billingPortal: string;
  
  // Payment Method Card
  paymentMethod: string;
  managePaymentDescription: string;
  configuredInStripe: string;
  manageViaPortal: string;
  stripe: string;
  organizationBilling: string;
  updatePaymentMethod: string;
  
  // Invoice History Card
  viewDownloadInvoices: string;
  invoicesAppearHere: string;
  viewAllInvoices: string;
  
  // Usage Card
  usage: string;
  limit: string;
  remaining: string;
  unlimited: string;
  usageWarning: string;
  upgradeToIncreaseLimit: string;
  
  // Billing Portal
  openBillingPortal: string;
  managingBilling: string;
  
  // Invoice History
  invoiceHistory: string;
  date: string;
  amount: string;
  status: string;
  download: string;
  noInvoices: string;
  
  // Pricing Card
  perMonth: string;
  perYear: string;
  mostPopular: string;
  currentPlanBadge: string;
  selectPlan: string;
  contactSales: string;
  
  // Status Labels
  active: string;
  canceled: string;
  pastDue: string;
  trialing: string;
  incomplete: string;
  unpaid: string;
  paused: string;
}

export const defaultBillingLocalization: BillingLocalization = {
  // Subscription Card
  currentPlan: "Current Plan",
  planStatus: "Status",
  nextBillingDate: "Next Billing Date",
  manageBilling: "Manage Billing",
  upgradeNow: "Upgrade Now",
  cancelSubscription: "Cancel Subscription",
  noActiveSubscription: "You don't have an active subscription",
  startSubscription: "Start a subscription to access premium features",
  viewPlans: "View Plans",
  manageSubscription: "Manage Subscription",
  billingPortal: "Billing Portal",
  
  // Payment Method Card
  paymentMethod: "Payment Method",
  managePaymentDescription: "Manage your payment methods and billing information",
  configuredInStripe: "Configured in Stripe",
  manageViaPortal: "Manage via billing portal",
  stripe: "Stripe",
  organizationBilling: "Payment method for",
  updatePaymentMethod: "Update Payment Method",
  
  // Invoice History Card
  viewDownloadInvoices: "View and download your invoices",
  invoicesAppearHere: "Invoices will appear here after your first payment",
  viewAllInvoices: "View All Invoices",
  
  // Usage Card
  usage: "Usage",
  limit: "Limit",
  remaining: "Remaining",
  unlimited: "Unlimited",
  usageWarning: "You're approaching your plan limit",
  upgradeToIncreaseLimit: "Upgrade to increase your limit",
  
  // Billing Portal
  openBillingPortal: "Open Billing Portal",
  managingBilling: "Managing billing...",
  
  // Invoice History
  invoiceHistory: "Invoice History",
  date: "Date",
  amount: "Amount",
  status: "Status",
  download: "Download",
  noInvoices: "No invoices yet",
  
  // Pricing Card
  perMonth: "per month",
  perYear: "per year",
  mostPopular: "Most Popular",
  currentPlanBadge: "Current Plan",
  selectPlan: "Select Plan",
  contactSales: "Contact Sales",
  
  // Status Labels
  active: "Active",
  canceled: "Canceled",
  pastDue: "Past Due",
  trialing: "Trial",
  incomplete: "Incomplete",
  unpaid: "Unpaid",
  paused: "Paused",
};
