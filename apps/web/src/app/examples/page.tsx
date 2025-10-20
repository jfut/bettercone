/**
 * Examples Directory Landing
 * Real production page implementations ready to ship
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Settings, 
  CreditCard,
  UserCircle,
  Shield,
  Building2,
  Code2,
  ExternalLink,
  ArrowRight,
  FileCode,
  Book
} from "lucide-react";

const productionPages = [
  {
    title: "Account Settings Page",
    description: "Complete user profile and account management page",
    icon: Settings,
    badge: "Production Ready",
    demoHref: "/demo/combined/account",
    features: [
      "Profile picture upload with avatar management",
      "Display name editing with validation",
      "Email change with verification flow",
      "All in one responsive layout"
    ],
    techStack: ["Better Auth UI", "shadcn/ui", "Convex"],
    linesOfCode: "~20 lines (using modular components)"
  },
  {
    title: "Security Settings Page",
    description: "Comprehensive security and authentication management",
    icon: Shield,
    badge: "Production Ready",
    demoHref: "/demo/combined/security",
    features: [
      "Password change with strength indicator",
      "Two-factor authentication (TOTP)",
      "Active session management",
      "WebAuthn passkeys support"
    ],
    techStack: ["Better Auth UI", "shadcn/ui", "Convex"],
    linesOfCode: "~25 lines (using modular components)"
  },
  {
    title: "Billing Dashboard",
    description: "Complete subscription and payment management",
    icon: CreditCard,
    badge: "New Modular Architecture",
    demoHref: "/demo/billing/current-plan",
    features: [
      "Current subscription display with status",
      "Payment method management (Stripe)",
      "Invoice history with download links",
      "Organization-aware billing (B2B)"
    ],
    techStack: ["Better Auth Stripe", "Stripe Portal", "Convex"],
    linesOfCode: "~20 lines (using BillingDashboard)"
  },
  {
    title: "Pricing Dashboard",
    description: "Complete pricing page with Stripe checkout integration",
    icon: LayoutDashboard,
    badge: "Phase 2 - Better Auth UI Patterns",
    demoHref: "/demo/pricing",
    features: [
      "Monthly/yearly billing toggle with savings display",
      "Organization selector for team plans",
      "Stripe checkout with Better Auth integration",
      "Granular className customization and localization"
    ],
    techStack: ["Better Auth Stripe", "Stripe Checkout", "shadcn/ui"],
    linesOfCode: "~10 lines (97% reduction from 315 lines)"
  },
  {
    title: "User Profile Page",
    description: "Public user profile with social links",
    icon: UserCircle,
    badge: "Pattern Available",
    demoHref: "/demo/account/avatar",
    features: [
      "Avatar display with fallback",
      "User metadata and bio",
      "Social connections",
      "Activity timeline"
    ],
    techStack: ["Better Auth UI", "Convex Queries"],
    linesOfCode: "~40 lines (custom implementation)"
  },
  {
    title: "Team Management Dashboard",
    description: "B2B SaaS team billing and seat allocation",
    icon: Building2,
    badge: "Phase 4 - B2B Ready",
    demoHref: "/demo/organization/team-dashboard",
    features: [
      "Real-time seat allocation tracking",
      "Organization billing overview",
      "Usage breakdown and limits",
      "Team member list with roles"
    ],
    techStack: ["Better Auth Organizations", "Convex", "shadcn/ui"],
    linesOfCode: "~21 lines (using TeamDashboard)"
  },
];

export default function ExamplesPage() {
  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <FileCode className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Production Examples</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Complete page implementations ready to ship in your B2B SaaS. These are real production scenarios showing how components work together in actual applications.
        </p>
      </div>

      {/* Production Pages Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {productionPages.map((page) => {
          const Icon = page.icon;
          return (
            <Card key={page.title} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge variant={page.badge.includes("New") || page.badge.includes("Production") ? "default" : "secondary"}>
                    {page.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                {/* Features */}
                <div>
                  <p className="text-sm font-medium mb-2">Key Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {page.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <p className="text-sm font-medium mb-2">Tech Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {page.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Code Complexity */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <Code2 className="h-3 w-3 inline mr-1" />
                    {page.linesOfCode}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={page.demoHref}>
                    View Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {page.badge.includes("Production") && (
                  <Button variant="outline" asChild>
                    <Link href={page.demoHref} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Documentation Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Book className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Project structure, environment setup, and deployment guides
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter/tree/main/docs" target="_blank">
                View Docs <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileCode className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Component Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn about the modular component architecture and Better Auth patterns
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter/blob/main/B2B_SAAS_COMPONENT_STRATEGY.md" target="_blank">
                Read Strategy <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code2 className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Quick reference guide for common tasks and configurations
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter/blob/main/QUICK_REFERENCE.md" target="_blank">
                View Reference <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
