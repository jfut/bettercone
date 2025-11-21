"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

const changelog = [
  {
    version: "0.5.2",
    date: "2025-11-21",
    title: "React 19 Support & Documentation Cleanup",
    type: "feature",
    changes: [
      {
        category: "🛠️ Peer Dependencies - React 19 Compatibility",
        items: [
          "Extended lucide-react peer dependency range for React 19 support",
          "Updated from ^0.300.0 to ^0.300.0 || ^0.400.0 || ^0.500.0",
          "Supports latest lucide-react versions (v0.546.0+)",
          "Eliminates peer dependency conflicts with modern React stacks",
          "Enables smooth CLI installation: npx @bettercone/ui init works everywhere",
        ],
      },
      {
        category: "📚 Documentation Cleanup",
        items: [
          "Removed changelog duplication from README.md",
          "README now points to CHANGELOG.md for detailed release notes",
          "Cleaner, more focused README with installation and usage examples",
          "Updated QUICK_START.md with CLI installation method",
          "Updated showcase version badges to v0.5.2",
        ],
      },
      {
        category: "🔧 Enhanced Compatibility",
        items: [
          "Broader peer dependency ranges for modern stack compatibility",
          "No breaking changes - all existing functionality preserved",
          "Improved developer experience with cleaner documentation",
        ],
      },
    ],
  },
  {
    version: "0.5.1",
    date: "2025-11-21",
    title: "Enhanced Compatibility & Modern Stack Support",
    type: "feature",
    changes: [
      {
        category: "🛠️ Peer Dependencies - Better Compatibility",
        items: [
          "Relaxed lucide-react peer dependency: ^0.300.0 to ^0.344.0 → ^0.300.0",
          "Supports latest lucide-react versions (v0.546.0+)",
          "Relaxed tailwind-merge peer dependency: ^2.0.0 → ^2.0.0 || ^3.0.0",
          "Supports Tailwind v3.x series",
          "Relaxed tailwindcss peer dependency: ^3.4.0 → ^3.4.0 || ^4.0.0",
          "Supports upcoming Tailwind v4.x",
        ],
      },
      {
        category: "✅ Compatibility Improvements",
        items: [
          "Eliminates peer dependency conflicts during npm install",
          "Supports latest library versions (Lucide v0.546, Tailwind v4)",
          "Enables smooth CLI installation: npx @bettercone/ui init works everywhere",
          "Compatible with React 19, Tailwind v4, and modern stacks",
          "No breaking changes - all existing functionality preserved",
        ],
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2025-11-21",
    title: "Clean Architecture: No Bundle Bloat",
    type: "major",
    changes: [
      {
        category: "🚀 Major Architectural Improvement",
        items: [
          "Eliminated 712KB+ bundle bloat by removing shadcn/ui component bundling",
          "shadcn/ui components are no longer bundled in @bettercone/ui package",
          "Automatic CLI installation - npx @bettercone/ui init installs everything",
          "50%+ bundle size reduction - From ~1.4MB to ~700KB",
          "Clean separation - Bettercone focuses on specialized auth components only",
        ],
      },
      {
        category: "🛠️ Enhanced CLI Tool",
        items: [
          "Smart one-command setup: npx @bettercone/ui init",
          "Detects existing shadcn/ui installations",
          "Installs missing dependencies automatically",
          "Installs essential shadcn/ui components",
          "Comprehensive component verification (dependencies + files)",
        ],
      },
      {
        category: "📦 Bundle Size Optimization",
        items: [
          "Before: ~1.4MB (including shadcn/ui components)",
          "After: ~700KB (auth components only)",
          "Savings: 50%+ bundle size reduction",
        ],
      },
      {
        category: "🔄 Component Architecture Refinement",
        items: [
          "Bettercone focuses on specialized features:",
          "🔐 Authentication & Security - Core auth components",
          "🏢 Organization Management - Team and org features",
          "💳 Billing & Subscriptions - Payment integration",
          "🔑 API Key Management - Developer tools",
          "shadcn/ui handles UI primitives:",
          "🎨 UI Components - Button, Card, Input, etc.",
          "🎯 Design System - Consistent styling",
          "🔧 Customization - Full control over components",
        ],
      },
      {
        category: "💥 Breaking Changes",
        items: [
          "Installation now requires CLI: npx @bettercone/ui init",
          "Old way still works but manual: npm install + npx shadcn@latest init + add components",
          "shadcn/ui components no longer exported from @bettercone/ui",
          "Correct: import { Button } from '@/components/ui/button'",
          "Incorrect: import { Button } from '@bettercone/ui'",
        ],
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2025-11-10",
    title: "API Key Components Overhaul",
    type: "major",
    changes: [
      {
        category: "Breaking Changes",
        items: [
          "Removed ApiUsageCard, UsageDashboard, UsageHistoryChart, FeatureAccessCard (not Better Auth native)",
          "Removed @bettercone/usage-tracking plugin package (custom business logic)",
          "Migration: Use ApiKeyUsageCard for per-key usage tracking instead",
        ],
      },
      {
        category: "New Components",
        items: [
          "ApiKeyUsageCard - Per-key usage visualization with progress bars, rate limits, refill countdowns",
          "UpdateApiKeyDialog - Edit API key settings with three-tab interface (Basic | Usage & Refills | Rate Limits)",
        ],
      },
      {
        category: "Enhanced Components",
        items: [
          "ApiKeyCell - Added remaining requests, rate limits, refill countdown, permissions badges",
          "CreateApiKeyDialog - Added usage limits, auto-refill settings, rate limiting configuration",
        ],
      },
      {
        category: "Component Organization",
        items: [
          "Moved API Key components from components/developer/ to components/apiKey/",
          "Import paths remain unchanged - no breaking changes to public API",
        ],
      },
      {
        category: "Type Enhancements",
        items: [
          "Updated ApiKey interface with all Better Auth native fields",
          "Added: remaining, refillAmount, refillInterval, lastRefillAt",
          "Added: rateLimitEnabled, rateLimitTimeWindow, rateLimitMax, requestCount, lastRequest",
          "Added: expiresAt, enabled, permissions, metadata",
        ],
      },
      {
        category: "Better Auth Features Now Exposed",
        items: [
          "Usage caps & remaining requests with progress bars",
          "Auto-refill schedules with countdown timers",
          "Rate limiting per time window with tracking",
          "Permissions management with badge display",
          "Enable/disable toggle in UpdateApiKeyDialog",
          "Expiration dates with visual indicators",
          "Metadata storage support",
        ],
      },
    ],
  },
  {
    version: "0.3.12",
    date: "2025-11-10",
    title: "Build Fix - Use Client Directive",
    type: "fix",
    changes: [
      {
        category: "Build",
        items: [
          "Added 'use client' directive to bundled output files",
          "Fixed Next.js client component errors when importing from package",
          "Implemented post-build script to inject directive into dist files",
          "Bundled react-hook-form internally for better compatibility",
        ],
      },
    ],
  },
  {
    version: "0.3.11",
    date: "2025-11-10",
    title: "React Hook Form Dependency Fix",
    type: "fix",
    changes: [
      {
        category: "Build",
        items: [
          "Externalized react-hook-form dependency to fix module resolution errors",
          "Fixed 'FormProvider is not exported' errors in consuming applications",
          "Added react-hook-form to tsup external dependencies configuration",
        ],
      },
    ],
  },
  {
    version: "0.3.10",
    date: "2025-11-10",
    title: "CSS Export Fix",
    type: "fix",
    changes: [
      {
        category: "Build",
        items: [
          "Added styles.css to published package distribution",
          "Fixed CSS export path (@bettercone/ui/css) resolution",
        ],
      },
    ],
  },
  {
    version: "0.3.9",
    date: "2025-11-10",
    title: "Modern Design System Update",
    type: "feature",
    changes: [
      {
        category: "Style Modernization",
        items: [
          "UserAvatar and OrganizationLogo - Updated to rounded-lg styling (sm size remains rounded-full)",
          "Typography - Changed from font-semibold to font-medium across all view components",
          "Colors - Replaced opacity-70 with semantic text-muted-foreground for consistency",
          "Spacing - Modernized with consistent gap-2 and px-2 py-1.5 patterns",
          "UserButton - Updated to match modern design patterns",
          "OrganizationSwitcher - Redesigned style with proper labels",
        ],
      },
      {
        category: "Bug Fixes",
        items: [
          "Fixed setActiveSession undefined guard check in UserButton",
          "Removed deprecated warning message for UserButton size prop",
        ],
      },
    ],
  },
  {
    version: "0.3.8",
    date: "2025-11-08",
    title: "Dashboard & View Components",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "OrganizationView - Complete organization management interface",
          "UsageHistoryChart - Interactive usage visualization with Shadcn Charts + Recharts",
          "OrganizationSettingsCards - Composite organization settings component",
        ],
      },
      {
        category: "Features",
        items: [
          "Tab-based navigation for OrganizationView (Settings, Members, API Keys)",
          "Responsive design: desktop sidebar, mobile drawer",
          "Multiple chart types: Line, Bar, Area with smooth transitions",
          "Time range controls: 7d, 30d, 90d, 1y, all time",
          "Automatic trend indicators (TrendingUp/TrendingDown badges)",
          "Interactive tooltips with formatted values",
          "Client-side time range filtering",
          "Deep linking support for section navigation",
          "Accessibility layer for keyboard navigation and screen readers",
        ],
      },
      {
        category: "Enhancements",
        items: [
          "ApiUsageCard - Enhanced with plugin support",
          "FeatureAccessCard - Enhanced with plugin support",
          "UsageDashboard - Enhanced with plugin support",
          "OrganizationView - Made organizationOptions optional with safe navigation",
        ],
      },
    ],
  },
  {
    version: "0.3.7",
    date: "2025-11-07",
    title: "🎉 Complete Better Auth Coverage - Enterprise SSO & OIDC Provider",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "SSOConfigCard - Complete OIDC & SAML SSO configuration for enterprise customers",
          "SAMLSetupWizard - Guided 5-step SAML setup wizard with IdP presets",
          "OIDCProviderCard - OAuth2/OIDC Provider client application management (RFC 7591)",
        ],
      },
      {
        category: "Features",
        items: [
          "Full OIDC (OpenID Connect) SSO configuration",
          "Complete SAML 2.0 SSO setup with metadata parsing",
          "OAuth2/OIDC Provider - manage client applications",
          "Dynamic client registration (RFC 7591 compliant)",
          "Support for Azure AD, Okta, Google Workspace, OneLogin, Auth0, JumpCloud",
          "XML metadata auto-parsing for SAML",
          "Attribute mapping for OIDC claims and SAML assertions",
          "Client types: web, SPA, native, machine-to-machine",
          "One-time secret display for OAuth2 clients",
          "Connection testing before completion",
        ],
      },
      {
        category: "Documentation",
        items: [
          "Streamlined enterprise component docs (49% reduction in length)",
          "Comprehensive setup guides for all major IdPs",
          "RFC 7591 and SAML 2.0 specification references",
          "Better Auth SSO and OIDC Provider plugin integration guides",
        ],
      },
      {
        category: "Milestone",
        items: [
          "🎉 100% Better Auth coverage achieved",
          "All Better Auth plugins fully implemented",
          "Complete authentication, security, billing, and enterprise features",
        ],
      },
    ],
  },
  {
    version: "0.3.6",
    date: "2024-11-06",
    title: "Device Authorization Components",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "DeviceAuthorizationCard - User code input for device authorization",
          "DeviceApprovalCard - Approve/deny device authorization requests",
          "DeviceCodeDisplay - Display codes for CLI/IoT applications",
          "LastLoginBadge - Show last authentication method used",
        ],
      },
      {
        category: "Features",
        items: [
          "OAuth 2.0 Device Authorization Grant (RFC 8628) support",
          "Auto-formatting for device codes (ABCD-1234)",
          "QR code support for mobile scanning",
          "Real-time polling for authorization status",
          "Countdown timer with color-coded urgency",
          "Copy-to-clipboard for URLs and codes",
          "Support for Smart TVs, CLI apps, IoT devices",
          "Better Auth Device Authorization plugin integration",
        ],
      },
      {
        category: "Improvements",
        items: [
          "AuthView integration with anonymous and SIWE authentication",
        ],
      },
    ],
  },
  {
    version: "0.3.5",
    date: "2024-11-06",
    title: "Admin Components",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "UserManagementTable - Admin table with pagination, search, and actions",
          "BanUserDialog - Ban users with reason and duration",
          "ImpersonateUserDialog - Impersonate users for support",
        ],
      },
      {
        category: "Features",
        items: [
          "User management with pagination (10 per page)",
          "Search by email or name",
          "Ban/unban users with custom duration",
          "Delete users with confirmation",
          "Impersonate users for support purposes",
          "Status badges (active/banned, verified/unverified)",
          "Role display support",
          "Better Auth admin plugin integration",
        ],
      },
      {
        category: "Infrastructure",
        items: [
          "Added Table UI component",
        ],
      },
    ],
  },
  {
    version: "0.3.4",
    date: "2024-11-06",
    title: "Passkeys, Organizations & Account Management",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "PasskeySetupWizard - 5-step passkey registration wizard",
          "TransferOwnershipDialog - Organization ownership transfer",
          "LinkAccountCard - Link OAuth providers to accounts",
          "UnlinkAccountCard - Unlink OAuth providers from accounts",
          "ChangeEmailCard - Email change with verification",
          "EmailVerificationBanner - Prompt email verification",
        ],
      },
      {
        category: "Features",
        items: [
          "Platform vs cross-platform authenticator selection",
          "Organization ownership transfer with role management",
          "OAuth account linking and unlinking",
          "Two-step email change process with verification",
          "Minimum account protection (prevent unlinking last account)",
          "AlertDialog and RadioGroup UI components added",
        ],
      },
    ],
  },
  {
    version: "0.3.3",
    date: "2024-11-05",
    title: "Anonymous Authentication",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "AnonymousSignInButton - Guest authentication without PII",
          "AnonymousUpgradeCard - Prompt guests to upgrade accounts",
        ],
      },
      {
        category: "Features",
        items: [
          "One-click anonymous/guest authentication",
          "Account linking support (email and OAuth)",
          "Full localization and customization options",
          "Better Auth anonymous plugin integration",
        ],
      },
      {
        category: "Documentation",
        items: [
          "Complete setup guide for anonymous authentication",
          "Component API reference pages",
          "Best practices and examples",
        ],
      },
    ],
  },
  {
    version: "0.3.2",
    date: "2024-11-04",
    title: "Documentation Updates",
    type: "docs",
    changes: [
      {
        category: "Documentation",
        items: [
          "Enhanced README with v0.3.0 and v0.3.1 features",
          "Improved package documentation on npm",
        ],
      },
    ],
  },
  {
    version: "0.3.1",
    date: "2024-11-03",
    title: "Bug Fixes",
    type: "fix",
    changes: [
      {
        category: "Bug Fixes",
        items: [
          "Fixed wallet schema for SIWE components",
          "Improved TypeScript type definitions",
        ],
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2024-11-02",
    title: "Better Auth Stripe & SIWE",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "BillingDashboard - Complete billing overview",
          "SubscriptionCard - Manage subscriptions",
          "PaymentMethodCard - Payment method management",
          "InvoiceHistoryCard - Invoice history with downloads",
          "SiweSignInButton - Ethereum wallet authentication",
          "SiweSignInForm - Complete SIWE auth form",
          "WalletConnectButton - Connect wallet button",
        ],
      },
      {
        category: "Features",
        items: [
          "Full Stripe plugin support for Better Auth",
          "Sign-In with Ethereum (SIWE) integration",
          "Subscription management workflows",
          "Payment method handling",
          "Invoice viewing and downloading",
        ],
      },
    ],
  },
  {
    version: "0.2.2",
    date: "2024-10-28",
    title: "Phone Authentication",
    type: "feature",
    changes: [
      {
        category: "New Components",
        items: [
          "PhoneSignInForm - Sign in with phone + password",
          "PhoneSignUpForm - Sign up with phone + OTP",
          "PhoneNumberCard - Manage phone number in settings",
        ],
      },
      {
        category: "Features",
        items: [
          "Phone number authentication support",
          "SMS OTP verification",
          "Phone number management in account settings",
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2024-10-25",
    title: "Production Release",
    type: "feature",
    changes: [
      {
        category: "Components",
        items: [
          "71 production-ready components",
          "Authentication, Security, Organizations",
          "Billing, Pricing, Team, Usage tracking",
          "Complete API key management",
        ],
      },
      {
        category: "Features",
        items: [
          "Full Better Auth integration",
          "Multi-framework support (Next.js, Vite, Remix)",
          "Backend-agnostic (Convex, Prisma, Supabase, Drizzle)",
          "Complete TypeScript support",
          "Full customization with Tailwind CSS",
          "i18n ready",
        ],
      },
    ],
  },
];

const typeColors: Record<string, string> = {
  feature: "default",
  fix: "destructive",
  docs: "secondary",
};

const typeLabels: Record<string, string> = {
  feature: "Feature",
  fix: "Bug Fix",
  docs: "Documentation",
};

export default function ChangelogPage() {
  return (
    <main className="container max-w-4xl py-12 mx-auto px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Changelog</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            All notable changes to @bettercone/ui
          </p>
        </div>

        {/* Changelog Items */}
        <div className="space-y-8 mt-8">
          {changelog.map((release) => (
            <Card key={release.version}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">
                        v{release.version}
                      </CardTitle>
                      <Badge variant={typeColors[release.type] as "default" | "destructive" | "secondary"}>
                        {typeLabels[release.type]}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {release.title} • {release.date}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {release.changes.map((change, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-sm mb-2">
                        {change.category}
                      </h3>
                      <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                        {change.items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            For detailed migration guides and breaking changes, see the{" "}
            <a
              href="https://github.com/vncsleal/bettercone/blob/main/packages/ui/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              full CHANGELOG
            </a>
            {" "}on GitHub.
          </p>
        </div>
      </div>
    </main>
  );
}
