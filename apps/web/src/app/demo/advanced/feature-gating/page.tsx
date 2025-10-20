"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { DemoLayout } from "@/components/layouts";
import { Lock, CheckCircle, AlertTriangle, Crown, Users } from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  referenceId: string;
  periodStart: string;
  periodEnd: string;
  seats?: number;
}

interface PlanInfo {
  name: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  features: {
    apiCalls: { limit: number; used: number };
    storage: { limit: number; used: number };
    teamMembers: { limit: number; used: number };
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };
}

export default function FeatureGatingDemo() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data, error } = await authClient.subscription.list();

        if (error) {
          console.error("Error fetching subscription:", error);
        } else if (data && data.length > 0) {
          // Get the active subscription
          const activeSub = data.find((sub: Subscription) => sub.status === "active" || sub.status === "trialing");
          setSubscription(activeSub || null);
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Error:", err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const getPlanFeatures = (plan: string | null): PlanInfo => {
    switch (plan) {
      case "team":
        return {
          name: "Team",
          variant: "default",
          features: {
            apiCalls: { limit: 100000, used: 45230 },
            storage: { limit: 100, used: 23.5 }, // GB
            teamMembers: { limit: 50, used: 12 },
            advancedAnalytics: true,
            prioritySupport: true,
            customIntegrations: true,
          }
        };
      case "pro":
        return {
          name: "Pro",
          variant: "secondary",
          features: {
            apiCalls: { limit: 10000, used: 8230 },
            storage: { limit: 10, used: 4.2 }, // GB
            teamMembers: { limit: 5, used: 2 },
            advancedAnalytics: false,
            prioritySupport: false,
            customIntegrations: false,
          }
        };
      default:
        return {
          name: "Free",
          variant: "outline",
          features: {
            apiCalls: { limit: 1000, used: 847 },
            storage: { limit: 1, used: 0.8 }, // GB
            teamMembers: { limit: 1, used: 1 },
            advancedAnalytics: false,
            prioritySupport: false,
            customIntegrations: false,
          }
        };
    }
  };

  const planInfo = getPlanFeatures(subscription?.plan || null);
  const features = planInfo.features;

  const FeatureGate = ({
    feature,
    children,
    fallback,
    planRequired
  }: {
    feature: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    planRequired?: string;
  }) => {
    if (feature) {
      return <>{children}</>;
    }

    return fallback || (
      <div className="flex items-center gap-2 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <Lock className="h-4 w-4 text-gray-400" />
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            This feature requires a {planRequired || "paid"} plan
          </p>
        </div>
        <Button size="sm" variant="outline">
          Upgrade
        </Button>
      </div>
    );
  };

  const UsageMeter = ({
    used,
    limit,
    label,
    unit = ""
  }: {
    used: number;
    limit: number;
    label: string;
    unit?: string;
  }) => {
    const percentage = (used / limit) * 100;
    const isNearLimit = percentage > 80;
    const isOverLimit = percentage > 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className={isOverLimit ? "text-red-600 font-medium" : isNearLimit ? "text-orange-600" : ""}>
            {used.toLocaleString()}{unit} / {limit.toLocaleString()}{unit}
          </span>
        </div>
        <Progress
          value={Math.min(percentage, 100)}
          className={`h-2 ${isOverLimit ? "[&>div]:bg-red-500" : isNearLimit ? "[&>div]:bg-orange-500" : ""}`}
        />
        {isNearLimit && !isOverLimit && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You&apos;re approaching your {label.toLowerCase()} limit. Consider upgrading your plan.
            </AlertDescription>
          </Alert>
        )}
        {isOverLimit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You&apos;ve exceeded your {label.toLowerCase()} limit. Upgrade to continue using this feature.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <DemoLayout
        title="Feature Gating Examples"
        description="Demonstrate subscription-based feature access and usage limits"
        category="Advanced"
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DemoLayout>
    );
  }

  return (
    <DemoLayout
      title="Feature Gating Examples"
      description="Demonstrate subscription-based feature access and usage limits"
      category="Advanced"
    >
      <div className="space-y-6">
        {/* Current Plan Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan: <Badge variant={planInfo.variant}>{planInfo.name}</Badge>
              {subscription?.status === "trialing" && (
                <Badge variant="outline">
                  Trial
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Your current subscription status and available features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic Features</span>
              </div>
              <div className="flex items-center gap-2">
                {features.advancedAnalytics ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm">Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                {features.prioritySupport ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm">Priority Support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Limits</CardTitle>
            <CardDescription>
              Monitor your current usage against plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UsageMeter
              used={features.apiCalls.used}
              limit={features.apiCalls.limit}
              label="API Calls"
              unit=""
            />
            <UsageMeter
              used={features.storage.used}
              limit={features.storage.limit}
              label="Storage"
              unit="GB"
            />
            <UsageMeter
              used={features.teamMembers.used}
              limit={features.teamMembers.limit}
              label="Team Members"
              unit=""
            />
          </CardContent>
        </Card>

        {/* Feature Gating Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Access Examples</CardTitle>
            <CardDescription>
              Examples of features that are gated based on your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Feature - Available to all */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Basic Dashboard
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Available on all plans - basic analytics and reporting
              </p>
              <Card className="p-4">
                <div className="text-center text-gray-600">
                  📊 Basic dashboard with standard metrics
                </div>
              </Card>
            </div>

            {/* Advanced Analytics - Pro and Team only */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {features.advancedAnalytics ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                Advanced Analytics
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Available on Pro and Team plans - detailed insights and custom reports
              </p>
              <FeatureGate
                feature={features.advancedAnalytics}
                planRequired="Pro or Team"
              >
                <Card className="p-4">
                  <div className="text-center text-gray-600">
                    📈 Advanced analytics with custom reports and AI insights
                  </div>
                </Card>
              </FeatureGate>
            </div>

            {/* Custom Integrations - Team only */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {features.customIntegrations ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                Custom Integrations
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Available on Team plans - build custom integrations and webhooks
              </p>
              <FeatureGate
                feature={features.customIntegrations}
                planRequired="Team"
              >
                <Card className="p-4">
                  <div className="text-center text-gray-600">
                    🔗 Custom integrations, webhooks, and API access
                  </div>
                </Card>
              </FeatureGate>
            </div>

            {/* Team Management - Based on seats */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Team Management
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Manage team members (limited by your plan)
              </p>
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team Members</span>
                    <Badge variant="outline">
                      {features.teamMembers.used} / {features.teamMembers.limit}
                    </Badge>
                  </div>
                  <div className="text-center text-gray-600">
                    👥 Team collaboration tools
                  </div>
                  {features.teamMembers.used >= features.teamMembers.limit && (
                    <Alert>
                      <Crown className="h-4 w-4" />
                      <AlertDescription>
                        You&apos;ve reached your team member limit. Upgrade to add more members.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Prompt */}
        {(!subscription || subscription.plan === "free") && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-blue-900">Unlock More Features</CardTitle>
              <CardDescription className="text-blue-700">
                Upgrade your plan to access advanced features and higher limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                View Pricing Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DemoLayout>
  );
}