import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Users, Settings, BookOpen, Github, Sparkles } from "lucide-react";

export default function Home() {
	return (
<div className="min-h-screen bg-background">
			<main className="container max-w-6xl mx-auto px-4 py-16">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-3">
						Welcome to Your B2B SaaS
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Your production-ready foundation is set up. Start building your unique features.
					</p>
				</div>

				{/* Quick Start Cards */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2 mb-2">
								<Sparkles className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Quick Start</CardTitle>
							</div>
							<CardDescription>
								Get started with your SaaS in minutes
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p>✓ Authentication is configured</p>
							<p>✓ Billing is ready for Stripe</p>
							<p>✓ Teams & organizations enabled</p>
							<Button variant="link" className="p-0 h-auto" asChild>
								<Link href="https://docs.bettercone.dev" target="_blank">
									Read the docs <ArrowRight className="ml-1 h-3 w-3" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2 mb-2">
								<Users className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Team Management</CardTitle>
							</div>
							<CardDescription>
								Manage your organization and members
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-3">
								Multi-tenant organizations with role-based access control
							</p>
							<Button variant="outline" size="sm" asChild>
								<Link href="/auth/sign-in">
									Get Started <ArrowRight className="ml-1 h-3 w-3" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2 mb-2">
								<CreditCard className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Billing & Subscriptions</CardTitle>
							</div>
							<CardDescription>
								Stripe integration ready to go
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-3">
								Subscription management, webhooks, and customer portal
							</p>
							<Button variant="outline" size="sm" asChild>
								<Link href="/auth/sign-in">
									Configure Billing <ArrowRight className="ml-1 h-3 w-3" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Next Steps */}
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle>Next Steps</CardTitle>
						<CardDescription>
							Customize BetterCone to build your unique product
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<h3 className="font-semibold flex items-center gap-2">
									<Settings className="h-4 w-4" />
									Configure Your App
								</h3>
								<ul className="text-sm text-muted-foreground space-y-1 ml-6">
									<li>• Set up environment variables</li>
									<li>• Configure Stripe products</li>
									<li>• Customize email templates</li>
									<li>• Add your branding</li>
								</ul>
							</div>

							<div className="space-y-2">
								<h3 className="font-semibold flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									Build Your Features
								</h3>
								<ul className="text-sm text-muted-foreground space-y-1 ml-6">
									<li>• Use existing components</li>
									<li>• Add custom dashboards</li>
									<li>• Extend Convex schema</li>
									<li>• Create your workflows</li>
								</ul>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
							<Button asChild>
								<Link href="https://docs.bettercone.dev" target="_blank">
									<BookOpen className="mr-2 h-4 w-4" />
									View Documentation
								</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href="https://github.com/vncsleal/bettercone" target="_blank">
									<Github className="mr-2 h-4 w-4" />
									GitHub Repository
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-12 text-sm text-muted-foreground">
					<p>
						Built with{" "}
						<Link href="https://better-auth.com" className="text-primary hover:underline" target="_blank">
							Better Auth
						</Link>
						{", "}
						<Link href="https://convex.dev" className="text-primary hover:underline" target="_blank">
							Convex
						</Link>
						{", and "}
						<Link href="https://nextjs.org" className="text-primary hover:underline" target="_blank">
							Next.js
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
