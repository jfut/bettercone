export { cn } from "./lib/utils";

// Types
export type {
  BetterAuthClient,
  BetterAuthSession,
  BetterAuthOrganization,
  BetterAuthSubscription,
} from "./types/auth";

export type { BillingLocalization } from "./types/localization";

export type { 
  Subscription,
  SubscriptionStatus,
  SubscriptionPlan,
  PaymentMethod,
  PaymentMethodType,
  Invoice,
  InvoiceStatus,
  CheckoutSessionParams,
  BillingPortalParams
} from "./types/subscription";

// UI Primitives
export { Button, buttonVariants } from "./components/ui/button";
export { Badge, badgeVariants } from "./components/ui/badge";
export { Skeleton } from "./components/ui/skeleton";
export { Progress } from "./components/ui/progress";
export { Separator } from "./components/ui/separator";
export { Stepper, type StepperProps, type Step } from "./components/ui/stepper";
export { UserView, type UserViewProps, type UserViewClassNames } from "./components/ui/user-view";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";

// ============================================================================
// Billing Components
// ============================================================================
export {
  SubscriptionCard,
  SubscriptionCardSkeleton
} from "./components/billing/subscription-card";
export type { SubscriptionCardProps } from "./components/billing/subscription-card";

export {
  PaymentMethodCard,
  PaymentMethodCardSkeleton
} from "./components/billing/payment-method-card";
export type { PaymentMethodCardProps } from "./components/billing/payment-method-card";

export {
  InvoiceHistoryCard,
  InvoiceHistoryCardSkeleton
} from "./components/billing/invoice-history-card";
export type { InvoiceHistoryCardProps } from "./components/billing/invoice-history-card";

export {
  BillingDashboard
} from "./components/billing/billing-dashboard";
export type { BillingDashboardProps } from "./components/billing/billing-dashboard";

// Pricing Components
export {
  PricingCard,
  PricingCardSkeleton
} from "./components/pricing/pricing-card";
export type { 
  PricingCardProps,
  PricingPlan,
  BillingInterval
} from "./components/pricing/pricing-card";

// Usage Components
export {
  ApiUsageCard,
  ApiUsageCardSkeleton
} from "./components/usage/api-usage-card";
export type { 
  ApiUsageCardProps,
  ApiUsageCardClassNames,
  ApiUsageCardLocalization
} from "./components/usage/api-usage-card";

export {
  StorageUsageCard,
  StorageUsageCardSkeleton
} from "./components/usage/storage-usage-card";
export type { StorageUsageCardProps } from "./components/usage/storage-usage-card";

export {
  FeatureAccessCard,
  FeatureAccessCardSkeleton
} from "./components/usage/feature-access-card";
export type { 
  FeatureAccessCardProps,
  FeatureAccess,
  FeatureConfig
} from "./components/usage/feature-access-card";

export {
  UsageDashboard,
  UsageDashboardSkeleton
} from "./components/usage/usage-dashboard";
export type { UsageDashboardProps } from "./components/usage/usage-dashboard";

// Team Components
export {
  SeatAllocationCard,
  SeatAllocationCardSkeleton
} from "./components/team/seat-allocation-card";
export type { 
  SeatAllocationCardProps,
  SeatAllocationData,
  TeamMember
} from "./components/team/seat-allocation-card";

export {
  TeamBillingCard,
  TeamBillingCardSkeleton
} from "./components/team/team-billing-card";
export type { TeamBillingCardProps } from "./components/team/team-billing-card";

export {
  TeamDashboard,
  TeamDashboardSkeleton
} from "./components/team/team-dashboard";
export type { TeamDashboardProps } from "./components/team/team-dashboard";

// ============================================================================
// Authentication Components
// ============================================================================
export { AuthView } from "./components/auth/auth-view";
export { AuthForm } from "./components/auth/auth-form";
export { AuthCallback } from "./components/auth/auth-callback";
export { PasskeyButton } from "./components/auth/passkey-button";
export { ProviderButton } from "./components/auth/provider-button";
export { MagicLinkButton } from "./components/auth/magic-link-button";
export { EmailOTPButton } from "./components/auth/email-otp-button";
export { OneTap } from "./components/auth/one-tap";
export { SignOut } from "./components/auth/sign-out";

// Phone Authentication
export { PhoneSignInForm } from "./components/auth/forms/phone-sign-in-form";
export { PhoneSignUpForm } from "./components/auth/forms/phone-sign-up-form";

// Anonymous Authentication
export { AnonymousSignInButton } from "./components/auth/anonymous-sign-in-button";
export type { AnonymousSignInButtonProps } from "./components/auth/anonymous-sign-in-button";

// Last Login Badge
export { LastLoginBadge } from "./components/auth/last-login-badge";

// Device Authorization (OAuth 2.0)
export { DeviceAuthorizationCard } from "./components/auth/device-authorization-card";
export { DeviceApprovalCard } from "./components/auth/device-approval-card";
export { DeviceCodeDisplay } from "./components/auth/device-code-display";

// ============================================================================
// Security Components
// ============================================================================
export { PasskeyCell } from "./components/security/passkey-cell";
export { PasskeysCard } from "./components/security/passkeys-card";
export { PasskeySetupWizard } from "./components/passkey/passkey-setup-wizard";
export { TwoFactorCard } from "./components/security/two-factor-card";
export { TwoFactorPasswordDialog } from "./components/security/two-factor-password-dialog";
export { BackupCodesDialog } from "./components/security/backup-codes-dialog";
export { ChangePasswordCard } from "./components/security/change-password-card";
export { SessionsCard } from "./components/security/sessions-card";
export { SessionCell } from "./components/security/session-cell";

// Email Management
export { ChangeEmailCard } from "./components/settings/security/change-email-card";

// Phone Number Management
export { PhoneNumberCard } from "./components/security/phone-number-card";

// Email Verification
export { EmailVerificationBanner } from "./components/security/email-verification-banner";
export type { EmailVerificationBannerProps } from "./components/security/email-verification-banner";


// ============================================================================
// Organization Components
// ============================================================================
export { OrganizationSwitcher } from "./components/organization/organization-switcher";
export { CreateOrganizationDialog } from "./components/organization/create-organization-dialog";
export { DeleteOrganizationCard } from "./components/organization/delete-organization-card";
export { OrganizationMembersCard } from "./components/organization/organization-members-card";
export { RemoveMemberDialog } from "./components/organization/remove-member-dialog";
export { UpdateMemberRoleDialog } from "./components/organization/update-member-role-dialog";
export { OrganizationInvitationsCard } from "./components/organization/organization-invitations-card";
export { InviteMemberDialog } from "./components/organization/invite-member-dialog";
export { AcceptInvitationCard } from "./components/organization/accept-invitation-card";
export { UserInvitationsCard } from "./components/organization/user-invitations-card";
export { OrganizationNameCard } from "./components/organization/organization-name-card";
export { OrganizationSlugCard } from "./components/organization/organization-slug-card";
export { OrganizationLogoCard } from "./components/organization/organization-logo-card";
export { LeaveOrganizationDialog } from "./components/organization/leave-organization-dialog";
export { TransferOwnershipDialog } from "./components/organization/transfer-ownership-dialog";

// ============================================================================
// Account Components
// ============================================================================
export { AccountView } from "./components/account/account-view";
export { DeleteAccountCard } from "./components/account/delete-account-card";
export { DeleteAccountDialog } from "./components/account/delete-account-dialog";
export { AnonymousUpgradeCard } from "./components/account/anonymous-upgrade-card";
export type { AnonymousUpgradeCardProps } from "./components/account/anonymous-upgrade-card";
export { LinkAccountCard } from "./components/account/link-account-card";
export { UnlinkAccountCard } from "./components/account/unlink-account-card";

// ============================================================================
// Developer Components
// ============================================================================
export { ApiKeysCard } from "./components/developer/api-keys-card";
export { ApiKeyCell } from "./components/developer/api-key-cell";
export { CreateApiKeyDialog } from "./components/developer/create-api-key-dialog";

// ============================================================================
// Admin Components
// ============================================================================
export { UserManagementTable } from "./components/admin/user-management-table";
export { BanUserDialog } from "./components/admin/ban-user-dialog";
export { ImpersonateUserDialog } from "./components/admin/impersonate-user-dialog";

// ============================================================================
// User Components
// ============================================================================
export { UserButton } from "./components/user/user-button";
export { UserAvatar } from "./components/user/user-avatar";

// ============================================================================
// Utility Components
// ============================================================================
export { SignedIn } from "./components/utility/signed-in";
export { SignedOut } from "./components/utility/signed-out";
export { AuthLoading } from "./components/utility/auth-loading";
export { RedirectToSignIn } from "./components/utility/redirect-to-sign-in";
export { RedirectToSignUp } from "./components/utility/redirect-to-sign-up";
export { PasswordInput } from "./components/utility/password-input";
export { FormError } from "./components/utility/form-error";
export type { ProviderIcon } from "./components/utility/provider-icons";

// ============================================================================
// Web3/SIWE Components
// ============================================================================
export { SiweSignInButton } from "./components/web3/siwe-sign-in-button";
export type {
  SiweSignInButtonProps,
  SiweSignInButtonClassNames
} from "./components/web3/siwe-sign-in-button";

export { WalletConnectionCard } from "./components/web3/wallet-connection-card";
export type {
  WalletConnectionCardProps,
  WalletConnectionCardClassNames
} from "./components/web3/wallet-connection-card";

// ============================================================================
// Enterprise SSO Components
// ============================================================================
export { SSOConfigCard } from "./components/enterprise/sso-config-card";
export type {
  SSOConfigCardProps,
  SSOProvider,
  OIDCConfig,
  SAMLConfig,
  AttributeMapping,
  IDPMetadata,
  SPMetadata
} from "./components/enterprise/sso-config-card";

export { SAMLSetupWizard } from "./components/enterprise/saml-setup-wizard";
export type {
  SAMLSetupWizardProps,
  SAMLConfiguration,
  SAMLAttributeMapping
} from "./components/enterprise/saml-setup-wizard";

export { OIDCProviderCard } from "./components/enterprise/oidc-provider-card";
export type {
  OIDCProviderCardProps,
  OAuth2Client,
  OAuth2AccessToken,
  ClientRegistrationData
} from "./components/enterprise/oidc-provider-card";

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

// ============================================================================
// Context Providers
// ============================================================================
export { AuthUIProvider, AuthUIContext } from "./lib/auth-ui-provider";

// ============================================================================
// Utilities
// ============================================================================
export { socialProviders } from "./lib/social-providers";
export { getViewByPath } from "./lib/utils";
