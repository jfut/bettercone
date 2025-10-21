"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const components = [
  // Authentication Components
  {
    name: "SecuritySettingsCards",
    description: "Password, 2FA, passkeys, and session management",
    category: "Authentication",
    slug: "security-settings-cards"
  },
  {
    name: "AccountSettingsCards", 
    description: "Profile editing and account preferences",
    category: "Authentication",
    slug: "account-settings-cards"
  },
  {
    name: "UserButton",
    description: "User menu with profile and sign out",
    category: "Authentication",
    slug: "user-button"
  },
  {
    name: "AuthView",
    description: "Complete authentication UI with sign in, sign up, and password reset",
    category: "Authentication",
    slug: "auth-view"
  },
  {
    name: "SignedIn / SignedOut",
    description: "Conditional rendering based on authentication state",
    category: "Authentication",
    slug: "signed-in-out"
  },
  {
    name: "PasskeysCard",
    description: "Manage passkey credentials for passwordless authentication",
    category: "Authentication",
    slug: "passkeys-card"
  },
  {
    name: "SessionsCard",
    description: "View and manage active sessions across devices",
    category: "Authentication",
    slug: "sessions-card"
  },
  {
    name: "TwoFactorCard",
    description: "Enable and configure two-factor authentication",
    category: "Authentication",
    slug: "two-factor-card"
  },
  {
    name: "ProvidersCard",
    description: "Link and manage social authentication providers",
    category: "Authentication",
    slug: "providers-card"
  },
  {
    name: "ChangePasswordCard",
    description: "Update user password with validation",
    category: "Authentication",
    slug: "change-password-card"
  },
  {
    name: "ChangeEmailCard",
    description: "Update user email address with verification",
    category: "Authentication",
    slug: "change-email-card"
  },
  {
    name: "UpdateAvatarCard",
    description: "Upload and manage user profile picture",
    category: "Authentication",
    slug: "update-avatar-card"
  },
  
  // Organization Components
  {
    name: "OrganizationSwitcher",
    description: "Multi-organization selector and creator",
    category: "Organizations",
    slug: "organization-switcher"
  },
  {
    name: "OrganizationSettingsCards",
    description: "Complete organization settings including name, logo, and members",
    category: "Organizations",
    slug: "organization-settings-cards"
  },
  {
    name: "TeamDashboard",
    description: "Team management with members and seat allocation",
    category: "Organizations",
    slug: "team-dashboard"
  },
  {
    name: "SeatAllocationCard",
    description: "Manage organization seat usage and limits",
    category: "Organizations",
    slug: "seat-allocation-card"
  },
  {
    name: "TeamBillingCard",
    description: "Organization billing summary with plan details",
    category: "Organizations",
    slug: "team-billing-card"
  },
  {
    name: "OrganizationMembersCard",
    description: "View and manage organization members and roles",
    category: "Organizations",
    slug: "organization-members-card"
  },
  {
    name: "OrganizationInvitationsCard",
    description: "Manage pending organization invitations",
    category: "Organizations",
    slug: "organization-invitations-card"
  },
  
  // Billing Components
  {
    name: "BillingDashboard",
    description: "Complete billing overview with subscription and invoices",
    category: "Billing",
    slug: "billing-dashboard"
  },
  {
    name: "PricingDashboard",
    description: "Pricing table with Stripe Checkout integration",
    category: "Billing",
    slug: "pricing-dashboard"
  },
  {
    name: "SubscriptionCard",
    description: "Current subscription details with upgrade and cancel options",
    category: "Billing",
    slug: "subscription-card"
  },
  {
    name: "PaymentMethodCard",
    description: "Manage payment methods and billing information",
    category: "Billing",
    slug: "payment-method-card"
  },
  {
    name: "InvoiceHistoryCard",
    description: "View and download past invoices",
    category: "Billing",
    slug: "invoice-history-card"
  },
  {
    name: "PricingCard",
    description: "Individual pricing plan card with features and CTA",
    category: "Billing",
    slug: "pricing-card"
  },
  
  // Usage Components
  {
    name: "UsageDashboard",
    description: "Complete usage tracking dashboard with API, storage, and features",
    category: "Usage",
    slug: "usage-dashboard"
  },
  {
    name: "ApiUsageCard",
    description: "Track API calls and rate limits",
    category: "Usage",
    slug: "api-usage-card"
  },
  {
    name: "StorageUsageCard",
    description: "Monitor storage usage and limits",
    category: "Usage",
    slug: "storage-usage-card"
  },
  {
    name: "FeatureAccessCard",
    description: "Display available features based on plan",
    category: "Usage",
    slug: "feature-access-card"
  }
];

const categories = ["All", "Authentication", "Organizations", "Billing", "Usage"];

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredComponents = components.filter((component) => {
    const matchesSearch = 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Components</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Browse available ready components 
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Components Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((component) => (
            <Link key={component.name} href={`/components/${component.slug}`}>
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {component.category}
                    </Badge>
                  </div>
                  <CardDescription>{component.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No components found matching your search
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Links */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/examples"
              >
                <Button variant="link">
                  View Examples
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
