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
