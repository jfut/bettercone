"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

const changelog = [
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
