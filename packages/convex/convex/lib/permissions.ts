/**
 * Role-Based Permission Helpers
 * 
 * Reusable permission checking for organization members
 */

export type Role = "owner" | "admin" | "member";

/**
 * Role hierarchy for permission checking
 * Higher number = more permissions
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

/**
 * Check if a role has at least the required permission level
 * 
 * @example
 * hasRole("admin", "member") // true - admin can do member actions
 * hasRole("member", "admin") // false - member cannot do admin actions
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if a role is exactly the specified role (strict check)
 */
export function isRole(userRole: Role, targetRole: Role): boolean {
  return userRole === targetRole;
}

/**
 * Check if user is an owner
 */
export function isOwner(role: Role): boolean {
  return role === "owner";
}

/**
 * Check if user is an admin or owner
 */
export function isAdminOrOwner(role: Role): boolean {
  return role === "admin" || role === "owner";
}

/**
 * Check if user can manage members (invite, remove)
 * Owners and admins can manage members
 */
export function canManageMembers(role: Role): boolean {
  return hasRole(role, "admin");
}

/**
 * Check if user can manage billing
 * Only owners can manage billing
 */
export function canManageBilling(role: Role): boolean {
  return role === "owner";
}

/**
 * Check if user can delete the organization
 * Only owners can delete
 */
export function canDeleteOrganization(role: Role): boolean {
  return role === "owner";
}

/**
 * Check if user can update organization settings
 * Owners and admins can update settings
 */
export function canUpdateSettings(role: Role): boolean {
  return hasRole(role, "admin");
}

/**
 * Check if user can manage API keys
 * Owners and admins can manage API keys
 */
export function canManageApiKeys(role: Role): boolean {
  return hasRole(role, "admin");
}

/**
 * Check if user can view analytics
 * All members can view basic analytics
 * Owners and admins can view detailed analytics
 */
export function canViewAnalytics(role: Role, detailed: boolean = false): boolean {
  if (detailed) {
    return hasRole(role, "admin");
  }
  return true; // All members can view basic analytics
}

/**
 * Check if user can change member roles
 * Only owners can change roles
 */
export function canChangeRoles(role: Role): boolean {
  return role === "owner";
}

/**
 * Check if user can remove a specific member
 * Owners can remove anyone
 * Admins can remove members (but not other admins or owners)
 */
export function canRemoveMember(userRole: Role, targetRole: Role): boolean {
  if (userRole === "owner") {
    return true; // Owners can remove anyone
  }
  if (userRole === "admin") {
    return targetRole === "member"; // Admins can only remove members
  }
  return false; // Members cannot remove anyone
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role) {
  return {
    canManageMembers: canManageMembers(role),
    canManageBilling: canManageBilling(role),
    canDeleteOrganization: canDeleteOrganization(role),
    canUpdateSettings: canUpdateSettings(role),
    canManageApiKeys: canManageApiKeys(role),
    canViewBasicAnalytics: canViewAnalytics(role, false),
    canViewDetailedAnalytics: canViewAnalytics(role, true),
    canChangeRoles: canChangeRoles(role),
  };
}

/**
 * Permission error messages
 */
export const PERMISSION_ERRORS = {
  INSUFFICIENT_PERMISSIONS: "You don't have permission to perform this action",
  OWNER_ONLY: "Only organization owners can perform this action",
  ADMIN_ONLY: "Only administrators can perform this action",
  CANNOT_REMOVE_OWNER: "Cannot remove the organization owner",
  CANNOT_REMOVE_HIGHER_ROLE: "Cannot remove members with higher or equal permissions",
} as const;

/**
 * Throw an error if user doesn't have required role
 * Use in server actions and API routes
 * 
 * @example
 * requireRole(memberRole, "admin"); // Throws if not admin or owner
 */
export function requireRole(userRole: Role, requiredRole: Role): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new Error(PERMISSION_ERRORS.INSUFFICIENT_PERMISSIONS);
  }
}

/**
 * Throw an error if user is not owner
 * 
 * @example
 * requireOwner(memberRole); // Throws if not owner
 */
export function requireOwner(userRole: Role): void {
  if (!isOwner(userRole)) {
    throw new Error(PERMISSION_ERRORS.OWNER_ONLY);
  }
}

/**
 * Throw an error if user cannot remove target member
 * 
 * @example
 * requireCanRemoveMember(adminRole, memberRole); // OK
 * requireCanRemoveMember(adminRole, ownerRole); // Throws
 */
export function requireCanRemoveMember(userRole: Role, targetRole: Role): void {
  if (!canRemoveMember(userRole, targetRole)) {
    throw new Error(PERMISSION_ERRORS.CANNOT_REMOVE_HIGHER_ROLE);
  }
}
