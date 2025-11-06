/**
 * any-auth-client
 * Type for any Better Auth client
 */

import type { 
    Subscription, 
    CheckoutSessionParams, 
    BillingPortalParams 
} from "./subscription"

export interface AnyAuthClient {
    $Infer: {
        Session: {
            session: any
            user: any
        }
    }
    $fetch: (path: string, options?: any) => Promise<any>
    useSession: () => any
    listAccounts: any
    accountInfo: any
    multiSession: any
    listSessions: any
    useListPasskeys: any
    apiKey: any
    useActiveOrganization: any
    useListOrganizations: any
    organization: any
    updateUser: any
    unlinkAccount: any
    passkey: any
    revokeSession: any
    oneTap: any
    signIn: any
    signOut: any
    twoFactor: any
    requestPasswordReset: any;
    changePassword: any;
    deleteUser: any;
    emailOtp: any;
    resetPassword: any;
    signUp: any;
    phoneNumber: any;
    siwe: {
        nonce: (params: { walletAddress: string; chainId?: number }) => Promise<{ data?: { nonce: string }; error?: any }>;
        verify: (params: { message: string; signature: string; walletAddress: string; chainId?: number; email?: string; fetchOptions?: any }, callbacks?: { onSuccess?: () => void; onError?: (ctx: any) => void }) => Promise<any>;
    };
    
    /**
     * Subscription management (optional)
     * Available when using @better-auth/stripe plugin or custom implementation
     * @see https://www.better-auth.com/docs/plugins/stripe
     */
    subscription?: {
        /**
         * Upgrade to a subscription plan
         * Creates a Stripe checkout session and optionally redirects
         */
        upgrade: (params: CheckoutSessionParams) => Promise<{ 
            data?: { 
                url?: string
                sessionId?: string
            }
            error?: Error 
        }>
        
        /**
         * List active subscriptions
         * @param params - Optional parameters
         * @param params.referenceId - Filter by reference ID (user/org ID)
         */
        list: (params?: {
            referenceId?: string
        }) => Promise<{ 
            data?: Subscription[]
            error?: Error 
        }>
        
        /**
         * Cancel a subscription
         * Opens Stripe billing portal where user can cancel
         */
        cancel: (params: {
            referenceId?: string
            subscriptionId?: string
            returnUrl: string
        }) => Promise<{ 
            data?: { url: string }
            error?: Error 
        }>
        
        /**
         * Restore a canceled subscription
         * Reactivates a subscription marked to cancel at period end
         */
        restore: (params: {
            referenceId?: string
            subscriptionId?: string
        }) => Promise<{ 
            data?: Subscription
            error?: Error 
        }>
        
        /**
         * Create billing portal session
         * Returns URL to Stripe billing portal
         */
        billingPortal: (params: BillingPortalParams) => Promise<{ 
            data?: { url: string }
            error?: Error 
        }>
    }
    
    /**
     * Admin management (optional)
     * Available when using @better-auth/admin plugin
     * @see https://www.better-auth.com/docs/plugins/admin
     */
    admin?: {
        /**
         * List users with pagination, search, and filtering
         */
        listUsers: (params?: {
            searchValue?: string
            searchField?: string
            searchOperator?: "contains" | "starts_with" | "ends_with"
            limit?: number
            offset?: number
            sortBy?: string
            sortDirection?: "asc" | "desc"
            filterBy?: Record<string, any>
        }) => Promise<{
            data?: {
                users: any[]
                total: number
            }
            error?: any
        }>
        
        /**
         * Ban a user
         */
        banUser: (params: {
            userId: string
            banReason?: string
            banExpiresIn?: number
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Unban a user
         */
        unbanUser: (params: {
            userId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Delete a user
         */
        removeUser: (params: {
            userId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Impersonate a user
         */
        impersonateUser: (params: {
            userId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Stop impersonating
         */
        stopImpersonating: () => Promise<{
            data?: any
            error?: any
        }>
    }
}
