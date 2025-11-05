"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { BetterAuthClient } from "../../types/auth";

export interface AnonymousSignInButtonProps {
  /**
   * Better Auth client instance
   */
  authClient?: BetterAuthClient;
  
  /**
   * Callback fired on successful anonymous sign-in
   */
  onSuccess?: (user: any) => void;
  
  /**
   * Callback fired on error
   */
  onError?: (error: Error) => void;
  
  /**
   * Redirect URL after successful sign-in
   */
  redirectTo?: string;
  
  /**
   * Button text
   * @default "Continue as Guest"
   */
  children?: React.ReactNode;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Button variant
   * @default "outline"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  /**
   * Button size
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";
  
  /**
   * Localization strings
   */
  localization?: {
    buttonText?: string;
    signingIn?: string;
  };
}

export function AnonymousSignInButton({
  authClient,
  onSuccess,
  onError,
  redirectTo,
  children = "Continue as Guest",
  className,
  variant = "outline",
  size = "default",
  localization = {},
}: AnonymousSignInButtonProps) {
  const context = React.useContext(AuthUIContext);
  const client = authClient || context?.authClient;
  
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!client) {
      const error = new Error("Auth client not provided");
      onError?.(error);
      return;
    }

    setIsLoading(true);

    try {
      // Call Better Auth anonymous sign-in
      const result = await client.$fetch("/sign-in/anonymous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error("Failed to sign in anonymously");
      }

      const user = await result.json();
      
      onSuccess?.(user);

      // Redirect if specified
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading 
        ? (localization.signingIn || "Signing in...") 
        : (localization.buttonText || children)
      }
    </Button>
  );
}
