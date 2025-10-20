/**
 * Feature Access Card Component
 * Display available features based on subscription
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Check, Lock } from "lucide-react";
import type { FeatureAccess } from "./types";

interface FeatureAccessCardProps {
  features: FeatureAccess;
  onUpgrade?: () => void;
}

const featureConfig = [
  { 
    key: "advancedAnalytics" as keyof FeatureAccess,
    label: "Advanced Analytics",
    description: "Detailed insights and reports"
  },
  { 
    key: "apiAccess" as keyof FeatureAccess,
    label: "API Access",
    description: "REST API integration"
  },
  { 
    key: "customIntegrations" as keyof FeatureAccess,
    label: "Custom Integrations",
    description: "Connect with third-party tools"
  },
  { 
    key: "prioritySupport" as keyof FeatureAccess,
    label: "Priority Support",
    description: "24/7 priority assistance"
  },
];

export function FeatureAccessCard({ features, onUpgrade }: FeatureAccessCardProps) {
  const enabledFeatures = featureConfig.filter(f => features[f.key] === true);
  const disabledFeatures = featureConfig.filter(f => features[f.key] === false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Feature Access</CardTitle>
          </div>
          <Badge variant="outline" className="capitalize">
            {features.planId} Plan
          </Badge>
        </div>
        <CardDescription>Available features in your current plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enabled Features */}
        {enabledFeatures.length > 0 && (
          <div className="space-y-2">
            {enabledFeatures.map((feature) => (
              <div
                key={feature.key}
                className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
              >
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Enabled
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Disabled Features */}
        {disabledFeatures.length > 0 && (
          <>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Upgrade to unlock</p>
              <div className="space-y-2">
                {disabledFeatures.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
                  >
                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Locked
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            {onUpgrade && (
              <Button onClick={onUpgrade} className="w-full">
                Upgrade to Unlock All Features
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton
export function FeatureAccessCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </CardContent>
    </Card>
  );
}
