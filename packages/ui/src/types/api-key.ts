/**
 * API Key type
 * Type for API keys in the system
 */

export interface ApiKey {
    id: string
    name: string
    key?: string
    start?: string
    createdAt: Date
    updatedAt: Date
    expiresAt?: Date | null
    organizationId?: string | null
    metadata?: any
}
