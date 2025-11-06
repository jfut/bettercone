# Changelog

All notable changes to @bettercone/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.6] - 2025-11-06

### Added

#### Device Authorization Components
- **DeviceAuthorizationCard**: User code input for device authorization flow
  - User code input with auto-formatting (ABCD-1234)
  - Real-time validation as user types
  - Auto-redirect to approval page on valid code
  - Error handling for invalid/expired codes
  - Full localization support
  - Integrates with Better Auth Device Authorization plugin

- **DeviceApprovalCard**: Approve or deny device authorization requests
  - Approve/deny buttons with loading states
  - Device code display with copy functionality
  - Optional client info display (name, scope)
  - Authentication requirement check
  - Success/error/loading state cards
  - Security notice for users
  - Grid button layout matching design system
  - Full localization support (15+ strings)
  - Integrates with Better Auth Device Authorization plugin

- **DeviceCodeDisplay**: Display device codes for CLI/IoT applications
  - Large, readable code display with auto-formatting
  - Verification URL with copy button
  - Optional QR code for mobile scanning
  - Countdown timer with color-coded urgency
  - Automatic polling for authorization status
  - Success/error/expired state alerts
  - Centered layout matching design system
  - Step-by-step user flow (visit URL, enter code)
  - Full localization support (10+ strings)
  - Integrates with Better Auth Device Authorization plugin

### Changed
- **AnyAuthClient**: Added device authorization plugin type definitions
  - `device()` to verify user code and fetch client info
  - `device.code()` to generate device and user codes
  - `device.token()` to poll for authorization token
  - `device.approve()` to approve device authorization
  - `device.deny()` to deny device authorization

- **AuthLocalization**: Added device authorization strings
  - `DEVICE_AUTH_TITLE`, `DEVICE_AUTH_DESCRIPTION`
  - `DEVICE_APPROVAL_TITLE`, `DEVICE_APPROVAL_DESCRIPTION`
  - `DEVICE_DISPLAY_TITLE`, `DEVICE_DISPLAY_DESCRIPTION`
  - `DEVICE_DISPLAY_URL_LABEL`, `DEVICE_DISPLAY_CODE_LABEL`
  - `DEVICE_SCAN_QR`, `DEVICE_OR_SCAN_QR`
  - `DEVICE_COPY_CODE`, `DEVICE_EXPIRES_IN`, `DEVICE_POLLING_STATUS`
  - `DEVICE_APPROVED`, `DEVICE_APPROVED_SUCCESS`, `DEVICE_DENIED_SUCCESS`
  - `DEVICE_EXPIRED`, `DEVICE_ACCESS_DENIED`
  - And more...


## [0.3.5] - 2025-11-06

### Added

#### Admin Components
- **UserManagementTable**: Complete admin table for managing users
  - User list with pagination (10 per page, offset-based)
  - Search by email or name with contains operator
  - Sort by creation date (descending)
  - Ban/unban users with confirmation dialogs
  - Delete users with confirmation
  - Impersonate users for support (with page reload)
  - Status badges (active/banned, verified/unverified)
  - Role display (supports string or array)
  - Full error handling with toast notifications
  - Complete localization support (50+ strings)
  - Integrates with Better Auth admin plugin

- **BanUserDialog**: Ban users with reason and duration
  - Ban reason input (textarea)
  - Duration selector: permanent, 1/3/7/30 days, or custom
  - Custom duration input field
  - User info preview
  - Full localization support
  - Integrates with Better Auth admin plugin

- **ImpersonateUserDialog**: Impersonate users for support
  - User preview with avatar
  - Safety warning about impersonation
  - Automatic page reload after impersonation
  - Full localization support
  - Integrates with Better Auth admin plugin

### Changed
- **AnyAuthClient**: Added admin plugin type definitions
  - `listUsers` with pagination, search, and filtering
  - `banUser` with reason and expiration
  - `unbanUser` to remove ban
  - `removeUser` to delete user
  - `impersonateUser` to start impersonation
  - `stopImpersonating` to end impersonation

### Infrastructure
- Added Table UI component to support UserManagementTable

## [0.3.4] - 2025-11-06

### Added

#### Email Verification Component
- **EmailVerificationBanner**: Prompt users to verify their email address
  - Persistent banner for unverified users
  - Resend verification email functionality
  - Cooldown timer (default 60s) with countdown display
  - Dismissible with local state tracking
  - Success/error messages with 5s auto-hide
  - Integrates with Better Auth `/send-verification-email` endpoint
  - Optional AuthUIContext support
  - Customizable via `classNames` prop (7 customization points)
  - Full localization support

#### Email Management Component
- **ChangeEmailCard**: Allow users to change their email with verification
  - Extracted from better-auth-ui with enhancements
  - Two-step process: request change → verify new email
  - Email validation with Better Auth endpoint
  - Automatic focus management on verification code input
  - Success/error messages with toast notifications
  - Integrates with Better Auth `/change-email` endpoint
  - Full localization support
  - Customizable via callbacks: `onSuccess`, `onError`

#### Passkey Components
- **PasskeySetupWizard**: 5-step wizard for registering passkeys
  - Step 1: Introduction to passkey benefits
  - Step 2: Name your passkey for identification
  - Step 3: Choose authenticator type (platform vs cross-platform)
  - Step 4: Register passkey with device
  - Step 5: Success confirmation
  - Platform authenticators: Biometric (Face ID, Touch ID, Windows Hello)
  - Cross-platform: Security keys (YubiKey, USB keys)
  - Integrates with Better Auth passkey plugin
  - Full localization support
  - Customizable via callbacks: `onSuccess`, `onError`, `onCancel`

#### Organization Components
- **TransferOwnershipDialog**: Transfer organization ownership to another member
  - Member selection dropdown (admins/owners only eligible)
  - Warning message about ownership transfer consequences
  - Two-step role update: promote new owner → demote current owner to admin
  - Integrates with Better Auth organization plugin
  - Full localization support
  - Customizable via callbacks: `onSuccess`, `onError`

#### Account Management Components
- **LinkAccountCard**: Link OAuth providers to existing accounts
  - Provider selection from Generic OAuth configuration
  - Initiate OAuth linking flow with callback URL
  - Loading states during OAuth process
  - Integrates with Better Auth Generic OAuth plugin
  - Full localization support
  - Customizable via callbacks: `onSuccess`, `onError`
- **UnlinkAccountCard**: Unlink OAuth providers from accounts
  - Lists all linked OAuth accounts with provider and email
  - AlertDialog confirmation before unlinking
  - Minimum account protection (prevents unlinking last account)
  - Real-time account list refresh after unlink
  - Integrates with Better Auth account unlinking
  - Full localization support
  - Customizable via callbacks: `onSuccess`, `onError`

#### UI Components
- **RadioGroup**: Radix UI radio group primitive
  - Added as dependency for PasskeySetupWizard
  - Uses @radix-ui/react-radio-group v1.3.8
  - Consistent with design system styling
- **AlertDialog**: Radix UI alert dialog primitive
  - Added for UnlinkAccountCard confirmation
  - Uses @radix-ui/react-alert-dialog v1.1.15
  - Consistent with design system styling

### Changed
- Simplified export pattern: Components with inline `classNames` no longer export ClassNames types
- `AnonymousUpgradeCard` now exports only `Props` (removed ClassNames and Localization exports)
- Consistent with library-wide pattern: only complex components with nested structures export ClassNames

### Fixed
- Alert component border color now explicitly uses `border-border` design token
- Removed hardcoded blue colors from all components
- All components now use design system tokens exclusively

### Categories at 100%
- **Organizations**: 17/17 components (TransferOwnershipDialog completed)
- **User Management**: 16/16 components (LinkAccountCard, UnlinkAccountCard completed)
- **Billing**: 6/6 components
- **Usage**: 4/4 components
- **Team**: 4/4 components
- **Web3**: 2/2 components
- **Phone**: 3/3 components
- **Security & Email**: 10/10 components

### Progress
- **Total Components**: 79/89 (89%)
- **Remaining**: 10 components to reach 100%

## [0.3.3] - 2025-11-05

### Added

#### Anonymous Authentication Components
- **AnonymousSignInButton**: Sign in users without requiring PII (email, password, OAuth)
  - Integrates with Better Auth anonymous plugin
  - Supports callbacks: `onSuccess`, `onError`
  - Optional redirect after sign-in
  - Customizable button variant and size
  - Full localization support
- **AnonymousUpgradeCard**: Encourage anonymous users to link authentication methods
  - Displays benefits of upgrading from guest account
  - Alert message about temporary guest accounts
  - Email sign-up and OAuth linking options
  - Fully customizable via `classNames` prop
  - Complete localization support

#### Better Auth Plugin Support
- Added support for Better Auth `anonymous` plugin
- Users can sign in without providing PII and later link accounts
- Components follow established patterns from other auth components

## [0.3.2] - 2025-11-05

### Changed

#### Documentation Updates
- Updated README with comprehensive v0.3.0 and v0.3.1 feature documentation
- Added Web3/SIWE component examples with Better Auth plugin configuration
- Enhanced billing section with Stripe integration details
- Added supported blockchain networks documentation (Ethereum, Polygon, Arbitrum, Base, Optimism)

## [0.3.1] - 2025-11-05

### Fixed

#### WalletConnectionCard Schema Alignment
- **Breaking**: Updated `WalletConnection` interface to match Better Auth SIWE plugin schema
  - Added `userId: string` field (required)
  - Added `chainId: number` field (required)
  - Renamed `connectedAt` → `createdAt` to match Better Auth schema
  - Removed `provider: string` field (not in Better Auth schema)
  - Removed `ensName` field (returned via `ensLookup` function, not stored)
  - Removed `lastUsed` field (not in Better Auth schema)

#### UI Improvements
- Display chain name (Ethereum, Polygon, Arbitrum, Base, Optimism) instead of provider
- Show wallet creation date alongside chain name
- Added `getChainName()` helper function for common chains

### Schema Reference

Better Auth SIWE wallet table:
```typescript
interface WalletConnection {
  id: string        // Primary key
  userId: string    // Reference to user.id
  address: string   // Ethereum wallet address
  chainId: number   // Chain ID (1 for Ethereum, 137 for Polygon, etc.)
  isPrimary: boolean // Whether this is the user's primary wallet
  createdAt: Date   // Creation timestamp
}
```

## [0.3.0] - 2025-11-04

### 🚀 Major Update - Better Auth Stripe Plugin Integration

Complete refactor of billing and pricing components to support auto-fetch mode with Better Auth Stripe plugin.

### ⚠️ Breaking Changes

#### Removed Props
- **All billing components**: Removed `authClient` prop - now use `AuthUIProvider` wrapper instead
- **SubscriptionCard, PaymentMethodCard, InvoiceHistoryCard**: No longer require `authClient` prop
- **TeamBillingCard**: Changed from `organization` object prop to `organizationId` string
- **BillingDashboard**: Removed `authClient` prop

#### Changed Props
- **Subscription type**: Renamed fields to match Better Auth schema
  - `currentPeriodStart` → `periodStart`
  - `currentPeriodEnd` → `periodEnd`
  - Removed `cancelAt` (use `cancelAtPeriodEnd` instead)
- **PricingCard**: Auto-checkout now uses `plan` + `annual` flag instead of `stripePriceId`

### Added

#### Auto-Fetch Mode
All billing components now support automatic data fetching when wrapped with `AuthUIProvider`:
- `SubscriptionCard` - Auto-fetches active subscription
- `PaymentMethodCard` - Auto-opens billing portal
- `InvoiceHistoryCard` - Auto-fetches invoice list
- `TeamBillingCard` - Auto-fetches organization subscription
- `SeatAllocationCard` - Auto-fetches seat limits from subscription
- `PricingCard` - Auto-handles Stripe Checkout

#### Component Modes
All components now support 3 integration modes:
1. **Auto-Fetch Mode**: Automatic data fetching via Better Auth Stripe plugin
2. **Custom Backend Mode**: Same API shape with custom implementation
3. **Presentational Mode**: Manual data passing via props

#### Documentation
- New comprehensive Better Auth Stripe integration guide
- Updated all 6 component docs with v0.3.0 API examples
- Added migration examples from v0.2.x
- Troubleshooting section for common issues

### Fixed
- **BillingDashboard**: Now works with `AuthUIProvider` context
- **TeamDashboard**: Fixed organization subscription detection
- **PricingCard**: Fixed auto-checkout to use Better Auth upgrade() API correctly
- **Package Build**: Added `styles.css` to dist folder (fixes CSS import errors)

### Migration Guide

#### Before (v0.2.x)
```tsx
<SubscriptionCard authClient={authClient} />
<PaymentMethodCard authClient={authClient} />
<BillingDashboard authClient={authClient} />
```

#### After (v0.3.0)
```tsx
<AuthUIProvider authClient={authClient}>
  <SubscriptionCard />
  <PaymentMethodCard />
  <BillingDashboard />
</AuthUIProvider>
```

For detailed migration instructions, see the [Better Auth Stripe Integration Guide](https://bettercone.com/docs/guides/authentication/better-auth-stripe).

## [0.2.1] - 2025-11-03

### Added

#### Phone Authentication Components (3 new)
- `PhoneSignInForm` - Sign in with phone number and password using Better Auth phoneNumber plugin
- `PhoneSignUpForm` - Sign up with phone number and OTP verification, includes resend functionality with countdown timer
- `PhoneNumberCard` - Manage phone number in user settings with verification status and update flow

### Features
- International phone number format validation (E.164 format)
- Two-step OTP verification process for sign up
- Rate limiting protection for OTP verification
- Resend OTP code with 60-second countdown timer
- Phone number verification status badge
- Secure phone number update flow with OTP confirmation

### Technical Updates
- Added `phoneNumber` property to `AnyAuthClient` type interface
- Exported phone authentication components from main package entry point

## [0.2.0] - 2025-10-29

### 🎉 Major Release - 76 Components

This is a massive update that transforms @bettercone/ui from a billing-focused library (11 components) into a comprehensive Better Auth UI library with 76 production-ready components.

### Added

#### Authentication Components (9 new)
- `AuthView` - Complete authentication view with routing and multiple auth methods
- `AuthForm` - Reusable form wrapper for consistent auth UI
- `AuthCallback` - OAuth callback handler for social authentication
- `PasskeyButton` - Passkey/WebAuthn authentication button
- `ProviderButton` - Configurable social OAuth provider button (Google, GitHub, etc.)
- `MagicLinkButton` - Magic link authentication trigger
- `EmailOTPButton` - Email one-time password authentication
- `OneTap` - Google One Tap sign-in integration
- `SignOut` - Sign out button with confirmation

#### Security Components (8 new)
- `PasskeyCell` - Individual passkey display with device info
- `PasskeysCard` - Complete passkey management interface
- `TwoFactorCard` - Two-factor authentication settings and QR code
- `TwoFactorPasswordDialog` - Password verification before 2FA changes
- `BackupCodesDialog` - Display and download backup codes
- `ChangePasswordCard` - Password change form with validation
- `SessionsCard` - Active sessions list with device information
- `SessionCell` - Individual session display with revoke option

#### Organization Components (14 new)
- `OrganizationSwitcher` - Dropdown to switch between organizations
- `CreateOrganizationDialog` - Create new organization with name/slug
- `DeleteOrganizationCard` - Delete organization with confirmation
- `OrganizationMembersCard` - List and manage organization members
- `RemoveMemberDialog` - Remove member with confirmation
- `UpdateMemberRoleDialog` - Change member role (owner, admin, member)
- `OrganizationInvitationsCard` - Manage pending invitations
- `InviteMemberDialog` - Send email invitations with role selection
- `AcceptInvitationCard` - Accept organization invitation
- `UserInvitationsCard` - View user's pending invitations
- `OrganizationNameCard` - Edit organization name
- `OrganizationSlugCard` - Edit organization slug
- `OrganizationLogoCard` - Upload/update organization logo
- `LeaveOrganizationDialog` - Leave organization with confirmation

#### Account Components (3 new)
- `AccountView` - Complete account settings view
- `DeleteAccountCard` - Account deletion interface
- `DeleteAccountDialog` - Confirm account deletion

#### Developer Tools (3 new)
- `ApiKeysCard` - List all API keys with metadata
- `ApiKeyCell` - Individual API key display
- `CreateApiKeyDialog` - Create new API key with expiration

#### User Components (2 new)
- `UserButton` - User menu dropdown with avatar
- `UserAvatar` - User avatar with fallback initials

#### Utility Components (8 new)
- `SignedIn` - Conditional render wrapper for authenticated users
- `SignedOut` - Conditional render wrapper for unauthenticated users
- `AuthLoading` - Loading state wrapper during auth checks
- `RedirectToSignIn` - Auto redirect component to sign-in page
- `RedirectToSignUp` - Auto redirect component to sign-up page
- `PasswordInput` - Password field with show/hide toggle
- `FormError` - Consistent form error display
- Provider icons for all major social providers

#### Hooks (7 new)
- `useIsHydrated` - Check if component is hydrated (SSR-safe)
- `useLang` - Localization hook
- `useOnSuccessTransition` - Handle success state transitions
- `useCurrentOrganization` - Get current active organization
- `useAuthData` - Generic auth data fetching hook
- `useAuthenticate` - Authentication state hook
- `useTheme` - Theme management hook

#### Context Providers
- `AuthUIProvider` - Main provider for auth configuration
- `AuthUIContext` - Context for accessing auth configuration

#### Type System
- Created 18+ comprehensive type stub files
- Full TypeScript support for all components
- Proper type exports for all component props

### Changed

- **Build System**: Upgraded to use tsup with proper CJS/ESM/DTS output
- **Dependencies**: 
  - Upgraded `@hookform/resolvers` from v3 to v5.2.2
  - Added `react-hook-form`, `zod`, `ua-parser-js`, `input-otp`
- **Component Structure**: 
  - Moved all UI primitives to `/components/ui/`
  - Organized components by domain (auth, security, organization, etc.)
  - Removed duplicate components
- **Import Paths**: Fixed all circular imports and standardized paths
- **Package Description**: Updated to reflect comprehensive auth library

### Fixed

- Module resolution errors in all auth components
- Circular import issues between components
- Type compatibility with Better Auth client
- InputOTPGroup usage in email-otp-form and two-factor-form
- Captcha integration with proper stub hook
- Component organization (badge, button, progress, separator, user-view)

### Removed

- Dependency on external UI libraries (now self-contained)
- Duplicate component files (card.tsx, skeleton.tsx, user-view.tsx)
- Inline workarounds replaced with proper implementations

### Technical Details

- **Build Output**:
  - CJS: 1.41 MB
  - ESM: 1.41 MB
  - DTS: 88.11 KB
- **Total Files**: 116 .tsx component files
- **Type Safety**: Zero TypeScript errors in build
- **Architecture**: Maintained provider-agnostic design

### Migration Guide (v0.1.1 → v0.2.0)

#### Breaking Changes
None! All existing v0.1.1 components remain unchanged and backward compatible.

#### New Features Available
You can now import and use 65+ new authentication and organization components:

```tsx
// Before (v0.1.1)
import { SubscriptionCard, BillingDashboard } from "@bettercone/ui";

// After (v0.2.0) - all still work, plus:
import { 
  AuthView, 
  OrganizationSwitcher,
  TwoFactorCard,
  ApiKeysCard 
} from "@bettercone/ui";
```

#### New Provider Requirement
For auth components, wrap your app with `AuthUIProvider`:

```tsx
import { AuthUIProvider } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";

export default function App({ children }) {
  return (
    <AuthUIProvider authClient={authClient}>
      {children}
    </AuthUIProvider>
  );
}
```

## [0.1.1] - 2025-10-29

### Added
- Initial release with 11 billing, usage, and team components
- `SubscriptionCard`, `PaymentMethodCard`, `InvoiceHistoryCard`
- `BillingDashboard` - Complete billing page
- `ApiUsageCard`, `StorageUsageCard`, `FeatureAccessCard`
- `UsageDashboard` - Complete usage page
- `SeatAllocationCard`, `TeamBillingCard`, `TeamDashboard`
- `PricingCard` - Plan selection component

### Features
- Backend-agnostic architecture
- TypeScript support
- Tailwind CSS styling
- Skeleton loading states
- i18n support
- Accessibility features

---

## Links

- [Documentation](https://docs.bettercone.com)
- [GitHub Repository](https://github.com/vncsleal/bettercone)
- [npm Package](https://www.npmjs.com/package/@bettercone/ui)
- [Better Auth](https://better-auth.com)
