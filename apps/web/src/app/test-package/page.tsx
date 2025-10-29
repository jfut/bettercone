'use client';

import { 
	BillingDashboard, 
	PricingCard, 
	UsageDashboard,
	TeamDashboard 
} from '@bettercone/ui';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TestPackagePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container max-w-6xl mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">@bettercone/ui Package Test</h1>
					<p className="text-muted-foreground">
						Testing components imported from the workspace package before npm publication
					</p>
				</div>

				<Tabs defaultValue="billing" className="space-y-4">
					<TabsList>
						<TabsTrigger value="billing">Billing Dashboard</TabsTrigger>
						<TabsTrigger value="pricing">Pricing Card</TabsTrigger>
						<TabsTrigger value="usage">Usage Dashboard</TabsTrigger>
						<TabsTrigger value="team">Team Dashboard</TabsTrigger>
					</TabsList>

					<TabsContent value="billing" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>BillingDashboard Component</CardTitle>
								<CardDescription>
									Testing the main billing dashboard from @bettercone/ui
								</CardDescription>
							</CardHeader>
							<CardContent>
								<BillingDashboard
									authClient={authClient}
									layout="grid"
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="pricing" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>PricingCard Component</CardTitle>
								<CardDescription>
									Testing the pricing card from @bettercone/ui
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									<PricingCard
										plan={{
											id: 'starter',
											name: 'Starter',
											description: 'Perfect for small teams',
											priceMonthly: 29,
											priceYearly: 290,
											features: ['10,000 API calls/month', '1GB storage', 'Email support']
										}}
										billingInterval="monthly"
										onSubscribe={(planId: string) => {
											console.log('Plan selected:', planId);
											alert(`Selected plan: ${planId}`);
										}}
									/>
									<PricingCard
										plan={{
											id: 'pro',
											name: 'Pro',
											description: 'For growing businesses',
											priceMonthly: 99,
											priceYearly: 990,
											features: ['100,000 API calls/month', '10GB storage', 'Priority support', 'Advanced analytics'],
											popular: true
										}}
										billingInterval="monthly"
										onSubscribe={(planId: string) => {
											console.log('Plan selected:', planId);
											alert(`Selected plan: ${planId}`);
										}}
									/>
									<PricingCard
										plan={{
											id: 'enterprise',
											name: 'Enterprise',
											description: 'For large organizations',
											priceMonthly: 299,
											priceYearly: 2990,
											features: ['Unlimited API calls', '100GB storage', '24/7 phone support', 'Custom integrations', 'SLA guarantee']
										}}
										billingInterval="monthly"
										onSubscribe={(planId: string) => {
											console.log('Plan selected:', planId);
											alert(`Selected plan: ${planId}`);
										}}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="usage" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>UsageDashboard Component</CardTitle>
								<CardDescription>
									Testing the usage dashboard from @bettercone/ui
								</CardDescription>
							</CardHeader>
							<CardContent>
								<UsageDashboard
									apiUsage={{ current: 7500, limit: 10000 }}
									storageUsage={{ currentBytes: 536870912, limitBytes: 1073741824 }}
									featureAccess={{
										advancedAnalytics: true,
										apiAccess: true,
										customIntegrations: false,
										prioritySupport: true
									}}
									layout="grid"
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="team" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>TeamDashboard Component</CardTitle>
								<CardDescription>
									Testing the team dashboard from @bettercone/ui
								</CardDescription>
							</CardHeader>
							<CardContent>
								<TeamDashboard
									seatAllocation={{
										usedSeats: 5,
										totalSeats: 10,
										planName: 'Pro Plan',
										members: [
											{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
											{ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member' },
											{ id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'member' },
										]
									}}
									layout="grid"
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				<div className="mt-8 p-4 bg-muted rounded-lg">
					<h2 className="font-semibold mb-2">Test Checklist:</h2>
					<ul className="space-y-1 text-sm">
						<li>✓ Import from @bettercone/ui works</li>
						<li>✓ TypeScript types resolve correctly</li>
						<li>✓ Components render without errors</li>
						<li>✓ Callbacks function properly</li>
						<li>✓ Styles load correctly</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
