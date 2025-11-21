"use client";

import * as React from "react";
import { Mail, UserPlus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthUIContext } from "@/lib/auth-ui-provider";

export interface AnonymousUpgradeCardClassNames {
  card?: string;
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  alert?: string;
  buttonContainer?: string;
  button?: string;
}

export interface AnonymousUpgradeCardLocalization {
  title?: string;
  description?: string;
  alertMessage?: string;
  signUpWithEmail?: string;
  linkOAuth?: string;
  benefits?: {
    title?: string;
    items?: string[];
  };
}

export interface AnonymousUpgradeCardProps {
  /**
   * Callback when user clicks to upgrade with email
   */
  onUpgradeWithEmail?: () => void;
  
  /**
   * Callback when user clicks to link OAuth account
   */
  onLinkOAuth?: () => void;
  
  /**
   * Show OAuth providers for linking
   * @default false
   */
  showOAuthProviders?: boolean;
  
  /**
   * OAuth providers to display
   */
  oauthProviders?: Array<{
    id: string;
    name: string;
    icon?: React.ReactNode;
  }>;
  
  /**
   * Custom class names for styling
   */
  classNames?: AnonymousUpgradeCardClassNames;
  
  /**
   * Localization strings
   */
  localization?: AnonymousUpgradeCardLocalization;
  
  /**
   * Custom class name for the card
   */
  className?: string;
}

const defaultLocalization: Required<AnonymousUpgradeCardLocalization> = {
  title: "Upgrade Your Account",
  description: "You're currently signed in as a guest. Upgrade to save your progress and access more features.",
  alertMessage: "Guest accounts are temporary. Link an account to keep your data.",
  signUpWithEmail: "Sign up with Email",
  linkOAuth: "Link {provider}",
  benefits: {
    title: "Benefits of upgrading:",
    items: [
      "Save your progress across devices",
      "Access your account from anywhere",
      "Enhanced security features",
      "Never lose your data"
    ]
  }
};

export function AnonymousUpgradeCard({
  onUpgradeWithEmail,
  onLinkOAuth,
  showOAuthProviders = false,
  oauthProviders = [],
  classNames = {},
  localization = {},
  className,
}: AnonymousUpgradeCardProps) {
  const context = React.useContext(AuthUIContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const loc = {
    ...defaultLocalization,
    ...localization,
    benefits: {
      ...defaultLocalization.benefits,
      ...localization.benefits
    }
  };

  const handleUpgradeWithEmail = async () => {
    setIsLoading(true);
    try {
      if (onUpgradeWithEmail) {
        await onUpgradeWithEmail();
      } else {
        // Default: Navigate to sign-up page
        const basePath = context?.basePath || "/auth";
        window.location.href = `${basePath}/sign-up`;
      }
    } catch (error) {
      console.error("Failed to upgrade account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkOAuth = async (providerId: string) => {
    setIsLoading(true);
    try {
      if (onLinkOAuth) {
        await onLinkOAuth();
      } else {
        // Default: Navigate to OAuth sign-in
        const basePath = context?.basePath || "/auth";
        window.location.href = `${basePath}/sign-in?provider=${providerId}`;
      }
    } catch (error) {
      console.error("Failed to link account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className || classNames.card}>
      <CardHeader className={classNames.header}>
        <CardTitle className={classNames.title}>{loc.title}</CardTitle>
        <CardDescription className={classNames.description}>
          {loc.description}
        </CardDescription>
      </CardHeader>
      <CardContent className={classNames.content}>
        <div className="space-y-4">
          {/* Alert */}
          <Alert className={classNames.alert}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loc.alertMessage}</AlertDescription>
          </Alert>

          {/* Benefits List */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{loc.benefits.title}</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {(loc.benefits.items || []).map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={`space-y-2 ${classNames.buttonContainer || ""}`}>
            {/* Email Sign-up Button */}
            <Button
              className={`w-full ${classNames.button || ""}`}
              onClick={handleUpgradeWithEmail}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              {loc.signUpWithEmail}
            </Button>

            {/* OAuth Provider Buttons */}
            {showOAuthProviders && oauthProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className={`w-full ${classNames.button || ""}`}
                onClick={() => handleLinkOAuth(provider.id)}
                disabled={isLoading}
              >
                {provider.icon || <UserPlus className="mr-2 h-4 w-4" />}
                {loc.linkOAuth.replace("{provider}", provider.name)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
