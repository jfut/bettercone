/**
 * Feature Access Card Component
 * Display available features based on subscription
 * 
 * Three-Tier Pattern:
 * - Tier 1 (Self-Contained): Auto-fetches via AuthUIContext
 * - Tier 2 (Agnostic): Custom authClient prop
 * - Tier 3 (Presentational): Manual props (backward compatible)
 */

"use client";

import { useContext, useEffect, useState } from "react";
import { Zap, Check, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { AuthUIContext } from "../../lib/auth-ui-provider";

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
  /** 
   * Feature access configuration
   * Tier 3 (Presentational): Required if not using authClient or context
   */
  features?: FeatureAccess;
  
  /**
   * Better Auth client instance
   * Tier 2 (Agnostic): Provide custom authClient with usageTracking plugin
   */
  authClient?: any;
  
  /**
   * Organization ID - defaults to active organization
   * Used when fetching data via context or authClient
   */
  organizationId?: string;
  
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

/**
 * FeatureAccessCard Component
 * 
 * Three-Tier Pattern:
 * 1. Self-Contained: <FeatureAccessCard /> - Auto-fetches via AuthUIContext
 * 2. Agnostic: <FeatureAccessCard authClient={custom} /> - Custom backend
 * 3. Presentational: <FeatureAccessCard features={myFeatures} /> - Manual props
 * 
 * @example
 * // Tier 1: Self-Contained (Context-based)
 * <AuthUIProvider authClient={authClient}>
 *   <FeatureAccessCard />
 * </AuthUIProvider>
 * 
 * @example
 * // Tier 2: Agnostic (Custom client)
 * <FeatureAccessCard authClient={customAuthClient} />
 * 
 * @example
 * // Tier 3: Presentational (Manual props)
 * <FeatureAccessCard features={{ planId: "pro", advancedAnalytics: true }} />
 */
export function FeatureAccessCard({ 
  features: featuresProp,
  authClient: authClientProp,
  organizationId,
  featureConfig = defaultFeatureConfig,
  onUpgrade,
  className,
}: FeatureAccessCardProps) {
  const context = useContext(AuthUIContext);
  
  // State for fetched data
  const [features, setFeatures] = useState<FeatureAccess | undefined>();
  const [isPending, setIsPending] = useState(false);
  
  // Determine which authClient to use (context or prop)
  const authClient = authClientProp || context?.authClient;
  
  // Tier 1 & 2: Fetch from authClient with plugin
  useEffect(() => {
    // Skip if manual props provided (Tier 3)
    if (featuresProp) {
      return;
    }
    
    // Skip if no authClient or no plugin
    if (!authClient || !(authClient as any).usageTracking) {
      return;
    }
    
    const fetchFeatures = async () => {
      setIsPending(true);
      try {
        const plugin = (authClient as any).usageTracking;
        const data = await plugin.getUsage({ organizationId });
        
        setFeatures(data.features);
      } catch (error) {
        console.error("Failed to fetch features:", error);
        setFeatures(undefined);
      } finally {
        setIsPending(false);
      }
    };
    
    fetchFeatures();
  }, [authClient, organizationId, featuresProp]);
  
  // Tier 3: Use manual props
  const finalFeatures = featuresProp || features;
  
  if (isPending) return <FeatureAccessCardSkeleton className={className} />;
  if (!finalFeatures) return <FeatureAccessCardSkeleton className={className} />;
  
  return (
    <FeatureAccessCardUI
      features={finalFeatures}
      featureConfig={featureConfig}
      onUpgrade={onUpgrade}
      className={className}
    />
  );
}

/**
 * FeatureAccessCardUI - Pure presentational component
 * Separated for cleanliness and reusability
 */
function FeatureAccessCardUI({
  features,
  featureConfig = defaultFeatureConfig,
  onUpgrade,
  className,
}: {
  features: FeatureAccess;
  featureConfig?: FeatureConfig[];
  onUpgrade?: () => void;
  className?: string;
}) {
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
