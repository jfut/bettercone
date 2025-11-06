"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { allComponentsMap } from "@/lib/components-data";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { Component as ReactComponent, ErrorInfo, ReactNode } from "react";
import { MockDataProvider, mockPricingPlans, mockUsage, mockSeatAllocation, mockOrganization, mockSubscription, mockFeatures, mockAdminUsers } from "@/lib/mock-data";
import { MockAuthUIProvider } from "@/components/mock-auth-provider";
import { mockAuthClient } from "@/lib/mock-auth-provider";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Error Boundary Component
class ComponentErrorBoundary extends ReactComponent<
  { children: ReactNode; componentName: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error rendering ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to render component preview. This may require specific auth context or data.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Dynamically import all components from @bettercone/ui
const ComponentPreview = ({ componentName }: { componentName: string }) => {
  const Component = dynamic(
    () => import('@bettercone/ui').then((mod) => ({ default: mod[componentName as keyof typeof mod] as React.ComponentType<{ authClient?: typeof mockAuthClient }> })),
    {
      loading: () => <div className="p-8 text-center text-muted-foreground">Loading component...</div>,
      ssr: false,
    }
  );

  // Component-specific props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentProps: Record<string, any> = {
    // All billing components need authClient
    authClient: mockAuthClient,
  };

  // PricingCard needs specific props
  if (componentName === 'PricingCard') {
    componentProps.plan = mockPricingPlans[1]; // Use Pro plan
    componentProps.billingInterval = 'monthly';
    componentProps.onSubscribe = (planId: string, interval: string) => {
      console.log(`Subscribe to ${planId} (${interval})`);
    };
  }

  // UsageDashboard needs usage data
  if (componentName === 'UsageDashboard') {
    componentProps.apiUsage = {
      current: mockUsage.api.current,
      limit: mockUsage.api.limit,
    };
    componentProps.storageUsage = {
      currentBytes: mockUsage.storage.current * 1024 * 1024 * 1024, // Convert GB to bytes
      limitBytes: mockUsage.storage.limit * 1024 * 1024 * 1024,
    };
    componentProps.featureAccess = mockFeatures;
  }

  // ApiUsageCard needs usage data
  if (componentName === 'ApiUsageCard') {
    componentProps.current = mockUsage.api.current;
    componentProps.limit = mockUsage.api.limit;
    componentProps.onUpgrade = () => console.log('Upgrade clicked');
  }

  // StorageUsageCard needs storage data
  if (componentName === 'StorageUsageCard') {
    componentProps.currentBytes = mockUsage.storage.current * 1024 * 1024 * 1024;
    componentProps.limitBytes = mockUsage.storage.limit * 1024 * 1024 * 1024;
    componentProps.onUpgrade = () => console.log('Upgrade clicked');
  }

  // SeatAllocationCard needs seat data
  if (componentName === 'SeatAllocationCard') {
    componentProps.data = mockSeatAllocation;
    componentProps.onUpgrade = () => console.log('Upgrade clicked');
    componentProps.onInviteMember = () => console.log('Invite member clicked');
    componentProps.showMemberList = true;
  }

  // TeamDashboard needs organization and subscription
  if (componentName === 'TeamDashboard') {
    componentProps.organization = mockOrganization;
    componentProps.subscription = mockSubscription;
    componentProps.seatAllocation = mockSeatAllocation;
    componentProps.showMemberList = true;
  }

  // TeamBillingCard needs subscription data
  if (componentName === 'TeamBillingCard') {
    componentProps.subscription = mockSubscription;
    componentProps.organization = mockOrganization;
  }

  // FeatureAccessCard needs features
  if (componentName === 'FeatureAccessCard') {
    componentProps.features = mockFeatures;
    componentProps.planName = "Pro Plan";
  }

  // AnonymousSignInButton needs minimal props
  if (componentName === 'AnonymousSignInButton') {
    componentProps.onSuccess = () => console.log('Anonymous sign in successful');
    componentProps.onError = (error: Error) => console.error('Sign in failed:', error);
  }

  // AnonymousUpgradeCard needs OAuth providers
  if (componentName === 'AnonymousUpgradeCard') {
    componentProps.showOAuthProviders = true;
    componentProps.oauthProviders = [
      { id: 'google', name: 'Google' },
      { id: 'github', name: 'GitHub' },
    ];
    componentProps.onUpgradeWithEmail = () => console.log('Upgrade with email');
    componentProps.onLinkOAuth = (provider: string) => console.log('Link OAuth:', provider);
  }

  // PasswordBreachChecker needs password prop
  if (componentName === 'PasswordBreachChecker') {
    componentProps.password = 'password123'; // Common password for demo
    componentProps.checkOnType = true;
    componentProps.showCount = true;
    componentProps.onBreached = (count: number) => console.log(`Password breached ${count} times`);
    componentProps.onSafe = () => console.log('Password is safe');
  }

  // EmailVerificationBanner needs email
  if (componentName === 'EmailVerificationBanner') {
    componentProps.email = 'user@example.com';
    componentProps.dismissible = true;
    componentProps.cooldown = 60;
    componentProps.onResend = () => console.log('Verification email sent');
    componentProps.onDismiss = () => console.log('Banner dismissed');
  }

  // ChangeEmailCard needs callbacks
  if (componentName === 'ChangeEmailCard') {
    componentProps.onSuccess = () => console.log('Email changed successfully');
    componentProps.onError = (error: Error) => console.error('Email change error:', error);
  }

  // PasskeySetupWizard needs callbacks
  if (componentName === 'PasskeySetupWizard') {
    componentProps.onSuccess = () => console.log('Passkey registered successfully');
    componentProps.onError = (error: Error) => console.error('Passkey registration error:', error);
    componentProps.onCancel = () => console.log('Passkey setup cancelled');
  }

  // TransferOwnershipDialog needs organization ID
  if (componentName === 'TransferOwnershipDialog') {
    componentProps.organizationId = mockOrganization.id;
    componentProps.onSuccess = () => console.log('Ownership transferred successfully');
    componentProps.onError = (error: Error) => console.error('Ownership transfer error:', error);
  }

  // LinkAccountCard needs callbacks
  if (componentName === 'LinkAccountCard') {
    componentProps.onSuccess = () => console.log('Account linked successfully');
    componentProps.onError = (error: Error) => console.error('Account linking error:', error);
  }

  // UnlinkAccountCard needs callbacks
  if (componentName === 'UnlinkAccountCard') {
    componentProps.onSuccess = () => console.log('Account unlinked successfully');
    componentProps.onError = (error: Error) => console.error('Account unlinking error:', error);
  }

  // UserManagementTable needs callbacks
  if (componentName === 'UserManagementTable') {
    componentProps.onSuccess = (message: string) => console.log('Success:', message);
    componentProps.onError = (error: Error) => console.error('Error:', error);
  }

  // BanUserDialog needs user and callbacks
  if (componentName === 'BanUserDialog') {
    componentProps.open = true;
    componentProps.onOpenChange = (open: boolean) => console.log('Dialog open:', open);
    componentProps.user = mockAdminUsers[1]; // Jane Smith
    componentProps.onSuccess = () => console.log('User banned successfully');
    componentProps.onError = (error: Error) => console.error('Ban error:', error);
  }

  // ImpersonateUserDialog needs user and callbacks
  if (componentName === 'ImpersonateUserDialog') {
    componentProps.open = true;
    componentProps.onOpenChange = (open: boolean) => console.log('Dialog open:', open);
    componentProps.user = mockAdminUsers[0]; // John Doe
    componentProps.onSuccess = () => console.log('Impersonation started');
    componentProps.onError = (error: Error) => console.error('Impersonation error:', error);
  }

  return (
    <ComponentErrorBoundary componentName={componentName}>
      <MockAuthUIProvider>
        <MockDataProvider>
          <div className="p-6 border rounded-lg bg-muted/30">
            <Component {...componentProps} />
          </div>
        </MockDataProvider>
      </MockAuthUIProvider>
    </ComponentErrorBoundary>
  );
};

export default function ComponentPage({ params }: PageProps) {
  const { slug } = use(params);
  const data = allComponentsMap[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Component Not Found</h1>
          <Link href="/example" className="text-primary hover:underline">
            Back to components
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/example" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to components
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold">{data.name}</h1>
            <Badge variant="secondary">{data.category}</Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-3 mb-8">
          <Button asChild variant="outline" size="sm">
            <a 
              href="https://www.npmjs.com/package/@bettercone/ui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              NPM Package
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a 
              href="https://docs.bettercone.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Documentation
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        {/* Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Live component preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComponentPreview componentName={data.name} />
          </CardContent>
        </Card>

        {/* Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              Import and use this component in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{data.usage}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Props (if available) */}
        {/* Props section removed - available in Better Auth documentation */}

        {/* Note */}
        <div className="mt-8 p-4 border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Components from @bettercone/ui require Better Auth configuration. 
            If a component fails to render above, it may need specific context or data. 
            See the{" "}
            <a 
              href="https://docs.bettercone.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              BetterCone documentation
            </a>
            {" "}for setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
