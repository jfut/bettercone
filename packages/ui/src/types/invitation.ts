/**
 * Invitation type
 * Type for organization invitations
 */

export interface Invitation {
    id: string
    email: string
    role: string
    status: string
    organizationId: string
    inviterId: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}
