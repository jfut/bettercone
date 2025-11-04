/**
 * Subscription types compatible with Better Auth Stripe plugin
 * @see https://www.better-auth.com/docs/plugins/stripe
 */

/**
 * Subscription status from Stripe
 */
export type SubscriptionStatus = 
    | "incomplete" 
    | "incomplete_expired"
    | "trialing" 
    | "active" 
    | "past_due" 
    | "canceled" 
    | "unpaid"

/**
 * Subscription data structure
 * Compatible with Better Auth Stripe plugin schema
 */
export interface Subscription {
    /**
     * Unique identifier for the subscription
     */
    id: string
    
    /**
     * Plan name (e.g., "pro", "team", "enterprise")
     */
    plan: string
    
    /**
     * Reference ID (user ID or organization ID)
     */
    referenceId: string
    
    /**
     * Stripe customer ID
     */
    stripeCustomerId?: string
    
    /**
     * Stripe subscription ID
     */
    stripeSubscriptionId?: string
    
    /**
     * Current subscription status
     */
    status: SubscriptionStatus
    
    /**
     * Start of current billing period
     */
    periodStart?: Date
    
    /**
     * End of current billing period
     */
    periodEnd?: Date
    
    /**
     * Whether subscription will cancel at period end
     */
    cancelAtPeriodEnd?: boolean
    
    /**
     * Number of seats (for team plans)
     */
    seats?: number
    
    /**
     * Trial start date
     */
    trialStart?: Date
    
    /**
     * Trial end date
     */
    trialEnd?: Date
    
    /**
     * Created timestamp
     */
    createdAt?: Date
    
    /**
     * Updated timestamp
     */
    updatedAt?: Date
}

/**
 * Payment method types
 */
export type PaymentMethodType = "card" | "bank_account" | "paypal" | "us_bank_account"

/**
 * Payment method data structure
 */
export interface PaymentMethod {
    /**
     * Unique identifier for the payment method
     */
    id: string
    
    /**
     * Payment method type
     */
    type: PaymentMethodType
    
    /**
     * Last 4 digits of card/account
     */
    last4?: string
    
    /**
     * Card brand (Visa, Mastercard, etc.)
     */
    brand?: string
    
    /**
     * Card expiry month (1-12)
     */
    expiryMonth?: number
    
    /**
     * Card expiry year
     */
    expiryYear?: number
    
    /**
     * Whether this is the default payment method
     */
    isDefault?: boolean
    
    /**
     * Stripe payment method ID
     */
    stripePaymentMethodId?: string
}

/**
 * Invoice status from Stripe
 */
export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible"

/**
 * Invoice data structure
 */
export interface Invoice {
    /**
     * Unique identifier for the invoice
     */
    id: string
    
    /**
     * Invoice number
     */
    number?: string
    
    /**
     * Total amount in smallest currency unit (cents)
     */
    amount: number
    
    /**
     * Amount paid
     */
    amountPaid?: number
    
    /**
     * Amount remaining
     */
    amountRemaining?: number
    
    /**
     * Currency code (USD, EUR, etc.)
     */
    currency: string
    
    /**
     * Invoice status
     */
    status: InvoiceStatus
    
    /**
     * Invoice creation date
     */
    createdAt: Date
    
    /**
     * Invoice due date
     */
    dueDate?: Date
    
    /**
     * Date invoice was paid
     */
    paidAt?: Date
    
    /**
     * Hosted invoice URL (Stripe)
     */
    invoiceUrl?: string
    
    /**
     * PDF download URL
     */
    invoicePdf?: string
    
    /**
     * Stripe invoice ID
     */
    stripeInvoiceId?: string
    
    /**
     * Description
     */
    description?: string
}

/**
 * Subscription plan configuration
 */
export interface SubscriptionPlan {
    /**
     * Plan name
     */
    name: string
    
    /**
     * Stripe price ID
     */
    priceId?: string
    
    /**
     * Stripe price lookup key (alternative to priceId)
     */
    lookupKey?: string
    
    /**
     * Annual discount price ID
     */
    annualDiscountPriceId?: string
    
    /**
     * Annual discount lookup key
     */
    annualDiscountLookupKey?: string
    
    /**
     * Plan limits/features
     */
    limits?: Record<string, number | boolean | string>
    
    /**
     * Plan group/category
     */
    group?: string
    
    /**
     * Free trial configuration
     */
    freeTrial?: {
        days: number
    }
}

/**
 * Checkout session parameters
 */
export interface CheckoutSessionParams {
    /**
     * Plan name to subscribe to
     */
    plan: string
    
    /**
     * Upgrade to annual plan
     */
    annual?: boolean
    
    /**
     * Reference ID (user/org ID)
     */
    referenceId?: string
    
    /**
     * Existing subscription ID (for upgrades)
     */
    subscriptionId?: string
    
    /**
     * Number of seats
     */
    seats?: number
    
    /**
     * Success redirect URL
     */
    successUrl: string
    
    /**
     * Cancel redirect URL
     */
    cancelUrl: string
    
    /**
     * Return URL for billing portal
     */
    returnUrl?: string
    
    /**
     * Disable automatic redirect
     */
    disableRedirect?: boolean
    
    /**
     * Custom metadata
     */
    metadata?: Record<string, any>
}

/**
 * Billing portal session parameters
 */
export interface BillingPortalParams {
    /**
     * Locale for billing portal (IETF language tag)
     */
    locale?: string
    
    /**
     * Reference ID (user/org ID)
     */
    referenceId?: string
    
    /**
     * Return URL
     */
    returnUrl?: string
}
