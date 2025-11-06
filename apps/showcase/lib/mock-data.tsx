"use client";

import { createContext, useContext, ReactNode } from "react";

// Mock user data
export const mockUser = {
  id: "user_demo_123",
  email: "demo@bettercone.com",
  name: "Alex Johnson",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  emailVerified: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date(),
  phoneNumber: "+1 (555) 123-4567",
  phoneNumberVerified: true,
  twoFactorEnabled: false,
};

// Mock additional users for team display
export const mockUsers = [
  mockUser,
  {
    id: "user_demo_456",
    email: "sarah.chen@bettercone.com",
    name: "Sarah Chen",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    emailVerified: true,
  },
  {
    id: "user_demo_789",
    email: "mike.wilson@bettercone.com",
    name: "Mike Wilson",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    emailVerified: true,
  },
  {
    id: "user_demo_101",
    email: "lisa.parker@bettercone.com",
    name: "Lisa Parker",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    emailVerified: false,
  },
];

// Mock session data
export const mockSession = {
  id: "session_current_123",
  userId: "user_demo_123",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  token: "mock_session_token_abc123",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0",
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

// Mock organizations
export const mockOrganizations = [
  {
    id: "org_demo_123",
    name: "Acme Corporation",
    slug: "acme-corp",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Acme",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
    metadata: {
      industry: "Technology",
      size: "50-100",
      website: "https://acme-corp.example.com",
    },
  },
  {
    id: "org_demo_456",
    name: "TechStart Inc",
    slug: "techstart",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechStart",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    metadata: {
      industry: "SaaS",
      size: "10-50",
    },
  },
];

export const mockOrganization = mockOrganizations[0];

// Mock organization members
export const mockMembers = [
  {
    id: "member_1",
    userId: "user_demo_123",
    organizationId: "org_demo_123",
    role: "owner",
    user: mockUsers[0],
    createdAt: new Date("2024-01-01"),
    invitedBy: null,
  },
  {
    id: "member_2",
    userId: "user_demo_456",
    organizationId: "org_demo_123",
    role: "admin",
    user: mockUsers[1],
    createdAt: new Date("2024-01-15"),
    invitedBy: "user_demo_123",
  },
  {
    id: "member_3",
    userId: "user_demo_789",
    organizationId: "org_demo_123",
    role: "member",
    user: mockUsers[2],
    createdAt: new Date("2024-02-01"),
    invitedBy: "user_demo_123",
  },
  {
    id: "member_4",
    userId: "user_demo_101",
    organizationId: "org_demo_123",
    role: "member",
    user: mockUsers[3],
    createdAt: new Date("2024-03-01"),
    invitedBy: "user_demo_456",
  },
];

// Mock invitations
export const mockInvitations = [
  {
    id: "invite_1",
    organizationId: "org_demo_123",
    email: "john.doe@example.com",
    role: "member",
    status: "pending",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    invitedBy: "user_demo_123",
    invitedByName: "Alex Johnson",
  },
  {
    id: "invite_2",
    organizationId: "org_demo_123",
    email: "jane.smith@example.com",
    role: "admin",
    status: "pending",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    invitedBy: "user_demo_123",
    invitedByName: "Alex Johnson",
  },
];

// Mock sessions (multiple devices)
export const mockSessions = [
  {
    id: "session_current_123",
    userId: "user_demo_123",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    device: "Desktop",
    browser: "Chrome",
    os: "macOS",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isCurrent: true,
    lastActive: new Date(),
  },
  {
    id: "session_mobile_456",
    userId: "user_demo_123",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ipAddress: "192.168.1.101",
    location: "San Francisco, CA",
    device: "Mobile",
    browser: "Safari",
    os: "iOS",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isCurrent: false,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "session_old_789",
    userId: "user_demo_123",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
    ipAddress: "203.0.113.45",
    location: "New York, NY",
    device: "Desktop",
    browser: "Firefox",
    os: "Windows",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isCurrent: false,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Mock passkeys
export const mockPasskeys = [
  {
    id: "passkey_1",
    userId: "user_demo_123",
    name: "MacBook Pro (Touch ID)",
    credentialID: "cred_macbook_123",
    publicKey: "mock_public_key_123",
    counter: 42,
    createdAt: new Date("2024-03-01"),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    transports: ["internal"],
  },
  {
    id: "passkey_2",
    userId: "user_demo_123",
    name: "iPhone 15 Pro (Face ID)",
    credentialID: "cred_iphone_456",
    publicKey: "mock_public_key_456",
    counter: 28,
    createdAt: new Date("2024-03-15"),
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    transports: ["internal", "hybrid"],
  },
  {
    id: "passkey_3",
    userId: "user_demo_123",
    name: "YubiKey 5C",
    credentialID: "cred_yubikey_789",
    publicKey: "mock_public_key_789",
    counter: 15,
    createdAt: new Date("2024-02-01"),
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    transports: ["usb", "nfc"],
  },
];

// Mock API keys
export const mockApiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    key: "sk_live_*********************abc123",
    prefix: "sk_live_",
    createdAt: new Date("2024-02-01"),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: null,
    permissions: ["read", "write"],
    isActive: true,
  },
  {
    id: "key_2",
    name: "Development Key",
    key: "sk_test_*********************def456",
    prefix: "sk_test_",
    createdAt: new Date("2024-03-01"),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    permissions: ["read"],
    isActive: true,
  },
  {
    id: "key_3",
    name: "Legacy Key (Revoked)",
    key: "sk_live_*********************xyz789",
    prefix: "sk_live_",
    createdAt: new Date("2024-01-01"),
    lastUsed: new Date("2024-02-15"),
    expiresAt: null,
    permissions: ["read", "write"],
    isActive: false,
  },
];

// Mock subscription plans (Better Auth v0.3.0 format)
export const mockPlans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out the platform",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "USD",
    features: [
      "Up to 1,000 API calls/month",
      "1 GB storage",
      "Community support",
      "Basic analytics",
    ],
    maxUsers: 1,
    maxProjects: 3,
    storageGb: 1,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams and businesses",
    priceMonthly: 49,
    priceYearly: 490,
    currency: "USD",
    features: [
      "Up to 100,000 API calls/month",
      "10 GB storage",
      "Email support",
      "Advanced analytics",
      "Custom branding",
      "Priority queue",
    ],
    popular: true,
    maxUsers: 10,
    maxProjects: 50,
    storageGb: 10,
    stripePriceIdMonthly: "price_pro_monthly_demo",
    stripePriceIdYearly: "price_pro_yearly_demo",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    priceMonthly: 299,
    priceYearly: 2990,
    currency: "USD",
    features: [
      "Unlimited API calls",
      "100 GB storage",
      "24/7 phone support",
      "Advanced analytics",
      "Custom branding",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
    maxUsers: 100,
    storageGb: 100,
    stripePriceIdMonthly: "price_enterprise_monthly_demo",
    stripePriceIdYearly: "price_enterprise_yearly_demo",
  },
];

// Mock subscription data (Better Auth v0.3.0 format)
export const mockSubscription = {
  id: "sub_demo_123",
  plan: "pro", // Plan ID matching mockPlans
  referenceId: "org_demo_123", // Organization ID for org subscriptions
  status: "active" as const,
  periodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  periodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
  seats: 10, // Seat limit for team plans
  trialStart: new Date("2024-01-01"),
  trialEnd: new Date("2024-01-15"),
  stripeCustomerId: "cus_demo_123",
  stripeSubscriptionId: "sub_stripe_123",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date(),
};

// Mock personal subscription (for user-level billing)
export const mockPersonalSubscription = {
  id: "sub_demo_456",
  plan: "pro",
  referenceId: "user_demo_123", // User ID for personal subscriptions
  status: "active" as const,
  periodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  periodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
  stripeCustomerId: "cus_demo_456",
  stripeSubscriptionId: "sub_stripe_456",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date(),
};

// Mock payment method (Better Auth v0.3.0 format)
export const mockPaymentMethod = {
  id: "pm_demo_123",
  type: "card" as const,
  last4: "4242",
  brand: "visa" as const,
  expiryMonth: 12,
  expiryYear: 2026,
  isDefault: true,
  createdAt: new Date("2024-01-15"),
};

// Mock invoices (Better Auth v0.3.0 format)
export const mockInvoices = [
  {
    id: "inv_2024_04",
    number: "INV-2024-0004",
    amount: 4900, // Amount in cents
    currency: "usd",
    status: "paid" as const,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    pdfUrl: "https://stripe.com/invoices/inv_2024_04.pdf",
    hostedInvoiceUrl: "https://stripe.com/invoices/inv_2024_04",
  },
  {
    id: "inv_2024_03",
    number: "INV-2024-0003",
    amount: 4900,
    currency: "usd",
    status: "paid" as const,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    pdfUrl: "https://stripe.com/invoices/inv_2024_03.pdf",
    hostedInvoiceUrl: "https://stripe.com/invoices/inv_2024_03",
  },
  {
    id: "inv_2024_02",
    number: "INV-2024-0002",
    amount: 4900,
    currency: "usd",
    status: "paid" as const,
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    pdfUrl: "https://stripe.com/invoices/inv_2024_02.pdf",
    hostedInvoiceUrl: "https://stripe.com/invoices/inv_2024_02",
  },
  {
    id: "inv_2024_01",
    number: "INV-2024-0001",
    amount: 4900,
    currency: "usd",
    status: "paid" as const,
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    pdfUrl: "https://stripe.com/invoices/inv_2024_01.pdf",
    hostedInvoiceUrl: "https://stripe.com/invoices/inv_2024_01",
  },
];

// Mock usage data
export const mockUsage = {
  api: {
    current: 15420,
    limit: 100000,
    percentage: 15.42,
    resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  storage: {
    current: 2.4, // GB
    limit: 10, // GB
    percentage: 24,
    files: 1847,
  },
  seats: {
    current: 4,
    limit: 10,
    percentage: 40,
    available: 6,
  },
  bandwidth: {
    current: 45.2, // GB
    limit: 100, // GB
    percentage: 45.2,
  },
};

// Mock feature flags
export const mockFeatures = {
  apiAccess: true,
  advancedAnalytics: true,
  customBranding: true,
  prioritySupport: true,
  sso: false,
  advancedSecurity: true,
  teamCollaboration: true,
  webhooks: true,
  customIntegrations: false,
};

// Mock two-factor status
export const mockTwoFactor = {
  enabled: false,
  verified: false,
  method: null,
  backupCodes: [],
};

// Mock linked providers
export const mockProviders = [
  {
    id: "provider_github",
    provider: "github",
    providerId: "github_123456",
    accountId: "github_123456",
    email: "demo@bettercone.com",
    username: "alexjohnson",
    profileUrl: "https://github.com/alexjohnson",
    avatarUrl: "https://avatars.githubusercontent.com/u/123456",
    connectedAt: new Date("2024-01-15"),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "provider_google",
    provider: "google",
    providerId: "google_789012",
    accountId: "google_789012",
    email: "demo@bettercone.com",
    profileUrl: null,
    avatarUrl: "https://lh3.googleusercontent.com/a/mock",
    connectedAt: new Date("2024-02-01"),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Mock team/seat allocation data
export const mockSeatAllocation = {
  usedSeats: 4,
  totalSeats: 10,
  planName: "Pro Plan",
  members: mockMembers.map(m => ({
    id: m.id,
    userId: m.userId,
    organizationId: m.organizationId,
    role: m.role,
    name: m.user.name,
    email: m.user.email,
    image: m.user.image,
    createdAt: m.createdAt,
  })),
};

// Legacy team seats for backwards compatibility
export const mockTeamSeats = {
  total: 10,
  used: 4,
  available: 6,
  members: mockMembers,
  pendingInvites: mockInvitations.length,
};

// Mock activity log
export const mockActivityLog = [
  {
    id: "activity_1",
    type: "login",
    description: "Signed in from Chrome on macOS",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metadata: { device: "Desktop", browser: "Chrome" },
  },
  {
    id: "activity_2",
    type: "password_changed",
    description: "Password updated successfully",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    metadata: {},
  },
  {
    id: "activity_3",
    type: "member_invited",
    description: "Invited john.doe@example.com to organization",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    metadata: { email: "john.doe@example.com", role: "member" },
  },
  {
    id: "activity_4",
    type: "api_key_created",
    description: "Created new API key 'Development Key'",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    metadata: { keyName: "Development Key" },
  },
];

// Mock pricing plans for PricingCard component
export const mockPricingPlans = [
  {
    id: "plan_free",
    name: "Free",
    description: "Perfect for trying out",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Up to 1,000 API calls/month",
      "1 GB storage",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "Best for professionals",
    priceMonthly: 49,
    priceYearly: 490, // ~$41/month
    features: [
      "Up to 100,000 API calls/month",
      "10 GB storage",
      "Email support",
      "Advanced analytics",
      "Custom branding",
      "Priority queue",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "For large organizations",
    priceMonthly: 299,
    priceYearly: 2990, // ~$249/month
    features: [
      "Unlimited API calls",
      "100 GB storage",
      "24/7 phone support",
      "Advanced analytics",
      "Custom branding",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
  },
];

// Mock accounts (for password/email settings and OAuth linking)
export const mockAccounts = [
  {
    id: "acc_1",
    provider: "credential",
    accountId: "demo@bettercone.com",
    providerId: "credential",
  },
  {
    id: "acc_2",
    provider: "github",
    accountId: "github_123456",
    providerId: "github",
  },
  {
    id: "acc_3",
    provider: "google",
    accountId: "demo@bettercone.com",
    providerId: "google",
  },
];

// Mock wallet connections (Web3/SIWE)
export const mockWalletConnections = [
  {
    id: "wallet_1",
    userId: "user_123",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId: 1, // Ethereum Mainnet
    isPrimary: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "wallet_2",
    userId: "user_123",
    address: "0x1234567890123456789012345678901234567890",
    chainId: 137, // Polygon
    isPrimary: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
];

// Context for mock data
interface MockDataContextType {
  user: typeof mockUser;
  users: typeof mockUsers;
  session: typeof mockSession;
  organization: typeof mockOrganization;
  organizations: typeof mockOrganizations;
  members: typeof mockMembers;
  invitations: typeof mockInvitations;
  sessions: typeof mockSessions;
  passkeys: typeof mockPasskeys;
  apiKeys: typeof mockApiKeys;
  plans: typeof mockPlans;
  pricingPlans: typeof mockPricingPlans;
  subscription: typeof mockSubscription;
  paymentMethod: typeof mockPaymentMethod;
  invoices: typeof mockInvoices;
  usage: typeof mockUsage;
  features: typeof mockFeatures;
  twoFactor: typeof mockTwoFactor;
  providers: typeof mockProviders;
  teamSeats: typeof mockTeamSeats;
  seatAllocation: typeof mockSeatAllocation;
  activityLog: typeof mockActivityLog;
  accounts: typeof mockAccounts;
  walletConnections: typeof mockWalletConnections;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const value: MockDataContextType = {
    user: mockUser,
    users: mockUsers,
    session: mockSession,
    organization: mockOrganization,
    organizations: mockOrganizations,
    members: mockMembers,
    invitations: mockInvitations,
    sessions: mockSessions,
    passkeys: mockPasskeys,
    apiKeys: mockApiKeys,
    plans: mockPlans,
    pricingPlans: mockPricingPlans,
    subscription: mockSubscription,
    paymentMethod: mockPaymentMethod,
    invoices: mockInvoices,
    usage: mockUsage,
    features: mockFeatures,
    twoFactor: mockTwoFactor,
    providers: mockProviders,
    teamSeats: mockTeamSeats,
    seatAllocation: mockSeatAllocation,
    activityLog: mockActivityLog,
    accounts: mockAccounts,
    walletConnections: mockWalletConnections,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within MockDataProvider");
  }
  return context;
}

// Export all mock data for direct use
export const mockData = {
  user: mockUser,
  users: mockUsers,
  session: mockSession,
  organization: mockOrganization,
  organizations: mockOrganizations,
  members: mockMembers,
  invitations: mockInvitations,
  sessions: mockSessions,
  passkeys: mockPasskeys,
  apiKeys: mockApiKeys,
  plans: mockPlans,
  pricingPlans: mockPricingPlans,
  subscription: mockSubscription,
  paymentMethod: mockPaymentMethod,
  invoices: mockInvoices,
  usage: mockUsage,
  features: mockFeatures,
  twoFactor: mockTwoFactor,
  providers: mockProviders,
  teamSeats: mockTeamSeats,
  seatAllocation: mockSeatAllocation,
  activityLog: mockActivityLog,
  accounts: mockAccounts,
  walletConnections: mockWalletConnections,
};

