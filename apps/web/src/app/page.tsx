/**
 * BetterCone - Landing Page
 * The AI-ready foundation for B2B SaaS
 */

import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Code2,
	Blocks,
	Zap,
	Shield,
	Users,
	CreditCard,
	Sparkles,
	Github,
	BookOpen,
	Package,
	Terminal,
	Check,
	IceCreamCone,
	ArrowRight,
	Clock,
	Rocket,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen w-full bg-[#fefcff] relative">
			{/* Dreamy Sky Pink Glow (fixed window) */}
			<div
				className="fixed inset-0 h-screen w-full z-0 bg-[#fefcff]"
				style={{
					backgroundImage: `
						radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
						radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
					backgroundAttachment: 'fixed',
				}}
			/>

			{/* Dreamy Night Glow — Dark (visible in dark mode) */}
			<div
				className="fixed inset-0 h-screen w-full z-0 bg-[#071028] hidden dark:block pointer-events-none"
				aria-hidden="true"
				style={{
					backgroundImage: `
						radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.18), transparent 60%),
						radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.16), transparent 60%)`,
					backgroundAttachment: 'fixed',
					backgroundBlendMode: 'screen',
				}}
			/>

			<main className="relative z-10">
			{/* Hero Section */}
			<section className="container max-w-6xl mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
				<div className="text-center space-y-6">
					<Badge
						variant="secondary"
						className="glass-surface glow-multi text-xs px-3 py-1 font-medium"
					>
						<Sparkles className="w-3 h-3 mr-1.5 inline" />
						The AI-ready foundation for B2B SaaS
					</Badge>

					<div className="space-y-4">
						<div className="flex items-center justify-center gap-3">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
								BetterCone
							</h1>
						</div>

						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Stop asking AI to rebuild auth, billing, and teams
							from scratch.
							<br className="hidden sm:block" />
							<span className="font-medium text-foreground">
								Start with a solid foundation.
							</span>{" "}
							Let AI build your unique features.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
						<Button size="lg" asChild className="glass-button glow-pink">
							<Link href="/docs">
								<BookOpen className="mr-2 h-4 w-4" />
								Get Started
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild className="glass-button glow-blue">
							<Link href="/examples">
								<Code2 className="mr-2 h-4 w-4" />
								View Examples
							</Link>
						</Button>
						<Button size="lg" variant="ghost" asChild className="glass-button glow-blue">
							<Link
								href="https://github.com/vncsleal/bettercone"
								target="_blank"
							>
								<Github className="mr-2 h-4 w-4" />
								GitHub
							</Link>
						</Button>
					</div>

					<div className="flex flex-wrap justify-center gap-4 pt-6 text-xs text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Check className="w-3.5 h-3.5 text-primary" />
							<span>MIT License</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Check className="w-3.5 h-3.5 text-primary" />
							<span>TypeScript</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Check className="w-3.5 h-3.5 text-primary" />
							<span>98/100 Production Ready</span>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison Section - Before & After */}
			<section className="container max-w-6xl mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<Badge variant="outline" className="mb-3">
						The Difference
					</Badge>
					<h2 className="text-2xl md:text-3xl font-bold mb-2">
						Before & After BetterCone
					</h2>
					<p className="text-sm text-muted-foreground">
						See how BetterCone transforms your development workflow
					</p>
				</div>

				<div className="relative">
					{/* Divider Line with Arrow */}
					<div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-2">
							<ArrowRight className="w-5 h-5 text-primary" />
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-8 md:gap-12">
						{/* Without BetterCone - Left Side */}
						<div className="space-y-4">
							<div className="md:text-right">
									<Badge
										variant="outline"
										className="glass-surface border-destructive/50 text-destructive glow-pink"
									>
										Without BetterCone
									</Badge>
							</div>
							<div className="space-y-3">
								<div className="flex md:flex-row-reverse items-start gap-3 p-3 rounded-lg border border-destructive/30 glass-surface destructive glow-pink">
									<div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
										<span className="text-xs font-bold text-destructive">
											1
										</span>
									</div>
									<div className="flex-1 md:text-right">
										<p className="text-sm font-medium mb-0.5">
											Inconsistent AI code
										</p>
										<p className="text-xs text-muted-foreground">
											Auth patterns differ every time
										</p>
									</div>
								</div>

								<div className="flex md:flex-row-reverse items-start gap-3 p-3 rounded-lg border border-destructive/30 glass-surface destructive glow-pink">
									<div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
										<span className="text-xs font-bold text-destructive">
											2
										</span>
									</div>
									<div className="flex-1 md:text-right">
										<p className="text-sm font-medium mb-0.5">
											Security vulnerabilities
										</p>
										<p className="text-xs text-muted-foreground">
											Missing best practices
										</p>
									</div>
								</div>

								<div className="flex md:flex-row-reverse items-start gap-3 p-3 rounded-lg border border-destructive/30 glass-surface destructive glow-pink">
									<div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
										<span className="text-xs font-bold text-destructive">
											3
										</span>
									</div>
									<div className="flex-1 md:text-right">
										<p className="text-sm font-medium mb-0.5">
											No multi-tenancy
										</p>
										<p className="text-xs text-muted-foreground">
											Teams & billing hardcoded
										</p>
									</div>
								</div>

								<div className="mt-6 p-4 rounded-lg glass-surface destructive glow-pink">
									<div className="flex md:flex-row-reverse items-center gap-2 text-xs font-medium text-destructive">
										<Clock className="w-3.5 h-3.5" />
										<span>Result: 100+ hours fixing code</span>
									</div>
								</div>
							</div>
						</div>

						{/* With BetterCone - Right Side */}
						<div className="space-y-4">
							<Badge
								variant="outline"
								className="glass-surface border-primary/50 text-primary glow-blue"
							>
								With BetterCone
							</Badge>
							<div className="space-y-3">
								<div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 glass-surface glow-blue">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<Check className="w-4 h-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium mb-0.5">
											Production-ready patterns
										</p>
										<p className="text-xs text-muted-foreground">
											Auth, billing, teams done right
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 glass-surface glow-blue">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<Check className="w-4 h-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium mb-0.5">
											Type-safe foundation
										</p>
										<p className="text-xs text-muted-foreground">
											AI extends existing code
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 glass-surface glow-blue">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<Check className="w-4 h-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium mb-0.5">
											Focus on features
										</p>
										<p className="text-xs text-muted-foreground">
											Build what makes you unique
										</p>
									</div>
								</div>

								<div className="mt-6 p-4 rounded-lg glass-surface glow-blue">
									<div className="flex items-center gap-2 text-xs font-medium text-primary">
										<Rocket className="w-3.5 h-3.5" />
										<span>Result: Ship in days, not months</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container max-w-6xl mx-auto px-4 py-16">
				<div className="text-center mb-10">
					<h2 className="text-2xl md:text-3xl font-bold mb-2">
						Everything You Need
					</h2>
					<p className="text-sm text-muted-foreground">
						Production-ready foundation that AI can build upon
					</p>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Card className="glass-card">
						<CardHeader className="pb-3">
							<Shield className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								Complete Authentication
							</CardTitle>
							<CardDescription className="text-xs">
								Email/password, OAuth (GitHub, Google), 2FA,
								passkeys, session management
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="glass-card">
						<CardHeader className="pb-3">
							<CreditCard className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								Stripe Billing
							</CardTitle>
							<CardDescription className="text-xs">
								Subscriptions, usage tracking, customer portal,
								webhooks, invoice management
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="glass-card">
						<CardHeader className="pb-3">
							<Users className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								Team Management
							</CardTitle>
							<CardDescription className="text-xs">
								Multi-tenant organizations with role-based
								access control and invitations
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="glass-card">
						<CardHeader className="pb-3">
							<Package className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								50+ UI Components
							</CardTitle>
							<CardDescription className="text-xs">
								shadcn/ui components + custom billing, pricing,
								and usage components
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="glass-card">
						<CardHeader className="pb-3">
							<Terminal className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								AI-Ready Stack
							</CardTitle>
							<CardDescription className="text-xs">
								TypeScript + Convex (no SQL!), llms.txt,
								.cursorrules, 300+ prompts
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="glass-card">
						<CardHeader className="pb-3">
							<Zap className="w-8 h-8 mb-2 text-primary" />
							<CardTitle className="text-base">
								Production Ready
							</CardTitle>
							<CardDescription className="text-xs">
								Email templates, API infrastructure, rate
								limiting, error handling
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</section>

			{/* Tech Stack Section */}
			<section className="container max-w-5xl mx-auto px-4 py-16 ">
				<div className="text-center mb-10">
					<h2 className="text-2xl md:text-3xl font-bold mb-2">
						The Perfect Stack for AI
					</h2>
					<p className="text-sm text-muted-foreground">
						Technologies that AI understands perfectly
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Code2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									TypeScript Everywhere
								</div>
								<div className="text-xs text-muted-foreground">
									AI understands types perfectly - no
									guessing, better code generation
								</div>
							</div>
						</div>

						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Terminal className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									Convex Backend
								</div>
								<div className="text-xs text-muted-foreground">
									No SQL! Just TypeScript functions. AI
									excels at this.
								</div>
							</div>
						</div>

						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Blocks className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									Next.js 15
								</div>
								<div className="text-xs text-muted-foreground">
									Well-documented, AI has tons of training
									data
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									Better Auth
								</div>
								<div className="text-xs text-muted-foreground">
									Clear patterns, AI can extend auth flows
									easily
								</div>
							</div>
						</div>

						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									shadcn/ui
								</div>
								<div className="text-xs text-muted-foreground">
									Copy-paste components, AI knows all the
									patterns
								</div>
							</div>
						</div>

						<div className="flex items-start gap-3 p-4 rounded-lg border glass-surface">
							<Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<div className="font-medium text-sm mb-1">
									AI Documentation
								</div>
								<div className="text-xs text-muted-foreground">
									llms.txt, .cursorrules, 300+ prompts,
									feature templates
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container max-w-4xl mx-auto px-4 py-16">
				<Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-background glass-card">
					<CardContent className="text-center py-12 px-6">
						<h2 className="text-2xl md:text-3xl font-bold mb-3">
							Ready to Ship 10x Faster?
						</h2>
						<p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
							Stop rebuilding auth and billing. Start with
							BetterCone and let AI build your unique features.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
							<Button size="lg" asChild className="glass-button glow-pink">
								<Link href="/docs">
									<BookOpen className="mr-2 h-4 w-4" />
									Read Documentation
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="glass-button glow-blue">
								<Link href="/components">
									<Package className="mr-2 h-4 w-4" />
									Browse Components
								</Link>
							</Button>
						</div>

						<div className="pt-8 border-t">
							<div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<Check className="w-3.5 h-3.5 text-primary" />
									<span>MIT License - Free Forever</span>
								</div>
								<div className="flex items-center gap-1.5">
									<Check className="w-3.5 h-3.5 text-primary" />
									<span>40,000+ Lines of Code</span>
								</div>
								<div className="flex items-center gap-1.5">
									<Check className="w-3.5 h-3.5 text-primary" />
									<span>98/100 Production Ready</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
			</div>
	);
}
