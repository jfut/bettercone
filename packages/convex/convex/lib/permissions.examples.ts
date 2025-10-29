/**
 * Permission Middleware Usage Examples
 * 
 * These examples show how to use the permission helpers in Convex mutations and queries
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import {
  requireRole,
  requireOwner,
  requireCanRemoveMember,
  canManageMembers,
  canManageBilling,
  getRolePermissions,
  type Role,
} from "./permissions";

/**
 * Example: Remove a team member (with permission check)
 */
export const removeMember = mutation({
  args: {
    organizationId: v.string(),
    memberId: v.string(),
    currentUserRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    targetMemberRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Check if user has permission to remove this member
    requireCanRemoveMember(args.currentUserRole, args.targetMemberRole);

    // Proceed with removal
    // Implementation would query member table and delete
    
    return { success: true };
  },
});

/**
 * Example: Update organization settings (admin required)
 */
export const updateOrganizationSettings = mutation({
  args: {
    organizationId: v.string(),
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    name: v.optional(v.string()),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Require admin or owner role
    requireRole(args.userRole, "admin");

    // Proceed with update
    // Implementation would update organization table
    
    return { success: true };
  },
});

/**
 * Example: Delete organization (owner only)
 */
export const deleteOrganization = mutation({
  args: {
    organizationId: v.string(),
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Require owner role
    requireOwner(args.userRole);

    // Proceed with deletion
    // Implementation would delete organization and all related data
    
    return { success: true };
  },
});

/**
 * Example: Update billing (owner only)
 */
export const updateBilling = mutation({
  args: {
    organizationId: v.string(),
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    plan: v.string(),
  },
  handler: async (ctx, args) => {
    // Only owners can manage billing
    if (!canManageBilling(args.userRole)) {
      throw new Error("Only organization owners can manage billing");
    }

    // Proceed with billing update
    // Implementation would call Stripe API
    
    return { success: true };
  },
});

/**
 * Example: Invite team member (admin or owner required)
 */
export const inviteMember = mutation({
  args: {
    organizationId: v.string(),
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    email: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Check if user can manage members
    if (!canManageMembers(args.userRole)) {
      throw new Error("Only admins and owners can invite members");
    }

    // Prevent admins from inviting owners or other admins
    if (args.userRole === "admin" && args.role !== "member") {
      throw new Error("Admins can only invite members");
    }

    // Proceed with invitation
    // Implementation would create invitation record
    
    return { success: true, invitationId: "inv_123" };
  },
});

/**
 * Example: Get user permissions (query)
 * Frontend can use this to show/hide UI elements
 */
export const getUserPermissions = query({
  args: {
    organizationId: v.string(),
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Return all permissions for the user's role
    return getRolePermissions(args.userRole);
  },
});

/**
 * Example: Check specific permission (query)
 */
export const canUserPerformAction = query({
  args: {
    userRole: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    action: v.union(
      v.literal("manage_members"),
      v.literal("manage_billing"),
      v.literal("delete_organization"),
      v.literal("update_settings"),
      v.literal("manage_api_keys")
    ),
  },
  handler: async (ctx, args) => {
    const permissions = getRolePermissions(args.userRole);
    
    switch (args.action) {
      case "manage_members":
        return permissions.canManageMembers;
      case "manage_billing":
        return permissions.canManageBilling;
      case "delete_organization":
        return permissions.canDeleteOrganization;
      case "update_settings":
        return permissions.canUpdateSettings;
      case "manage_api_keys":
        return permissions.canManageApiKeys;
      default:
        return false;
    }
  },
});
