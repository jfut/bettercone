# @bettercone/ui

**Comprehensive Better Auth UI component library** with production-ready components for authentication, billing, teams, and Web3.

[![npm version](https://img.shields.io/npm/v/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![npm downloads](https://img.shields.io/npm/dm/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎉 What's New in v0.3.7 - **100% Better Auth Coverage!**

**3 New Enterprise SSO & OIDC Provider Components** - Achieving **100% coverage**:

- [x] **SSOConfigCard**: Complete OIDC & SAML SSO configuration for enterprise customers
- [x] **SAMLSetupWizard**: Guided 5-step SAML setup wizard with IdP presets
- [x] **OIDCProviderCard**: OAuth2/OIDC Provider - manage client applications (RFC 7591)
- [x] **Better Auth SSO Plugin**: Full integration with Single Sign-On plugin
- [x] **Better Auth OIDC Provider Plugin**: Full integration with OAuth2/OIDC Provider plugin
- [x] **Tab-Based UI**: Clean configuration interface with advanced options
- [x] **XML Metadata Parsing**: Auto-extract SSO URLs, certificates, and entity IDs
- [x] **Client Registration**: RFC 7591 compliant dynamic client registration
- [x] **Security Features**: One-time secret display, PKCE support, X.509 validation

### Enterprise SSO Features

**SSOConfigCard** (1,173 lines):
- Dual protocol support: OIDC and SAML 2.0
- Attribute mapping for user data synchronization
- Test connection functionality
- Organization linking
- PKCE, JWKS, and discovery endpoint support

**SAMLSetupWizard** (1,181 lines):
- 5-step guided setup (IdP selection, metadata, settings, mapping, testing)
- Pre-configured IdP presets: Okta, Azure AD, Google Workspace, OneLogin, JumpCloud
- XML metadata auto-parsing
- Controlled navigation with validation

**OIDCProviderCard** (926 lines):
- OAuth2/OIDC Provider capabilities (make your app an OAuth provider)
- Client types: web, spa, native, m2m
- Metadata display: website, terms, privacy links
- Three modes: Auto-fetch, Custom, Presentational

## What's New in v0.3.6

**3 New Device Authorization Components** - CLI, IoT, and smart TV authentication:

- [x] **DeviceAuthorizationCard**: User code input for device authorization flow
- [x] **DeviceApprovalCard**: Approve or deny device authorization requests
- [x] **DeviceCodeDisplay**: Display device codes with QR code support
- [x] **Better Auth Device Plugin**: Full integration with Device Authorization plugin
- [x] **Auto-formatting**: User-friendly code formatting (ABCD-1234)
- [x] **QR Code Support**: Optional QR code scanning for mobile devices
- [x] **Real-time Polling**: Automatic authorization status checking
- [x] **Countdown Timer**: Color-coded expiration timer

## What's New in v0.3.5

**3 New Admin Components** - User management and moderation tools:

- [x] **UserManagementTable**: Complete admin table with pagination, search, ban, delete, and impersonate
- [x] **BanUserDialog**: Ban users with customizable reason and duration (permanent or days)
- [x] **ImpersonateUserDialog**: Safely impersonate users for support purposes
- [x] **Better Auth Admin Plugin**: Full integration with admin plugin API
- [x] **Table UI Component**: Added table primitive for data display

## What's New in v0.3.4

**6 New Components** - Passkeys, Organizations, Account Management & Email:

- [x] **EmailVerificationBanner**: Persistent banner prompting email verification with resend functionality
- [x] **ChangeEmailCard**: Two-step email change process with verification code
- [x] **PasskeySetupWizard**: 5-step wizard for passkey registration (biometric & security keys)
- [x] **TransferOwnershipDialog**: Organization ownership transfer with role management
- [x] **LinkAccountCard**: Link OAuth providers to existing accounts
- [x] **UnlinkAccountCard**: Unlink OAuth providers with confirmation dialog

## What's New in v0.3.3

**Anonymous Authentication** - Sign in users without PII:

- [x] **AnonymousSignInButton**: Allow users to sign in as guests without email, password, or OAuth
- [x] **AnonymousUpgradeCard**: Encourage anonymous users to link authentication methods
- [x] **Better Auth Integration**: Full support for Better Auth anonymous plugin
- [x] **Account Linking**: Users can later link email, password, or OAuth to their anonymous account

### What's New in v0.3.2

**Documentation Updates** - Enhanced README with comprehensive feature documentation:

- [x] **v0.3.0 & v0.3.1 Documentation**: Added detailed feature documentation for recent releases
- [x] **Web3/SIWE Examples**: Complete code examples with Better Auth plugin configuration
- [x] **Stripe Integration**: Enhanced billing section with automatic checkout implementation
- [x] **Blockchain Networks**: Added supported chains documentation (Ethereum, Polygon, Arbitrum, Base, Optimism)
- [x] **Better Auth Plugin Examples**: Configuration snippets for SIWE and Stripe plugins

### What's New in v0.3.1

**Wallet Schema Fix** - Aligned WalletConnectionCard with Better Auth SIWE plugin schema:

- [x] **Schema Alignment**: Updated `WalletConnection` interface to match Better Auth exactly
- [x] **Required Fields**: Added `userId` and `chainId` fields
- [x] **Renamed Field**: `connectedAt` → `createdAt` to match Better Auth
- [x] **UI Enhancement**: Display chain name (Ethereum, Polygon, Arbitrum, Base, Optimism) instead of provider
- [ ] **Breaking**: Removed non-schema fields: `provider`, `ensName`, `lastUsed`

### What's in v0.3.0

**Better Auth Stripe Plugin Integration** - Complete billing integration:

- [x] **Stripe Plugin**: Full integration with Better Auth's official Stripe plugin
- [x] **Pricing Components**: Auto-checkout with `createCheckoutSession()`
- [x] **Subscription Management**: Update/cancel with Stripe billing portal
- [x] **Payment Methods**: Card management via Stripe Elements
- [x] **Invoice History**: Customer invoice tracking
- [x] **SIWE Components**: Sign In With Ethereum (Web3 wallet authentication)
  - `<SiweSignInButton />` - Connect and sign with Ethereum wallets
  - `<WalletConnectionCard />` - Manage connected Web3 wallets

### What's in v0.2.1

**Phone Authentication Components** - Three new components for phone number authentication:

- [x] **PhoneSignInForm** - Sign in with phone number and password
- [x] **PhoneSignUpForm** - Sign up with phone number and OTP verification
- [x] **PhoneNumberCard** - Manage phone number in user settings

## Features

- **Production-Ready Components** - Complete auth + billing + Web3 solution
- **Framework Agnostic** - Works with Next.js, Vite, Remix, or any React framework
- **Backend Agnostic** - Works with Convex, Prisma, Supabase, Drizzle, or any Better Auth backend
- **Stripe Integration** - Full billing with Better Auth Stripe plugin
- **Web3 Ready** - SIWE (Sign In With Ethereum) components included
- **Fully Customizable** - Built with Tailwind CSS and shadcn/ui primitives
- **i18n Ready** - Full localization support
- **Accessible** - WCAG 2.1 compliant components
- **Responsive** - Mobile-first design
- **Type Safe** - Written in TypeScript with full type definitions
- **Loading States** - Skeleton components included

## Installation

```bash
npm install @bettercone/ui better-auth
# or
pnpm add @bettercone/ui better-auth
# or
yarn add @bettercone/ui better-auth
```

## Setup

### 1. Install the package

Follow the installation steps above.

### 2. Import the CSS

Add the following import to your global CSS file (e.g., `app/globals.css` or `src/index.css`):

```css
@import "@bettercone/ui/css";
```

### 3. Configure Better Auth

Set up Better Auth in your project. See the [Better Auth documentation](https://better-auth.com) for details.

## Quick Start

### Authentication Components

```tsx
"use client";

import { AuthView } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  return <AuthView authClient={authClient} />;
}
```

### Organization Management

```tsx
import { OrganizationSwitcher, OrganizationMembersCard } from "@bettercone/ui";

export default function OrganizationPage() {
  return (
    <div className="container mx-auto py-8">
      <OrganizationSwitcher authClient={authClient} />
      <OrganizationMembersCard authClient={authClient} />
    </div>
  );
}
```

### Billing Dashboard

```tsx
"use client";

import { BillingDashboard } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client"; // Your Better Auth client

export default function BillingPage() {
  return (
    <div className="container mx-auto py-8">
      <BillingDashboard
        authClient={authClient}
        subscriptionCardProps={{
          onManageSubscription: async (subscription) => {
            // Open Stripe billing portal or your payment provider
            const response = await fetch("/api/billing/portal");
            const { url } = await response.json();
            window.location.href = url;
          }
        }}
      />
    </div>
  );
}
```

## Components Overview

### Authentication

- `AuthView` - Complete authentication view with routing
- `AuthForm` - Reusable form wrapper
- `AuthCallback` - OAuth callback handler
- `PasskeyButton` - Passkey authentication
- `PasskeySetupWizard` - 5-step passkey registration wizard
- `ProviderButton` - Social OAuth provider button
- `MagicLinkButton` - Magic link authentication
- `EmailOTPButton` - Email OTP trigger
- `OneTap` - Google One Tap
- `SignOut` - Sign out component
- `PhoneSignInForm` - Sign in with phone number and password
- `PhoneSignUpForm` - Sign up with phone number and OTP verification
- `AnonymousSignInButton` - Sign in as guest without PII
- `AnonymousUpgradeCard` - Encourage anonymous users to link authentication
- `DeviceAuthorizationCard` - User code input for device authorization
- `DeviceApprovalCard` - Approve or deny device authorization requests
- `DeviceCodeDisplay` - Display device codes for CLI/IoT applications

### Security & Email

- `PasskeyCell` - Individual passkey display
- `PasskeysCard` - Passkey management
- `TwoFactorCard` - Two-factor authentication settings
- `TwoFactorPasswordDialog` - Password verification for 2FA
- `BackupCodesDialog` - Backup codes display
- `ChangePasswordCard` - Password change form
- `ChangeEmailCard` - Email change with verification
- `EmailVerificationBanner` - Prompt email verification with resend
- `SessionsCard` - Active sessions list
- `SessionCell` - Individual session display
- `PhoneNumberCard` - Manage phone number with OTP verification

### Organizations

- `OrganizationSwitcher` - Switch between organizations
- `CreateOrganizationDialog` - Create new organization
- `DeleteOrganizationCard` - Delete organization
- `OrganizationMembersCard` - Members list
- `RemoveMemberDialog` - Remove member
- `UpdateMemberRoleDialog` - Change member role
- `TransferOwnershipDialog` - Transfer organization ownership
- `OrganizationInvitationsCard` - Pending invitations
- `InviteMemberDialog` - Send invitation
- `AcceptInvitationCard` - Accept invitation
- `UserInvitationsCard` - User's pending invitations
- `OrganizationNameCard` - Edit organization name
- `OrganizationSlugCard` - Edit organization slug
- `OrganizationLogoCard` - Upload organization logo
- `LeaveOrganizationDialog` - Leave organization

### Account Management

- `AccountView` - Account settings view
- `DeleteAccountCard` - Account deletion
- `DeleteAccountDialog` - Confirm deletion
- `LinkAccountCard` - Link OAuth providers to account
- `UnlinkAccountCard` - Unlink OAuth providers from account

### Developer Tools

- `ApiKeysCard` - API keys list
- `ApiKeyCell` - Individual API key
- `CreateApiKeyDialog` - Create new API key

### Admin Tools

- `UserManagementTable` - Admin table for user management
- `BanUserDialog` - Ban users with reason and duration
- `ImpersonateUserDialog` - Impersonate users for support

### Enterprise SSO & OIDC Provider

- `SSOConfigCard` - Complete OIDC & SAML SSO configuration
- `SAMLSetupWizard` - Guided 5-step SAML setup wizard
- `OIDCProviderCard` - OAuth2/OIDC Provider client management

### User Components

- `UserButton` - User menu dropdown
- `UserAvatar` - User avatar display

### Utility Components

- `SignedIn` - Conditional render when signed in
- `SignedOut` - Conditional render when signed out
- `AuthLoading` - Loading state handler
- `RedirectToSignIn` - Auto redirect to sign in
- `RedirectToSignUp` - Auto redirect to sign up
- `PasswordInput` - Password field with toggle visibility
- `FormError` - Form error display
- Provider icons for social authentication

### Billing Components

- `SubscriptionCard` - Current subscription display with Stripe integration
- `PaymentMethodCard` - Payment methods management
- `InvoiceHistoryCard` - Invoice list
- `BillingDashboard` - Complete billing page

### Usage Tracking

- `ApiUsageCard` - API usage with charts
- `StorageUsageCard` - Storage usage
- `FeatureAccessCard` - Feature access by plan
- `UsageDashboard` - Complete usage page

### Team Management

- `SeatAllocationCard` - Team seat management
- `TeamBillingCard` - Team billing overview
- `TeamDashboard` - Complete team page

### Pricing

- `PricingCard` - Plan selection with monthly/yearly toggle and auto-checkout

### Web3/SIWE

- `SiweSignInButton` - Sign In With Ethereum wallet connection
- `WalletConnectionCard` - Manage connected Web3 wallets (Ethereum, Polygon, Arbitrum, Base, Optimism)

## Detailed Component Examples

### Authentication

#### Complete Auth Flow

```tsx
import { AuthView, AuthUIProvider } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
  return (
    <AuthUIProvider
      authClient={authClient}
      credentials={true}
      signUp={true}
      social={{ 
        providers: ["google", "github"] 
      }}
    >
      <AuthView />
    </AuthUIProvider>
  );
}
```

#### Organization Switcher

```tsx
import { OrganizationSwitcher } from "@bettercone/ui";

<OrganizationSwitcher
  authClient={authClient}
  onCreate={() => {
    // Handle organization creation
  }}
/>
```

#### Phone Authentication

Phone number authentication with OTP verification.

```tsx
import { PhoneSignInForm, PhoneSignUpForm, PhoneNumberCard, AuthUIProvider } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

// Sign in with phone number and password
export function PhoneSignIn() {
  return (
    <AuthUIProvider authClient={authClient}>
      <PhoneSignInForm
        redirectTo="/dashboard"
        localization={{}}
      />
    </AuthUIProvider>
  );
}

// Sign up with phone number and OTP
export function PhoneSignUp() {
  return (
    <AuthUIProvider authClient={authClient}>
      <PhoneSignUpForm
        redirectTo="/dashboard"
        localization={{}}
      />
    </AuthUIProvider>
  );
}

// Manage phone number in settings
export function PhoneSettings() {
  return (
    <AuthUIProvider authClient={authClient}>
      <PhoneNumberCard />
    </AuthUIProvider>
  );
}
```

**Requirements:**
- Better Auth `phoneNumber` plugin configured
- SMS provider configured (Twilio, etc.)

```ts
// Better Auth configuration
import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    phoneNumber({
      sendOtp: async (phoneNumber, code) => {
        // Send SMS with your provider
        await twilioClient.messages.create({
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: `Your verification code is: ${code}`
        });
      }
    })
  ]
});
```

#### Web3/SIWE Components

Sign In With Ethereum (SIWE) for Web3 wallet authentication.

```tsx
import { SiweSignInButton, WalletConnectionCard, AuthUIProvider } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

// SIWE Sign-In Button
export function Web3SignIn() {
  return (
    <AuthUIProvider authClient={authClient}>
      <SiweSignInButton
        onSuccess={(address) => {
          console.log("Signed in with wallet:", address);
        }}
        onError={(error) => {
          console.error("SIWE error:", error);
        }}
        className="w-full"
      />
    </AuthUIProvider>
  );
}

// Wallet Connection Management
export function WalletSettings() {
  return (
    <AuthUIProvider authClient={authClient}>
      <WalletConnectionCard
        onConnect={() => {
          console.log("Connect new wallet");
        }}
        onDisconnect={(walletId) => {
          console.log("Disconnect wallet:", walletId);
        }}
      />
    </AuthUIProvider>
  );
}
```

**Requirements:**
- Better Auth `siwe` plugin configured
- Wallet provider (MetaMask, WalletConnect, etc.)

```ts
// Better Auth configuration
import { betterAuth } from "better-auth";
import { siwe } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    siwe({
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN,
      getNonce: async () => {
        // Generate secure nonce
        return crypto.randomBytes(16).toString("base64");
      }
    })
  ]
});
```

**Supported Chains:**
- Ethereum (chainId: 1)
- Polygon (chainId: 137)
- Arbitrum (chainId: 42161)
- Base (chainId: 8453)
- Optimism (chainId: 10)

#### Two-Factor Authentication

```tsx
import { TwoFactorCard } from "@bettercone/ui";

<TwoFactorCard
  authClient={authClient}
  onEnable={(secret) => {
    // Handle 2FA enablement
  }}
/>
```

### Billing
Displays current subscription with Stripe integration.

**Requirements:**
- Better Auth `stripe` plugin configured
- Stripe account with products/prices set up

```ts
// Better Auth configuration
import { betterAuth } from "better-auth";
import { stripe } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    stripe({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!
    })
  ]
});
```

#### SubscriptionCard
Displays current subscription with management actions.

```tsx
import { SubscriptionCard } from "@bettercone/ui";

<SubscriptionCard
  authClient={authClient}
  onManageSubscription={async (subscription, organization) => {
    // Handle billing portal navigation
  }}
  onAction={(action, subscription) => {
    // Handle upgrade/cancel actions
  }}
  showActions={true}
  localization={{
    currentPlan: "Current Plan",
    manageSubscription: "Manage Subscription"
  }}
/>
```

#### PaymentMethodCard
Payment method management via billing portal.

```tsx
import { PaymentMethodCard } from "@bettercone/ui";

<PaymentMethodCard
  authClient={authClient}
  onManagePayment={async (subscription, organization) => {
    // Open payment management
  }}
/>
```

#### InvoiceHistoryCard
Invoice viewing and download functionality.

```tsx
import { InvoiceHistoryCard } from "@bettercone/ui";

<InvoiceHistoryCard
  authClient={authClient}
  onViewInvoices={async (subscription, organization) => {
    // Open billing portal to invoices
  }}
  maxInvoices={5}
/>
```

### Pricing Components

#### PricingCard
Plan selection with monthly/yearly toggle and automatic Stripe checkout.

```tsx
import { PricingCard, type PricingPlan } from "@bettercone/ui";

const plan: PricingPlan = {
  id: "pro",
  name: "Pro",
  description: "For growing teams",
  priceMonthly: 29,
  priceYearly: 290,
  stripePriceIdMonthly: "price_xxx", // Stripe price ID
  stripePriceIdYearly: "price_yyy",   // Stripe price ID
  features: [
    "Unlimited API calls",
    "Advanced analytics",
    "Priority support"
  ],
  popular: true
};

<PricingCard
  plan={plan}
  billingInterval="monthly"
  authClient={authClient}
  onSubscribe={async (planId, interval) => {
    // Automatic Stripe checkout via Better Auth
    await authClient.stripe.createCheckoutSession({
      priceId: interval === "monthly" 
        ? plan.stripePriceIdMonthly 
        : plan.stripePriceIdYearly,
      successUrl: `${window.location.origin}/billing/success`,
      cancelUrl: `${window.location.origin}/pricing`
    });
  }}
/>
```

### Usage Components

#### ApiUsageCard
API call tracking with progress bars and warnings.

```tsx
import { ApiUsageCard } from "@bettercone/ui";

<ApiUsageCard
  current={8500}
  limit={10000}
  warningThreshold={80}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

#### StorageUsageCard
Storage usage tracking with alerts.

```tsx
import { StorageUsageCard } from "@bettercone/ui";

<StorageUsageCard
  currentBytes={4500000000} // 4.5GB
  limitBytes={5000000000}   // 5GB
  warningThreshold={80}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

#### FeatureAccessCard
Feature flag display with locked/unlocked states.

```tsx
import { FeatureAccessCard, type FeatureAccess } from "@bettercone/ui";

const features: FeatureAccess = {
  planId: "pro",
  advancedAnalytics: true,
  apiAccess: true,
  customIntegrations: false,
  prioritySupport: false
};

<FeatureAccessCard
  features={features}
  onUpgrade={() => {
    // Navigate to pricing
  }}
/>
```

### Team Components

#### SeatAllocationCard
Team seat management with warnings.

```tsx
import { SeatAllocationCard, type SeatAllocationData } from "@bettercone/ui";

const data: SeatAllocationData = {
  usedSeats: 8,
  totalSeats: 10,
  planName: "Team",
  members: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" }
  ]
};

<SeatAllocationCard
  data={data}
  onUpgrade={() => {
    // Navigate to pricing
  }}
  onInviteMember={() => {
    // Open invite dialog
  }}
  showMemberList={true}
/>
```

#### TeamBillingCard
Organization-level billing summary.

```tsx
import { TeamBillingCard } from "@bettercone/ui";

<TeamBillingCard
  organization={organization}
  subscription={subscription}
  onManageBilling={() => {
    // Open billing portal
  }}
  onChangePlan={() => {
    // Navigate to pricing
  }}
/>
```

## Backend-Agnostic Architecture

All components accept a `BetterAuthClient` interface, making them compatible with any Better Auth backend:

```typescript
import type { BetterAuthClient } from "@bettercone/ui";

// Works with Convex
import { authClient } from "@convex-dev/better-auth";

// Works with Prisma
import { createAuthClient } from "better-auth/react";

// Works with Supabase, Drizzle, etc.
```

## Customization

### Class Names
All components accept `className` and `classNames` props for granular styling:

```tsx
<SubscriptionCard
  className="shadow-xl"
  classNames={{
    header: "bg-primary text-white",
    title: "text-2xl",
    content: "p-6"
  }}
/>
```

### Localization
Components support partial localization:

```tsx
<SubscriptionCard
  localization={{
    currentPlan: "Plan Atual",
    manageSubscription: "Gerenciar Assinatura",
    noActiveSubscription: "Nenhuma assinatura ativa"
  }}
/>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthSubscription,
  SubscriptionCardProps,
  PricingPlan,
  FeatureAccess
} from "@bettercone/ui";
```

## Loading States

All components include skeleton variants:

```tsx
import { SubscriptionCardSkeleton } from "@bettercone/ui";

{isLoading ? <SubscriptionCardSkeleton /> : <SubscriptionCard {...props} />}
```

## License

MIT © BetterCone

## Links

- [Documentation](https://docs.bettercone.com)
- [GitHub](https://github.com/bettercone/bettercone)
- [Discord](https://discord.gg/bettercone)
- [Better Auth](https://better-auth.com)
