/**
 * device-authorization-card
 * Enhanced for @bettercone/ui
 */

"use client"

import * as React from "react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import type { AuthLocalization } from "@/localization/auth-localization"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface DeviceAuthorizationCardProps {
    /**
     * Custom CSS class for the card
     */
    className?: string

    /**
     * URL to redirect to after successful code validation
     * The user_code will be appended as a query parameter
     * @default "/device/approve"
     */
    redirectUrl?: string

    /**
     * Callback when code is successfully validated
     * @param userCode - The validated user code
     */
    onSuccess?: (userCode: string) => void

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>
}

/**
 * DeviceAuthorizationCard Component
 *
 * A card component that allows users to enter device authorization codes.
 * Used in the OAuth 2.0 Device Authorization Grant flow (RFC 8628).
 * Validates the code and redirects to the approval page.
 *
 * @example
 * ```tsx
 * import { DeviceAuthorizationCard } from '@bettercone/ui';
 *
 * export function DevicePage() {
 *   return (
 *     <DeviceAuthorizationCard />
 *   );
 * }
 * ```
 *
 * @example
 * With custom redirect
 * ```tsx
 * <DeviceAuthorizationCard 
 *   redirectUrl="/auth/device/confirm"
 *   onSuccess={(code) => console.log('Valid code:', code)}
 * />
 * ```
 */
export function DeviceAuthorizationCard({
    className,
    redirectUrl = "/device/approve",
    onSuccess,
    localization: localizationProp,
}: DeviceAuthorizationCardProps) {
    const context = React.useContext(AuthUIContext)
    const localization = React.useMemo(
        () => ({ ...context?.localization, ...localizationProp }),
        [context?.localization, localizationProp]
    )
    const authClient = context?.authClient

    const [userCode, setUserCode] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Format user code: remove dashes, convert to uppercase, add dash after 4 chars
    const formatUserCode = (value: string) => {
        // Remove all non-alphanumeric characters and convert to uppercase
        const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase()
        
        // Limit to 8 characters
        const limited = cleaned.slice(0, 8)
        
        // Add dash after 4 characters
        if (limited.length > 4) {
            return `${limited.slice(0, 4)}-${limited.slice(4)}`
        }
        
        return limited
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatUserCode(e.target.value)
        setUserCode(formatted)
        setError(null) // Clear error on input change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!authClient?.device) {
            setError(localization.DEVICE_CODE_NO_CLIENT || "Auth client not configured")
            return
        }

        if (!userCode || userCode.length < 8) {
            setError(localization.DEVICE_CODE_REQUIRED || "Please enter a valid device code")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Remove dash for API call
            const formattedCode = userCode.replace(/-/g, "")

            // Verify the code is valid
            const response = await authClient.device({
                query: { user_code: formattedCode },
            })

            if (response.data) {
                // Code is valid, call onSuccess callback
                if (onSuccess) {
                    onSuccess(formattedCode)
                }

                // Redirect to approval page
                if (typeof window !== "undefined") {
                    window.location.href = `${redirectUrl}?user_code=${formattedCode}`
                }
            } else if (response.error) {
                setError(
                    response.error.message || 
                    localization.DEVICE_CODE_INVALID || 
                    "Invalid or expired code"
                )
            }
        } catch (err) {
            setError(localization.DEVICE_CODE_INVALID || "Invalid or expired code")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader>
                <CardTitle>
                    {localization.DEVICE_AUTH_TITLE || "Enter Your Device Code"}
                </CardTitle>
                <CardDescription>
                    {localization.DEVICE_AUTH_DESCRIPTION ||
                        "Enter the code shown on your device to continue."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="device-code">
                            {localization.DEVICE_CODE_LABEL || "Device Code"}
                        </Label>
                        <Input
                            id="device-code"
                            type="text"
                            placeholder={
                                localization.DEVICE_CODE_PLACEHOLDER || "ABCD-1234"
                            }
                            value={userCode}
                            onChange={handleInputChange}
                            maxLength={9} // 8 characters + 1 dash
                            className={cn(
                                "font-mono text-lg tracking-wider text-center uppercase",
                                error && "border-destructive"
                            )}
                            disabled={isLoading}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                        />
                        <p className="text-xs text-muted-foreground">
                            {localization.DEVICE_CODE_FORMAT || "Format: XXXX-XXXX"}
                        </p>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive" role="alert">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || userCode.length < 8}
                    >
                        {isLoading
                            ? localization.LOADING || "Loading..."
                            : localization.DEVICE_AUTH_SUBMIT || "Continue"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
