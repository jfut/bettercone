"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const examples = [
  {
    title: "Billing Page",
    description: "Complete billing management with subscriptions, payments, and invoices",
    components: ["BillingDashboard", "SubscriptionCard", "PaymentMethodCard", "InvoiceHistoryCard"],
    category: "Billing",
    slug: "billing"
  },
  {
    title: "Pricing Page",
    description: "Pricing plans with monthly/yearly toggle and Stripe checkout",
    components: ["PricingDashboard", "PricingCard", "PricingHeader"],
    category: "Pricing",
    slug: "pricing"
  },
  {
    title: "Team Page",
    description: "Team management with members, roles, and seat allocation",
    components: ["TeamDashboard", "SeatAllocationCard", "TeamBillingCard", "OrganizationMembersCard"],
    category: "Team",
    slug: "team"
  },
  {
    title: "Usage Page",
    description: "Track API usage, storage, and feature access",
    components: ["UsageDashboard", "ApiUsageCard", "StorageUsageCard", "FeatureAccessCard"],
    category: "Usage",
    slug: "usage"
  },
  {
    title: "Settings Page",
    description: "Combined account and security settings",
    components: ["AccountSettingsCards", "SecuritySettingsCards"],
    category: "Settings",
    slug: "settings"
  },
  {
    title: "Account Page",
    description: "User profile and account preferences",
    components: ["AccountSettingsCards", "UpdateAvatarCard", "UpdateNameCard"],
    category: "Account",
    slug: "account"
  },
  {
    title: "Security Page",
    description: "Password, 2FA, passkeys, and session management",
    components: ["SecuritySettingsCards", "TwoFactorCard", "PasskeysCard", "SessionsCard"],
    category: "Security",
    slug: "security"
  },
  {
    title: "Organization Page",
    description: "Organization settings and member management",
    components: ["OrganizationSettingsCards", "OrganizationMembersCard", "OrganizationInvitationsCard"],
    category: "Organization",
    slug: "organization"
  }
];

export default function ExamplesPage() {
  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Examples</h1>
          <p className="text-lg text-muted-foreground">
            See how components work together in real pages
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {examples.map((example) => (
            <Link key={example.slug} href={`/examples/${example.slug}`}>
              <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <CardTitle>{example.title}</CardTitle>
                    <Badge variant="outline">{example.category}</Badge>
                  </div>
                  <CardDescription className="mb-3">
                    {example.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {example.components.map((comp) => (
                      <code 
                        key={comp}
                        className="text-xs bg-muted px-2 py-1 rounded font-mono"
                      >
                        {comp}
                      </code>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary">
                    View example
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
