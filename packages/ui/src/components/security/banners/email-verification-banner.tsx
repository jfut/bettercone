"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, X, Loader2, AlertTriangle } from "lucide-react";
import { AuthUIContext } from "@/lib/auth-ui-provider";
import type { BetterAuthClient } from "@/types/auth";

export interface EmailVerificationBannerClassNames {
  alert?: string;
  button?: string;
  description?: string;
  error?: string;
  icon?: string;
  message?: string;
  title?: string;
}

export interface EmailVerificationBannerProps {
  /**
   * Better Auth client instance
   */
  authClient?: BetterAuthClient;
  /**
   * Whether the banner can be dismissed
   * @default true
   */
  dismissible?: boolean;
  /**
   * Cooldown period in seconds before allowing resend
   * @default 60
   */
  cooldown?: number;
  /**
   * Email address to send verification to
   * If not provided, uses current user's email
   */
  email?: string;
  /**
   * Callback URL after verification
   */
  callbackURL?: string;
  /**
   * Callback when verification email is sent
   */
  onResend?: () => void;
  /**
   * Callback when verification is successful
   */
  onVerified?: () => void;
  /**
   * Callback when banner is dismissed
   */
  onDismiss?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom class names for specific parts
   */
  classNames?: EmailVerificationBannerClassNames;
  /**
   * Custom localization strings
   */
  localization?: {
    title?: string;
    description?: string;
    resendButton?: string;
    resendingButton?: string;
    dismissButton?: string;
    successMessage?: string;
    errorMessage?: string;
    cooldownMessage?: string;
  };
}

/**
 * Email Verification Banner Component
 * 
 * Displays a persistent banner to unverified users prompting them to verify their email.
 * Includes functionality to resend verification emails with cooldown protection.
 * 
 * @example
 * ```tsx
 * <EmailVerificationBanner
 *   authClient={authClient}
 *   dismissible
 *   cooldown={60}
 *   onResend={() => console.log('Email sent')}
 * />
 * ```
 */
export function EmailVerificationBanner({
  authClient: providedAuthClient,
  dismissible = true,
  cooldown = 60,
  email,
  callbackURL,
  onResend,
  onVerified,
  onDismiss,
  className,
  classNames = {},
  localization,
}: EmailVerificationBannerProps) {
  const context = React.useContext(AuthUIContext);
  const authClient = providedAuthClient || context?.authClient;

  const [isDismissed, setIsDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultLocalization = {
    title: localization?.title || "Please verify your email",
    description: localization?.description || "We sent you a verification email. Please check your inbox and click the link to verify your account.",
    resendButton: localization?.resendButton || "Resend Email",
    resendingButton: localization?.resendingButton || "Sending...",
    dismissButton: localization?.dismissButton || "Dismiss",
    successMessage: localization?.successMessage || "Verification email sent! Please check your inbox.",
    errorMessage: localization?.errorMessage || "Failed to send verification email. Please try again.",
    cooldownMessage: localization?.cooldownMessage || "Please wait {seconds}s before resending",
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Auto-hide success/error messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleResend = async () => {
    if (!authClient || isSending || cooldownRemaining > 0) return;

    setIsSending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.$fetch("/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || "",
          callbackURL: callbackURL || window.location.origin,
        }),
      });

      if (!result.ok) {
        throw new Error("Failed to send verification email");
      }

      setSuccessMessage(defaultLocalization.successMessage);
      setCooldownRemaining(cooldown);
      onResend?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : defaultLocalization.errorMessage
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Alert className={cn(className, classNames?.alert)}>
      <Mail className={cn("h-4 w-4", classNames?.icon)} />
      <AlertDescription className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className={cn("font-medium", classNames?.title)}>
            {defaultLocalization.title}
          </p>
          <p className={cn("text-sm text-muted-foreground", classNames?.description)}>
            {defaultLocalization.description}
          </p>

          {successMessage && (
            <p className={cn("text-sm font-medium", classNames?.message)}>
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <Alert variant="destructive" className={cn("mt-2", classNames?.error)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isSending || cooldownRemaining > 0}
              className={cn(classNames?.button)}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {defaultLocalization.resendingButton}
                </>
              ) : cooldownRemaining > 0 ? (
                defaultLocalization.cooldownMessage.replace(
                  "{seconds}",
                  cooldownRemaining.toString()
                )
              ) : (
                defaultLocalization.resendButton
              )}
            </Button>

            {dismissible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className={cn(classNames?.button)}
              >
                {defaultLocalization.dismissButton}
              </Button>
            )}
          </div>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
