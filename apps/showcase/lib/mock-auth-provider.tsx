"use client";

import { ReactNode } from "react";
import { 
  mockUser, 
  mockSession, 
  mockOrganization, 
  mockMembers, 
  mockSessions, 
  mockPasskeys, 
  mockApiKeys, 
  mockInvoices, 
  mockSubscription, 
  mockInvitations,
  mockPaymentMethod,
  mockAccounts,
  mockProviders,
} from "./mock-data";

// Create a mock auth client that returns mock data
// This must be a static object, not recreated on each render
export const mockAuthClient = {
  useSession: () => ({
    data: {
      session: mockSession,
      user: mockUser,
    },
    isPending: false,
    error: undefined,
    refetch: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
  }),
  
  useActiveOrganization: () => ({
    data: {
      organization: mockOrganization,
      member: mockMembers[0],
    },
    isPending: false,
    error: undefined,
    refetch: async () => ({ data: { organization: mockOrganization, member: mockMembers[0] }, error: null }),
  }),
  
  useListOrganizations: () => ({
    data: [mockOrganization],
    isPending: false,
    error: undefined,
  }),
  
  useListSessions: () => ({
    data: mockSessions,
    isPending: false,
    error: undefined,
  }),
  
  useListPasskeys: () => ({
    data: mockPasskeys,
    isPending: false,
    error: undefined,
  }),
    
  
  organization: {
    useListMembers: () => ({
      data: mockMembers,
      isPending: false,
      error: undefined,
    }),
    
    useListInvitations: () => ({
      data: mockInvitations,
      isPending: false,
      error: undefined,
    }),
    
    inviteMember: async () => ({ data: mockInvitations[0], error: null }),
    removeMember: async () => ({ data: null, error: null }),
    updateMemberRole: async () => ({ data: mockMembers[0], error: null }),
    cancelInvitation: async () => ({ data: null, error: null }),
    create: async () => ({ data: mockOrganization, error: null }),
    update: async () => ({ data: mockOrganization, error: null }),
    delete: async () => ({ data: null, error: null }),
    setActive: async () => ({ data: mockOrganization, error: null }),
    leaveOrganization: async () => ({ data: null, error: null }),
  },    passkey: {
      addPasskey: async () => ({ data: mockPasskeys[0], error: null }),
      listPasskeys: async () => ({ data: mockPasskeys, error: null }),
      deletePasskey: async () => ({ data: null, error: null }),
    },
    
    signOut: async () => ({ data: null, error: null }),
    signIn: {
      email: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
      social: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
    },
    signUp: {
      email: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
    },
    
    updateUser: async () => ({ data: mockUser, error: null }),
    changePassword: async () => ({ data: null, error: null }),
    changeEmail: async () => ({ data: null, error: null }),
    
    session: {
      revoke: async () => ({ data: null, error: null }),
      revokeAll: async () => ({ data: null, error: null }),
      revokeSessions: async () => ({ data: null, error: null }),
    },
    
    // Subscription hooks for billing components
    subscription: {
      useSubscription: () => ({
        data: mockSubscription,
        isPending: false,
        error: null,
      }),
      getSubscription: async () => ({ data: mockSubscription, error: null }),
      list: async () => ({ data: [mockSubscription], error: null }),
      get: async () => ({ data: mockSubscription, error: null }),
      cancel: async () => ({ data: mockSubscription, error: null }),
      resume: async () => ({ data: mockSubscription, error: null }),
      update: async () => ({ data: mockSubscription, error: null }),
    },
    
    // Payment method hooks
    billing: {
      usePaymentMethod: () => ({
        data: mockPaymentMethod,
        isPending: false,
        error: null,
      }),
      useInvoices: () => ({
        data: mockInvoices,
        isPending: false,
        error: null,
      }),
    },
    
    // Account hooks
    useAccounts: () => ({
      data: mockAccounts,
      isPending: false,
      error: null,
    }),
    
  // Provider hooks
  useProviders: () => ({
    data: mockProviders,
    isPending: false,
    error: undefined,
  }),
  
  // Admin methods
  admin: {
    listUsers: async (params?: { 
      searchValue?: string; 
      searchField?: string;
      limit?: number;
      offset?: number;
    }) => {
      const { mockAdminUsers } = await import("./mock-data");
      let users = [...mockAdminUsers];
      
      // Apply search filter
      if (params?.searchValue && params?.searchField) {
        const searchLower = params.searchValue.toLowerCase();
        users = users.filter((user) => {
          const fieldValue = user[params.searchField as keyof typeof user];
          return fieldValue && String(fieldValue).toLowerCase().includes(searchLower);
        });
      }
      
      // Apply pagination
      const offset = params?.offset || 0;
      const limit = params?.limit || 10;
      const paginatedUsers = users.slice(offset, offset + limit);
      
      return {
        data: {
          users: paginatedUsers,
          total: users.length,
        },
        error: null,
      };
    },
    
    banUser: async () => {
      return { data: null, error: null };
    },
    
    unbanUser: async () => {
      return { data: null, error: null };
    },
    
    removeUser: async () => {
      return { data: null, error: null };
    },
    
    impersonateUser: async () => {
      return { data: { session: mockSession, user: mockUser }, error: null };
    },
  },
  
  // Device authorization methods
  device: Object.assign(
    async ({ query }: { query: { user_code: string } }) => {
      // Mock device verification
      return {
        data: {
          clientId: "demo-cli-app",
          scope: "openid profile email",
        },
        error: null,
      };
    },
    {
      code: async ({ client_id, scope }: { client_id: string; scope?: string }) => {
        // Mock device code generation
        return {
          data: {
            device_code: "abc123def456ghi789jkl012mno345pqr678",
            user_code: "ABCD1234",
            verification_uri: "https://demo.better-auth.com/device",
            verification_uri_complete: "https://demo.better-auth.com/device?user_code=ABCD1234",
            expires_in: 1800,
            interval: 5,
          },
          error: null,
        };
      },
      token: async ({ device_code }: { device_code: string; grant_type: string; client_id: string }) => {
        // Mock token polling
        return {
          data: null,
          error: { message: "authorization_pending" },
        };
      },
      approve: async ({ userCode }: { userCode: string }) => {
        // Mock device approval
        return {
          data: { success: true },
          error: null,
        };
      },
      deny: async ({ userCode }: { userCode: string }) => {
        // Mock device denial
        return {
          data: { success: true },
          error: null,
        };
      },
    }
  ),
  
  $fetch: async (url: string) => {
    // Mock wallet API endpoints
    if (url === "/api/auth/wallets") {
      const { mockWalletConnections } = await import("./mock-data");
      return { wallets: mockWalletConnections };
    }
    if (url === "/api/auth/wallets/connect") {
      return { data: null, error: null };
    }
    if (url === "/api/auth/wallets/disconnect") {
      return { data: null, error: null };
    }
    return { data: null, error: null };
  },
};
