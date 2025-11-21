export { cn } from "./lib/utils";

// Types
export type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthOrganization,
} from "./types/auth";

// ============================================================================
// Authentication Components
// ============================================================================
export { AuthView } from "./components/auth/views/auth-view";
export { AuthForm } from "./components/auth/forms/auth-form";
export { AuthCallback } from "./components/auth/components/auth-callback";
export { PasskeyButton } from "./components/auth/buttons/passkey-button";
export { ProviderButton } from "./components/auth/buttons/provider-button";
export { MagicLinkButton } from "./components/auth/buttons/magic-link-button";
export { EmailOTPButton } from "./components/auth/buttons/email-otp-button";
export { OneTap } from "./components/auth/components/one-tap";
export { SignOut } from "./components/auth/components/sign-out";

// Phone Authentication
export { PhoneSignInForm } from "./components/auth/forms/phone-sign-in-form";
export { PhoneSignUpForm } from "./components/auth/forms/phone-sign-up-form";

// Anonymous Authentication
export { AnonymousSignInButton } from "./components/auth/buttons/anonymous-sign-in-button";
export type { AnonymousSignInButtonProps } from "./components/auth/buttons/anonymous-sign-in-button";

// Last Login Badge
export { LastLoginBadge } from "./components/auth/components/last-login-badge";

// Device Authorization (OAuth 2.0)
export { DeviceAuthorizationCard } from "./components/auth/cards/device-authorization-card";
export { DeviceApprovalCard } from "./components/auth/cards/device-approval-card";
export { DeviceCodeDisplay } from "./components/auth/components/device-code-display";

// ============================================================================
// Security Components
// ============================================================================
export { PasskeyCell } from "./components/security/cells/passkey-cell";
export { PasskeysCard } from "./components/security/cards/passkeys-card";
export { PasskeySetupWizard } from "./components/passkey/wizards/passkey-setup-wizard";
export { TwoFactorCard } from "./components/security/cards/two-factor-card";
export { TwoFactorPasswordDialog } from "./components/security/dialogs/two-factor-password-dialog";
export { BackupCodesDialog } from "./components/security/dialogs/backup-codes-dialog";
export { ChangePasswordCard } from "./components/security/cards/change-password-card";
export { SessionsCard } from "./components/security/cards/sessions-card";
export { SessionCell } from "./components/security/cells/session-cell";

// Email Management
export { ChangeEmailCard } from "./components/settings/security/change-email-card";

// Phone Number Management
export { PhoneNumberCard } from "./components/security/cards/phone-number-card";

// Email Verification
export { EmailVerificationBanner } from "./components/security/banners/email-verification-banner";
export type { EmailVerificationBannerProps } from "./components/security/banners/email-verification-banner";


// ============================================================================
// Organization Components
// ============================================================================
export * from "./components/organization"


// ============================================================================
// Account Components
// ============================================================================
export { AccountView } from "./components/account/views/account-view";
export { DeleteAccountCard } from "./components/account/cards/delete-account-card";
export { DeleteAccountDialog } from "./components/account/dialogs/delete-account-dialog";
export { AnonymousUpgradeCard } from "./components/account/cards/anonymous-upgrade-card";
export type { AnonymousUpgradeCardProps } from "./components/account/cards/anonymous-upgrade-card";
export { LinkAccountCard } from "./components/account/cards/link-account-card";
export { UnlinkAccountCard } from "./components/account/cards/unlink-account-card";

// ============================================================================
// API Key Components
// ============================================================================
export { ApiKeysCard } from "./components/apiKey/cards/api-keys-card";
export { ApiKeyCell } from "./components/apiKey/cells/api-key-cell";
export { CreateApiKeyDialog } from "./components/apiKey/dialogs/create-api-key-dialog";
export { UpdateApiKeyDialog } from "./components/apiKey/dialogs/update-api-key-dialog";
export {
  ApiKeyUsageCard
} from "./components/apiKey/cards/api-key-usage-card";
export type { ApiKey } from "./types/api-key";

// ============================================================================
// Developer Components
// ============================================================================
export { UserManagementTable } from "./components/admin/tables/user-management-table";
export { BanUserDialog } from "./components/admin/dialogs/ban-user-dialog";
export { ImpersonateUserDialog } from "./components/admin/dialogs/impersonate-user-dialog";


// ============================================================================
// User Components
// ============================================================================
export { UserButton } from "./components/user/buttons/user-button";
export { UserAvatar } from "./components/user/components/user-avatar";

// ============================================================================
// Utility Components
// ============================================================================
export { SignedIn } from "./components/utility/components/signed-in";
export { SignedOut } from "./components/utility/components/signed-out";
export { AuthLoading } from "./components/utility/components/auth-loading";
export { RedirectToSignIn } from "./components/utility/components/redirect-to-sign-in";
export { RedirectToSignUp } from "./components/utility/components/redirect-to-sign-up";
export { PasswordInput } from "./components/utility/components/password-input";
export { FormError } from "./components/utility/components/form-error";
export type { ProviderIcon } from "./components/utility/components/provider-icons";

// ============================================================================
// Web3/SIWE Components
// ============================================================================
export { SiweSignInButton } from "./components/web3/buttons/siwe-sign-in-button";
export type {
  SiweSignInButtonProps,
  SiweSignInButtonClassNames
} from "./components/web3/buttons/siwe-sign-in-button";

export { WalletConnectionCard } from "./components/web3/cards/wallet-connection-card";
export type {
  WalletConnectionCardProps,
  WalletConnectionCardClassNames
} from "./components/web3/cards/wallet-connection-card";

// ============================================================================
// Enterprise SSO Components
// ============================================================================
export { OIDCConsentScreen } from "./components/enterprise/screens/oidc-consent-screen";
export { SSOConfigCard } from "./components/enterprise/cards/sso-config-card";
export { SAMLSetupWizard } from "./components/enterprise/wizards/saml-setup-wizard";
export { OIDCProviderCard } from "./components/enterprise/cards/oidc-provider-card";


// ============================================================================
// Hooks
// ============================================================================
export { useIsHydrated } from "./hooks/use-hydrated";
export { useLang } from "./hooks/use-lang";
export { useOnSuccessTransition } from "./hooks/use-success-transition";
export { useCurrentOrganization } from "./hooks/use-current-organization";
export { useAuthData } from "./hooks/use-auth-data";
export { useAuthenticate } from "./hooks/use-authenticate";
export { useTheme } from "./hooks/use-theme";
export { useOrganizationMembers } from "./hooks/use-organization-members";

// ============================================================================
// Context Providers
// ============================================================================
export { AuthUIProvider, AuthUIContext } from "./lib/auth-ui-provider";

// ============================================================================
// Utilities
// ============================================================================
export { socialProviders } from "./lib/social-providers";
export { getViewByPath } from "./lib/utils";
