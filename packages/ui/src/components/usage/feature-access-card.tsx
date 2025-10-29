/**
 * Feature Access Card Component
 * Display available features based on subscription
 * Backend-agnostic - accepts feature configuration as props
 */

"use client";

import { Zap, Check, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export interface FeatureAccess {
  planId?: string;
  advancedAnalytics?: boolean;
  apiAccess?: boolean;
  customIntegrations?: boolean;
  prioritySupport?: boolean;
  [key: string]: boolean | string | undefined;
}

export interface FeatureConfig {
  key: string;
  label: string;
  description: string;
}

export interface FeatureAccessCardProps {
  /** Feature access configuration */
  features: FeatureAccess | undefined;
  
  /** Optional custom feature configuration */
  featureConfig?: FeatureConfig[];
  
  /** Callback when upgrade button is clicked */
  onUpgrade?: () => void;
  
  /** Optional CSS class name */
  className?: string;
}

const defaultFeatureConfig: FeatureConfig[] = [
  { 
    key: "advancedAnalytics",
    label: "Advanced Analytics",
    description: "Detailed insights and reports"
  },
  { 
    key: "apiAccess",
    label: "API Access",
    description: "REST API integration"
  },
  { 
    key: "customIntegrations",
    label: "Custom Integrations",
    description: "Connect with third-party tools"
  },
  { 
    key: "prioritySupport",
    label: "Priority Support",
    description: "24/7 priority assistance"
  },
];

export function FeatureAccessCard({ 
  features, 
  featureConfig = defaultFeatureConfig,
  onUpgrade,
  className,
}: FeatureAccessCardProps) {
  // Handle undefined states
  if (!features) {
    return <FeatureAccessCardSkeleton className={className} />;
  }

  const enabledFeatures = featureConfig.filter(f => features[f.key] === true);
  const disabledFeatures = featureConfig.filter(f => features[f.key] === false);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Feature Access</CardTitle>
          </div>
          {features.planId && (
            <Badge variant="outline" className="capitalize">
              {features.planId} Plan
            </Badge>
          )}
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

export function FeatureAccessCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
