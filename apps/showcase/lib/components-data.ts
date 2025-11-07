// All visible UI components from @bettercone/ui package
export const componentsByCategory = {
  Authentication: [
    { name: "AuthView", description: "Complete authentication UI with sign in and sign up", slug: "auth-view" },
    { name: "AuthForm", description: "Customizable authentication form component", slug: "auth-form" },
    { name: "AuthCallback", description: "Handle OAuth callback flows", slug: "auth-callback" },
    { name: "AuthLoading", description: "Loading state for authentication", slug: "auth-loading" },
    { name: "SignedIn", description: "Conditionally render content for authenticated users", slug: "signed-in" },
    { name: "SignedOut", description: "Conditionally render content for unauthenticated users", slug: "signed-out" },
    { name: "RedirectToSignIn", description: "Redirect unauthenticated users to sign in", slug: "redirect-to-sign-in" },
    { name: "RedirectToSignUp", description: "Redirect users to sign up page", slug: "redirect-to-sign-up" },
    { name: "SignOut", description: "Sign out button component", slug: "sign-out" },
    { name: "OneTap", description: "Google One Tap sign in", slug: "one-tap" },
    { name: "AnonymousSignInButton", description: "Guest authentication without PII", slug: "anonymous-sign-in-button" },
  ],
  "Web3 & SIWE": [
    { name: "SiweSignInButton", description: "Sign in with Ethereum (SIWE) button", slug: "siwe-sign-in-button" },
    { name: "WalletConnectionCard", description: "Manage Web3 wallet connections", slug: "wallet-connection-card" },
  ],
  "User & Account": [
    { name: "UserButton", description: "User profile dropdown menu", slug: "user-button" },
    { name: "UserView", description: "Complete user profile view", slug: "user-view" },
    { name: "UserAvatar", description: "User avatar with fallback", slug: "user-avatar" },
    { name: "AccountView", description: "Account settings and management", slug: "account-view" },
    { name: "DeleteAccountCard", description: "Delete account with confirmation", slug: "delete-account-card" },
    { name: "DeleteAccountDialog", description: "Delete account confirmation dialog", slug: "delete-account-dialog" },
    { name: "LinkAccountCard", description: "Link OAuth providers to account", slug: "link-account-card" },
    { name: "UnlinkAccountCard", description: "Unlink OAuth providers from account", slug: "unlink-account-card" },
    { name: "AnonymousUpgradeCard", description: "Prompt guests to upgrade account", slug: "anonymous-upgrade-card" },
  ],
  "Password & Security": [
    { name: "PasswordInput", description: "Password input with show/hide toggle", slug: "password-input" },
    { name: "ChangePasswordCard", description: "Change password form", slug: "change-password-card" },
    { name: "ChangeEmailCard", description: "Change email with verification", slug: "change-email-card" },
    { name: "TwoFactorCard", description: "Enable/disable 2FA", slug: "two-factor-card" },
    { name: "EmailVerificationBanner", description: "Prompt users to verify their email", slug: "email-verification-banner" },
  ],
  "Passkeys & Auth Methods": [
    { name: "PasskeysCard", description: "Manage WebAuthn passkeys", slug: "passkeys-card" },
    { name: "PasskeyButton", description: "Sign in with passkey button", slug: "passkey-button" },
    { name: "PasskeyCell", description: "Individual passkey list item", slug: "passkey-cell" },
    { name: "PasskeySetupWizard", description: "5-step passkey registration wizard", slug: "passkey-setup-wizard" },
    { name: "ProviderButton", description: "OAuth provider sign in button", slug: "provider-button" },
    { name: "MagicLinkButton", description: "Magic link authentication button", slug: "magic-link-button" },
    { name: "EmailOTPButton", description: "Email OTP authentication button", slug: "email-otp-button" },
    { name: "LastLoginBadge", description: "Badge showing last authentication method used", slug: "last-login-badge" },
    { name: "DeviceAuthorizationCard", description: "Enter device authorization codes (OAuth 2.0)", slug: "device-authorization-card" },
    { name: "DeviceApprovalCard", description: "Approve or deny device authorization requests", slug: "device-approval-card" },
    { name: "DeviceCodeDisplay", description: "Display codes for CLI/device apps", slug: "device-code-display" },
  ],
  "Phone Authentication": [
    { name: "PhoneNumberCard", description: "Phone number management card", slug: "phone-number-card" },
    { name: "PhoneSignInForm", description: "Sign in with phone number", slug: "phone-sign-in-form" },
    { name: "PhoneSignUpForm", description: "Sign up with phone number", slug: "phone-sign-up-form" },
  ],
  Sessions: [
    { name: "SessionsCard", description: "Active sessions management", slug: "sessions-card" },
    { name: "SessionCell", description: "Individual session list item", slug: "session-cell" },
  ],
  Organizations: [
    { name: "OrganizationSwitcher", description: "Switch between organizations", slug: "organization-switcher" },
    { name: "OrganizationMembersCard", description: "Organization members list and management", slug: "organization-members-card" },
    { name: "OrganizationInvitationsCard", description: "Manage organization invitations", slug: "organization-invitations-card" },
    { name: "OrganizationLogoCard", description: "Organization logo upload and management", slug: "organization-logo-card" },
    { name: "OrganizationNameCard", description: "Edit organization name", slug: "organization-name-card" },
    { name: "OrganizationSlugCard", description: "Edit organization slug", slug: "organization-slug-card" },
    { name: "CreateOrganizationDialog", description: "Create new organization dialog", slug: "create-organization-dialog" },
    { name: "DeleteOrganizationCard", description: "Delete organization card", slug: "delete-organization-card" },
    { name: "LeaveOrganizationDialog", description: "Leave organization confirmation", slug: "leave-organization-dialog" },
    { name: "TransferOwnershipDialog", description: "Transfer organization ownership", slug: "transfer-ownership-dialog" },
  ],
  "Members & Invitations": [
    { name: "InviteMemberDialog", description: "Invite members to organization", slug: "invite-member-dialog" },
    { name: "AcceptInvitationCard", description: "Accept organization invitation", slug: "accept-invitation-card" },
    { name: "UserInvitationsCard", description: "User's pending invitations", slug: "user-invitations-card" },
    { name: "UpdateMemberRoleDialog", description: "Update member role dialog", slug: "update-member-role-dialog" },
    { name: "RemoveMemberDialog", description: "Remove member confirmation", slug: "remove-member-dialog" },
  ],
  "API Keys": [
    { name: "ApiKeysCard", description: "API keys management card", slug: "api-keys-card" },
    { name: "ApiKeyCell", description: "Individual API key list item", slug: "api-key-cell" },
    { name: "CreateApiKeyDialog", description: "Create new API key dialog", slug: "create-api-key-dialog" },
  ],
  "Admin Tools": [
    { name: "UserManagementTable", description: "Manage users with ban, delete, and impersonate", slug: "user-management-table" },
    { name: "BanUserDialog", description: "Ban users with reason and duration", slug: "ban-user-dialog" },
    { name: "ImpersonateUserDialog", description: "Impersonate users for support", slug: "impersonate-user-dialog" },
  ],
  "Billing & Pricing": [
    { name: "BillingDashboard", description: "Complete billing dashboard", slug: "billing-dashboard" },
    { name: "SubscriptionCard", description: "Current subscription details", slug: "subscription-card" },
    { name: "PaymentMethodCard", description: "Payment method management", slug: "payment-method-card" },
    { name: "InvoiceHistoryCard", description: "Invoice history and downloads", slug: "invoice-history-card" },
    { name: "PricingCard", description: "Pricing plan card", slug: "pricing-card" },
  ],
  "Team & Usage": [
    { name: "TeamDashboard", description: "Team management dashboard", slug: "team-dashboard" },
    { name: "TeamBillingCard", description: "Team billing information", slug: "team-billing-card" },
    { name: "SeatAllocationCard", description: "Seat usage and allocation", slug: "seat-allocation-card" },
    { name: "UsageDashboard", description: "Usage metrics dashboard", slug: "usage-dashboard" },
    { name: "ApiUsageCard", description: "API usage metrics", slug: "api-usage-card" },
    { name: "StorageUsageCard", description: "Storage usage metrics", slug: "storage-usage-card" },
    { name: "FeatureAccessCard", description: "Feature access based on plan", slug: "feature-access-card" },
  ],
  "Enterprise SSO": [
    { name: "SSOConfigCard", description: "Configure SAML and OIDC SSO providers", slug: "sso-config-card" },
    { name: "SAMLSetupWizard", description: "Step-by-step SAML 2.0 setup wizard", slug: "saml-setup-wizard" },
    { name: "OIDCProviderCard", description: "OAuth2/OIDC client application management", slug: "oidc-provider-card" },
  ],
};

// Generate usage example for each component
export function getComponentUsage(componentName: string): string {
  return `import { ${componentName} } from '@bettercone/ui';

export default function Page() {
  return <${componentName} />;
}`;
}

// Flatten for easy lookup
export const allComponentsMap = Object.entries(componentsByCategory).reduce((acc, [category, components]) => {
  components.forEach(comp => {
    acc[comp.slug] = {
      ...comp,
      category,
      usage: getComponentUsage(comp.name),
    };
  });
  return acc;
}, {} as Record<string, { name: string; description: string; slug: string; category: string; usage: string; }>);
