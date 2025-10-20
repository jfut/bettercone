"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { DemoLayout } from "@/components/layouts";
import { Clock, AlertTriangle, CheckCircle, Crown, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  referenceId: string;
  periodStart: string;
  periodEnd: string;
  trialEnd?: string;
  seats?: number;
}

export default function TrialManagementDemo() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

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

          // Calculate trial days left if in trial
          if (activeSub?.status === "trialing" && activeSub.trialEnd) {
            const trialEnd = new Date(activeSub.trialEnd);
            const now = new Date();
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setTrialDaysLeft(Math.max(0, daysLeft));
          }
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

  const handleStartTrial = async (planId: string) => {
    try {
      const { data, error } = await authClient.subscription.create({
        plan: planId,
        successUrl: `${window.location.origin}/demo/advanced/trial-management`,
        cancelUrl: `${window.location.origin}/demo/advanced/trial-management`,
      });

      if (error) {
        console.error("Error starting trial:", error);
        toast.error("Trial Start Failed", {
          description: "Error starting trial. Please try again."
        });
      } else {
        toast.loading("Starting your trial...");
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Trial Start Failed", {
        description: "Error starting trial. Please try again."
      });
    }
  };

  const handleUpgradeFromTrial = () => {
    // In a real app, this would redirect to billing portal or checkout
    toast.info("Upgrade Available", {
      description: "Redirecting to billing portal to upgrade your plan..."
    });
  };

  const getTrialStatus = () => {
    if (!subscription || subscription.status !== "trialing") return null;

    if (trialDaysLeft === null) return null;

    if (trialDaysLeft <= 0) {
      return {
        status: "expired",
        message: "Your trial has expired",
        color: "destructive",
        icon: AlertTriangle,
      };
    } else if (trialDaysLeft <= 3) {
      return {
        status: "ending",
        message: `Trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"}`,
        color: "destructive" as const,
        icon: AlertTriangle,
      };
    } else if (trialDaysLeft <= 7) {
      return {
        status: "warning",
        message: `${trialDaysLeft} days left in trial`,
        color: "default" as const,
        icon: Clock,
      };
    } else {
      return {
        status: "active",
        message: `${trialDaysLeft} days left in trial`,
        color: "default" as const,
        icon: CheckCircle,
      };
    }
  };

  const trialStatus = getTrialStatus();

  if (loading) {
    return (
      <DemoLayout
        title="Trial Management Demo"
        description="Demonstrate trial periods, expiration handling, and conversion flows"
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
      title="Trial Management Demo"
      description="Demonstrate trial periods, expiration handling, and conversion flows"
      category="Advanced"
    >
      <div className="space-y-6">
        {/* Current Trial Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Trial Status
              {subscription?.status === "trialing" && (
                <Badge variant={trialStatus?.color === "destructive" ? "destructive" : "secondary"}>
                  Trial Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Monitor your trial period and manage trial-to-paid conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription?.status === "trialing" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {trialStatus?.icon && <trialStatus.icon className="h-5 w-5" />}
                    <span className="font-medium">{trialStatus?.message}</span>
                  </div>
                  <Badge variant="outline">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                  </Badge>
                </div>

                {trialDaysLeft !== null && trialDaysLeft > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trial Progress</span>
                      <span>{trialDaysLeft} days remaining</span>
                    </div>
                    <Progress
                      value={((subscription.plan === "pro" ? 14 : 30) - trialDaysLeft) / (subscription.plan === "pro" ? 14 : 30) * 100}
                      className="h-2"
                    />
                  </div>
                )}

                {trialStatus?.status === "ending" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your trial is ending soon. Upgrade now to avoid service interruption.
                    </AlertDescription>
                  </Alert>
                )}

                {trialStatus?.status === "expired" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your trial has expired. Upgrade to continue using premium features.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleUpgradeFromTrial} className="flex-1">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              </div>
            ) : subscription ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Active Subscription</p>
                <p className="text-gray-600">
                  You have an active {subscription.plan} subscription. No trial needed!
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium">No Active Subscription</p>
                <p className="text-gray-600 mb-4">
                  Start a trial to access premium features
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => handleStartTrial("pro")}>
                    Start Pro Trial (14 days)
                  </Button>
                  <Button variant="outline" onClick={() => handleStartTrial("team")}>
                    Start Team Trial (30 days)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trial Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Trial Benefits</CardTitle>
            <CardDescription>
              What you get during your trial period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Full Access</p>
                  <p className="text-sm text-gray-600">Access all premium features during trial</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">No Credit Card Required</p>
                  <p className="text-sm text-gray-600">Start trial without payment information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Flexible Upgrade</p>
                  <p className="text-sm text-gray-600">Upgrade anytime during or after trial</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Cancel Anytime</p>
                  <p className="text-sm text-gray-600">Cancel trial before it expires</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Trial Conversion Flow</CardTitle>
            <CardDescription>
              How trial users are converted to paying customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium">Trial Signup</p>
                  <p className="text-sm text-gray-600">User starts trial without payment info</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium">Trial Experience</p>
                  <p className="text-sm text-gray-600">User explores all features and benefits</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-medium text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium">Trial Ending Warning</p>
                  <p className="text-sm text-gray-600">7 days before expiry, show upgrade prompts</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-medium text-sm">
                  4
                </div>
                <div>
                  <p className="font-medium">Conversion</p>
                  <p className="text-sm text-gray-600">User upgrades to paid plan or trial expires</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Abuse Prevention */}
        <Card>
          <CardHeader>
            <CardTitle>Trial Abuse Prevention</CardTitle>
            <CardDescription>
              Automatic prevention of trial abuse and multiple trial accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">One Trial Per User</p>
                  <p className="text-sm text-gray-600">Users can only start one trial per plan type</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">IP-Based Detection</p>
                  <p className="text-sm text-gray-600">Prevent multiple accounts from same IP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Device Fingerprinting</p>
                  <p className="text-sm text-gray-600">Advanced detection of trial abuse patterns</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Automatic Blocking</p>
                  <p className="text-sm text-gray-600">Suspicious accounts automatically flagged</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoLayout>
  );
}