/**
 * Profile type
 * Basic user profile information
 */

import type { User } from "./auth-client"

export type Profile = User & {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    emailVerified?: boolean
    createdAt?: Date
    updatedAt?: Date
}
