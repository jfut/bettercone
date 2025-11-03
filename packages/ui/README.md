# @bettercone/ui

**Comprehensive Better Auth UI component library** with 76+ production-ready components for authentication, billing, teams, and more.

[![npm version](https://img.shields.io/npm/v/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![npm downloads](https://img.shields.io/npm/dm/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What's New in v0.2.1 🎉

**Phone Authentication Components** - Three new components for phone number authentication:

- ✅ **PhoneSignInForm** - Sign in with phone number and password
- ✅ **PhoneSignUpForm** - Sign up with phone number and OTP verification
- ✅ **PhoneNumberCard** - Manage phone number in user settings

### What's in v0.2.0

**76 Components** - Complete authentication, security, organizations, and more:

- ✅ **Authentication**: Sign-in, sign-up, password reset, magic link, email OTP, 2FA, passkeys
- ✅ **Security**: Sessions management, password changes, two-factor auth, backup codes
- ✅ **Organizations**: Full org management with members, invitations, roles, settings
- ✅ **Account**: User profile, avatar, email management, account deletion
- ✅ **Developer Tools**: API key management, creation, deletion
- ✅ **Billing**: Subscription cards, payment methods, invoices (existing)
- ✅ **Usage Tracking**: API usage, storage, feature access (existing)
- ✅ **Teams**: Seat allocation, team billing (existing)

## Features

- 🎨 **76 Production-Ready Components** - Complete auth + billing solution
- ⚛️ **Framework Agnostic** - Works with Next.js, Vite, Remix, or any React framework
- 🔌 **Backend Agnostic** - Works with Convex, Prisma, Supabase, Drizzle, or any Better Auth backend
- 🎨 **Fully Customizable** - Built with Tailwind CSS and shadcn/ui primitives
- 🌍 **i18n Ready** - Full localization support
- ♿ **Accessible** - WCAG 2.1 compliant components
- 📱 **Responsive** - Mobile-first design
- 🔒 **Type Safe** - Written in TypeScript with full type definitions
- ⚡ **Loading States** - Skeleton components included

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

### 🔐 Authentication (11 components)

- `AuthView` - Complete authentication view with routing
- `AuthForm` - Reusable form wrapper
- `AuthCallback` - OAuth callback handler
- `PasskeyButton` - Passkey authentication
- `ProviderButton` - Social OAuth provider button
- `MagicLinkButton` - Magic link authentication
- `EmailOTPButton` - Email OTP trigger
- `OneTap` - Google One Tap
- `SignOut` - Sign out component
- `PhoneSignInForm` - **NEW** Sign in with phone number and password
- `PhoneSignUpForm` - **NEW** Sign up with phone number and OTP verification

### 🔒 Security (9 components)

- `PasskeyCell` - Individual passkey display
- `PasskeysCard` - Passkey management
- `TwoFactorCard` - Two-factor authentication settings
- `TwoFactorPasswordDialog` - Password verification for 2FA
- `BackupCodesDialog` - Backup codes display
- `ChangePasswordCard` - Password change form
- `SessionsCard` - Active sessions list
- `SessionCell` - Individual session display
- `PhoneNumberCard` - **NEW** Manage phone number with OTP verification

### 🏢 Organizations (14 components)

- `OrganizationSwitcher` - Switch between organizations
- `CreateOrganizationDialog` - Create new organization
- `DeleteOrganizationCard` - Delete organization
- `OrganizationMembersCard` - Members list
- `RemoveMemberDialog` - Remove member
- `UpdateMemberRoleDialog` - Change member role
- `OrganizationInvitationsCard` - Pending invitations
- `InviteMemberDialog` - Send invitation
- `AcceptInvitationCard` - Accept invitation
- `UserInvitationsCard` - User's pending invitations
- `OrganizationNameCard` - Edit organization name
- `OrganizationSlugCard` - Edit organization slug
- `OrganizationLogoCard` - Upload organization logo
- `LeaveOrganizationDialog` - Leave organization

### 👤 Account (3 components)

- `AccountView` - Account settings view
- `DeleteAccountCard` - Account deletion
- `DeleteAccountDialog` - Confirm deletion

### 🛠️ Developer Tools (3 components)

- `ApiKeysCard` - API keys list
- `ApiKeyCell` - Individual API key
- `CreateApiKeyDialog` - Create new API key

### 👥 User Components (2 components)

- `UserButton` - User menu dropdown
- `UserAvatar` - User avatar display

### 🔧 Utility Components (8 components)

- `SignedIn` - Conditional render when signed in
- `SignedOut` - Conditional render when signed out
- `AuthLoading` - Loading state handler
- `RedirectToSignIn` - Auto redirect to sign in
- `RedirectToSignUp` - Auto redirect to sign up
- `PasswordInput` - Password field with toggle visibility
- `FormError` - Form error display
- Provider icons for social authentication

### Billing Components (4 components)

### Billing Components (4 components)

- `SubscriptionCard` - Current subscription display
- `PaymentMethodCard` - Payment methods management
- `InvoiceHistoryCard` - Invoice list
- `BillingDashboard` - Complete billing page

### Usage Tracking (4 components)

- `ApiUsageCard` - API usage with charts
- `StorageUsageCard` - Storage usage
- `FeatureAccessCard` - Feature access by plan
- `UsageDashboard` - Complete usage page

### Team Management (3 components)

- `SeatAllocationCard` - Team seat management
- `TeamBillingCard` - Team billing overview
- `TeamDashboard` - Complete team page

### Pricing (1 component)

- `PricingCard` - Plan selection with monthly/yearly toggle

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
Plan selection with monthly/yearly toggle.

```tsx
import { PricingCard, type PricingPlan } from "@bettercone/ui";

const plan: PricingPlan = {
  id: "pro",
  name: "Pro",
  description: "For growing teams",
  priceMonthly: 29,
  priceYearly: 290,
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
  onSubscribe={(planId, interval) => {
    // Handle subscription
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

- [Documentation](https://docs.bettercone.dev)
- [GitHub](https://github.com/bettercone/bettercone)
- [Discord](https://discord.gg/bettercone)
- [Better Auth](https://better-auth.com)
