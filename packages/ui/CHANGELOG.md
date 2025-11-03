# Changelog

All notable changes to @bettercone/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- [Documentation](https://docs.bettercone.dev)
- [GitHub Repository](https://github.com/vncsleal/bettercone)
- [npm Package](https://www.npmjs.com/package/@bettercone/ui)
- [Better Auth](https://better-auth.com)
