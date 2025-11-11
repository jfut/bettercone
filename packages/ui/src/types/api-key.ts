/**
 * API Key type
 * Type for API keys in the system (Better Auth native fields)
 */

export interface ApiKey {
    id: string
    name?: string
    key?: string // Only returned on creation
    start?: string // First few characters for display
    prefix?: string
    userId: string
    
    // Usage & Refill (Better Auth native)
    remaining?: number | null // Requests remaining
    refillAmount?: number | null // Amount to refill
    refillInterval?: number | null // Interval in ms
    lastRefillAt?: Date | null
    
    // Rate Limiting (Better Auth native)
    rateLimitEnabled: boolean
    rateLimitTimeWindow?: number | null // Window in ms
    rateLimitMax?: number | null // Max requests per window
    requestCount: number // Current count in window
    lastRequest?: Date | null
    
    // Expiration (Better Auth native)
    expiresAt?: Date | null
    
    // Status (Better Auth native)
    enabled: boolean
    
    // Permissions (Better Auth native)
    permissions?: string | null // JSON string
    
    // Metadata (Better Auth native)
    metadata?: any
    
    // Timestamps
    createdAt: Date
    updatedAt: Date
}
