/**
 * Home Page - B2B SaaS Starter
 * Clean landing page with Demo and Examples sections
 * Built with Better Auth + Convex + Stripe
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Code2, 
  Blocks, 
  Settings, 
  CreditCard, 
  Users, 
  Shield,
  Zap,
  BookOpen,
  Github,
  ExternalLink
} from "lucide-react";

export default function Home() {
  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      {/* Hero Section */}
      <div className="mb-16 text-center space-y-4">
        <Badge variant="secondary" className="mb-4">
          Better Auth + Next.js + Convex + Stripe
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight">
          B2B SaaS Starter Kit
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Production-ready authentication, billing, and team management with modular components
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter" target="_blank">
              <Github className="mr-2 h-4 w-4" /> View on GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Better Auth</CardTitle>
            <CardDescription>
              Complete authentication with sessions, 2FA, passkeys, and OAuth providers
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Organizations</CardTitle>
            <CardDescription>
              Team management with invitations, roles, and multi-tenant architecture
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CreditCard className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Modular Components</CardTitle>
            <CardDescription>
              Production-ready billing, pricing, and usage tracking components
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Banner */}
      <div className="mb-16 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg border">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">97%</div>
            <div className="text-sm text-muted-foreground">Code Reduction</div>
            <div className="text-xs text-muted-foreground mt-1">Pricing Page</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">93%</div>
            <div className="text-sm text-muted-foreground">Code Reduction</div>
            <div className="text-xs text-muted-foreground mt-1">Billing Page</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">85%</div>
            <div className="text-sm text-muted-foreground">Code Reduction</div>
            <div className="text-xs text-muted-foreground mt-1">Usage Tracking</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">3</div>
            <div className="text-sm text-muted-foreground">Phases Complete</div>
            <div className="text-xs text-muted-foreground mt-1">Modular Architecture</div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {/* Demo Section */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Blocks className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Demo Pages</CardTitle>
            </div>
            <CardDescription>
              Interactive component demonstrations with live functionality
            </CardDescription>
          </CardHeader>
                    <CardContent className="space-y-3">
            <Link 
              href="/demo/combined/account"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">Account Settings</p>
                <p className="text-sm text-muted-foreground">Profile, avatar, email management</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/billing/current-plan"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group bg-primary/5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Billing Dashboard</p>
                  <Badge variant="default" className="text-xs">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Modular billing components (93% smaller)</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/pricing"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group bg-primary/5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Pricing Page</p>
                  <Badge variant="default" className="text-xs">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Modular pricing cards (97% smaller)</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/advanced/usage-tracking"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group bg-primary/5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Usage Tracking</p>
                  <Badge variant="default" className="text-xs">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Real-time Convex tracking (85% smaller)</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/organization/members"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">Organizations</p>
                <p className="text-sm text-muted-foreground">Teams, members, invitations</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/demo">
                  Browse All Components <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Code Examples</CardTitle>
            </div>
            <CardDescription>
              Implementation patterns and usage examples for developers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              href="/demo/combined/account"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">Settings Pages</p>
                <p className="text-sm text-muted-foreground">Account & security page layouts</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/pricing"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">Pricing Page</p>
                <p className="text-sm text-muted-foreground">Stripe checkout integration</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/hooks/use-authenticate"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">Custom Hooks</p>
                <p className="text-sm text-muted-foreground">Better Auth hooks usage</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/user/avatar"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">User Components</p>
                <p className="text-sm text-muted-foreground">Avatar, buttons, dropdowns</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/demo/advanced/api-management"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
            >
              <div>
                <p className="font-medium">API Key Management</p>
                <p className="text-sm text-muted-foreground">Generate and manage API keys</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/examples">
                  Browse All Examples <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Built With Modern Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-semibold mb-2">Better Auth</h3>
              <p className="text-sm text-muted-foreground">
                Authentication & authorization with Convex adapter
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Next.js 14+</h3>
              <p className="text-sm text-muted-foreground">
                App Router, Server Components, TypeScript
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Convex</h3>
              <p className="text-sm text-muted-foreground">
                Real-time database with Better Auth integration
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stripe</h3>
              <p className="text-sm text-muted-foreground">
                Subscriptions, payments, billing portal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <BookOpen className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Complete setup guides, component API references, and deployment instructions
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/docs/PROJECT_STRUCTURE.md">
                Read Docs <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Settings className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Clone, configure environment variables, and deploy in minutes
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter#readme" target="_blank">
                Get Started <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Github className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Contribute</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Open source and welcoming contributions. Star us on GitHub!
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/daveyplate/better-auth-nextjs-convex-starter" target="_blank">
                Star on GitHub <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
