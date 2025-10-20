/**
 * Demo Pages Directory Landing
 * Interactive component showcase with search
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Settings, 
  Shield, 
  Users, 
  CreditCard, 
  Code2, 
  Blocks,
  ArrowRight,
  Search 
} from "lucide-react";

const demoCategories = [
  {
    title: "User Components",
    description: "Avatar, buttons, and user interface elements",
    icon: User,
    links: [
      { name: "User Avatar", href: "/demo/user/avatar", description: "Display user avatars", featured: false },
      { name: "User Button", href: "/demo/user/button", description: "User dropdown menu", featured: false },
    ]
  },
  {
    title: "Account Settings",
    description: "Profile management and account updates",
    icon: Settings,
    badge: "Combined View Available",
    links: [
      { name: "Update Avatar", href: "/demo/account/avatar", description: "Change profile picture", featured: false },
      { name: "Update Name", href: "/demo/account/name", description: "Change display name", featured: false },
      { name: "Update Email", href: "/demo/account/email", description: "Change email address", featured: false },
      { name: "All Account Settings", href: "/demo/combined/account", description: "Complete account page", featured: true },
    ]
  },
  {
    title: "Security",
    description: "Password, 2FA, sessions, and security features",
    icon: Shield,
    badge: "Combined View Available",
    links: [
      { name: "Change Password", href: "/demo/security/password", description: "Update password", featured: false },
      { name: "Two-Factor Auth", href: "/demo/security/two-factor", description: "Enable 2FA", featured: false },
      { name: "Sessions", href: "/demo/security/sessions", description: "Manage active sessions", featured: false },
      { name: "Passkeys", href: "/demo/security/passkeys", description: "WebAuthn passkeys", featured: false },
      { name: "All Security Settings", href: "/demo/combined/security", description: "Complete security page", featured: true },
    ]
  },
  {
    title: "Organizations",
    description: "Team management and collaboration",
    icon: Users,
    badge: "B2B SaaS",
    links: [
      { name: "Team Dashboard", href: "/demo/organization/team-dashboard", description: "Seat allocation & billing", featured: true },
      { name: "Organization Switcher", href: "/demo/organization/switcher", description: "Switch between teams", featured: false },
      { name: "Members Management", href: "/demo/organization/members", description: "Manage team members", featured: false },
      { name: "Organization Settings", href: "/demo/organization/settings", description: "Team settings", featured: false },
    ]
  },
  {
    title: "Billing & Subscriptions",
    description: "Payment management and subscription features",
    icon: CreditCard,
    badge: "New Modular Components",
    links: [
      { name: "Billing Dashboard", href: "/demo/billing/current-plan", description: "Manage subscriptions", featured: true },
      { name: "Pricing Dashboard", href: "/demo/pricing", description: "View all plans with Stripe checkout", featured: true },
    ]
  },
  {
    title: "Advanced Features",
    description: "API keys, usage tracking, and admin tools",
    icon: Code2,
    links: [
      { name: "API Management", href: "/demo/advanced/api-management", description: "Generate API keys", featured: false },
      { name: "Usage Tracking", href: "/demo/advanced/usage-tracking", description: "Monitor quotas", featured: false },
      { name: "Feature Gating", href: "/demo/advanced/feature-gating", description: "Subscription features", featured: false },
      { name: "Admin Dashboard", href: "/demo/advanced/admin-dashboard", description: "Admin interface", featured: false },
    ]
  },
];

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories and links based on search
  const filteredCategories = demoCategories
    .map(category => ({
      ...category,
      links: category.links.filter(link =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.links.length > 0);

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Blocks className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Component Demos</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          Interactive demonstrations of Better Auth UI components with live functionality
        </p>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No components found matching "{searchQuery}"</p>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle>{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      {category.badge && (
                        <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                          {category.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {link.name}
                                {'featured' in link && link.featured && (
                                  <Badge variant="default" className="ml-2 text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{link.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Combined Views</CardTitle>
              <CardDescription>
                Complete page layouts combining multiple components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/demo/combined/all"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
              >
                <div>
                  <p className="font-medium">All Settings Combined</p>
                  <p className="text-sm text-muted-foreground">
                    Account + Security + Organization in one page
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
