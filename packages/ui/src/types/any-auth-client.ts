/**
 * any-auth-client
 * Type for any Better Auth client
 */

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

    /**
     * Device Authorization (optional)
     * Available when using @better-auth/device-authorization plugin
     * OAuth 2.0 Device Authorization Grant (RFC 8628)
     * @see https://www.better-auth.com/docs/plugins/device-authorization
     */
    device?: {
        /**
         * Verify user code validity
         * @param params - Query parameters
         * @param params.query.user_code - The user code to verify
         */
        (params: {
            query: { user_code: string }
        }): Promise<{
            data?: {
                clientId?: string
                scope?: string
            }
            error?: any
        }>
        
        /**
         * Request device and user codes
         * Initiates the device authorization flow
         */
        code: (params: {
            client_id: string
            scope?: string
        }) => Promise<{
            data?: {
                device_code: string
                user_code: string
                verification_uri: string
                verification_uri_complete?: string
                expires_in: number
                interval: number
            }
            error?: {
                error: string
                error_description?: string
            }
        }>
        
        /**
         * Poll for access token
         * Device polls this endpoint to check authorization status
         */
        token: (params: {
            grant_type: string
            device_code: string
            client_id: string
        }) => Promise<{
            data?: {
                access_token?: string
                token_type?: string
                expires_in?: number
            }
            error?: {
                error: "authorization_pending" | "slow_down" | "expired_token" | "access_denied" | "invalid_grant"
                error_description?: string
            }
        }>
        
        /**
         * Approve device authorization request
         * User must be authenticated to approve
         */
        approve: (params: {
            userCode: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Deny device authorization request
         * User must be authenticated to deny
         */
        deny: (params: {
            userCode: string
        }) => Promise<{
            data?: any
            error?: any
        }>
    }

    /**
     * SSO (Single Sign-On) (optional)
     * Available when using @better-auth/sso plugin
     * Supports OIDC, OAuth2, and SAML 2.0 providers
     * @see https://www.better-auth.com/docs/plugins/sso
     */
    sso?: {
        /**
         * Register a new SSO provider (OIDC or SAML)
         */
        register: (params: {
            providerId: string
            issuer: string
            domain: string
            organizationId?: string
            oidcConfig?: {
                clientId: string
                clientSecret: string
                authorizationEndpoint: string
                tokenEndpoint: string
                jwksEndpoint?: string
                discoveryEndpoint?: string
                scopes?: string[]
                pkce?: boolean
                mapping?: {
                    id?: string
                    email?: string
                    emailVerified?: string
                    name?: string
                    image?: string
                    extraFields?: Record<string, string>
                }
            }
            samlConfig?: {
                entryPoint: string
                cert: string
                callbackUrl: string
                audience?: string
                wantAssertionsSigned?: boolean
                signatureAlgorithm?: string
                digestAlgorithm?: string
                identifierFormat?: string
                idpMetadata?: {
                    metadata: string
                    privateKey?: string
                    privateKeyPass?: string
                    isAssertionEncrypted?: boolean
                    encPrivateKey?: string
                    encPrivateKeyPass?: string
                }
                spMetadata?: {
                    metadata: string
                    binding?: string
                    privateKey?: string
                    privateKeyPass?: string
                    isAssertionEncrypted?: boolean
                    encPrivateKey?: string
                    encPrivateKeyPass?: string
                }
                mapping?: {
                    id?: string
                    email?: string
                    name?: string
                    firstName?: string
                    lastName?: string
                    emailVerified?: string
                    extraFields?: Record<string, string>
                }
            }
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * List registered SSO providers
         */
        listProviders: (params?: {
            domain?: string
            organizationId?: string
        }) => Promise<{
            data?: Array<{
                id: string
                providerId: string
                issuer: string
                domain: string
                organizationId?: string
                userId: string
            }>
            error?: any
        }>
        
        /**
         * Get SSO provider details
         */
        getProvider: (params: {
            providerId: string
        }) => Promise<{
            data?: {
                id: string
                providerId: string
                issuer: string
                domain: string
                oidcConfig?: any
                samlConfig?: any
                organizationId?: string
            }
            error?: any
        }>
        
        /**
         * Update SSO provider
         */
        updateProvider: (params: {
            providerId: string
            issuer?: string
            domain?: string
            oidcConfig?: any
            samlConfig?: any
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Delete SSO provider
         */
        deleteProvider: (params: {
            providerId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Test SSO connection
         */
        testConnection: (params: {
            providerId: string
        }) => Promise<{
            data?: {
                success: boolean
                message?: string
            }
            error?: any
        }>
        
        /**
         * Get SAML Service Provider metadata
         */
        spMetadata: (params: {
            providerId: string
            format?: "xml" | "json"
        }) => Promise<{
            data?: string | any
            error?: any
        }>
    }

    /**
     * OAuth2 / OIDC Provider (optional)
     * Available when using better-auth/plugins oidcProvider
     * Allows your app to act as an OAuth2/OIDC provider
     * @see https://www.better-auth.com/docs/plugins/oidc-provider
     */
    oauth2?: {
        /**
         * Register a new OAuth2/OIDC client application
         * Supports RFC7591 compliant dynamic client registration
         */
        register: (params: {
            redirect_uris: string[]
            token_endpoint_auth_method?: "none" | "client_secret_basic" | "client_secret_post"
            grant_types?: Array<
                | "authorization_code"
                | "implicit"
                | "password"
                | "client_credentials"
                | "refresh_token"
                | "urn:ietf:params:oauth:grant-type:jwt-bearer"
                | "urn:ietf:params:oauth:grant-type:saml2-bearer"
            >
            response_types?: Array<"code" | "token">
            client_name?: string
            client_uri?: string
            logo_uri?: string
            scope?: string
            contacts?: string[]
            tos_uri?: string
            policy_uri?: string
            jwks_uri?: string
            jwks?: Record<string, any>
        }) => Promise<{
            data?: {
                client_id: string
                client_secret?: string
                client_name?: string
                redirect_uris: string[]
                grant_types?: string[]
                response_types?: string[]
                token_endpoint_auth_method?: string
            }
            error?: any
        }>
        
        /**
         * List registered OAuth2 clients
         */
        listClients: () => Promise<{
            data?: Array<{
                id: string
                clientId: string
                name: string
                type: string
                redirectURLs: string[]
                disabled: boolean
                createdAt: Date
            }>
            error?: any
        }>
        
        /**
         * Get OAuth2 client details
         */
        getClient: (params: {
            clientId: string
        }) => Promise<{
            data?: {
                id: string
                clientId: string
                name: string
                type: string
                redirectURLs: string[]
                metadata?: any
                disabled: boolean
            }
            error?: any
        }>
        
        /**
         * Update OAuth2 client
         */
        updateClient: (params: {
            clientId: string
            name?: string
            redirectURLs?: string[]
            disabled?: boolean
            metadata?: any
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Delete OAuth2 client
         */
        deleteClient: (params: {
            clientId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Revoke OAuth2 client (disable without deletion)
         */
        revokeClient: (params: {
            clientId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
        
        /**
         * Handle OAuth2 consent
         * Accept or deny authorization request
         */
        consent: (params: {
            accept: boolean
            consent_code?: string
        }) => Promise<{
            data?: {
                redirect_uri?: string
            }
            error?: any
        }>
        
        /**
         * List active OAuth2 access tokens for current user
         */
        listTokens: () => Promise<{
            data?: Array<{
                id: string
                clientId: string
                scopes: string[]
                accessTokenExpiresAt: Date
                createdAt: Date
            }>
            error?: any
        }>
        
        /**
         * Revoke OAuth2 access token
         */
        revokeToken: (params: {
            tokenId: string
        }) => Promise<{
            data?: any
            error?: any
        }>
    }
}

