/**
 * device-code-display
 * Enhanced for @bettercone/ui
 */

"use client"

import * as React from "react"
import QRCode from "react-qr-code"
import { Copy, Clock, Loader2, CheckCheck } from "lucide-react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"

export interface DeviceCodeDisplayProps {
    /**
     * The device code from the authorization request
     */
    deviceCode: string

    /**
     * The user-friendly code to display
     */
    userCode: string

    /**
     * The verification URI where users enter the code
     */
    verificationUri: string

    /**
     * Complete verification URI (includes user code as parameter)
     * Optional, for QR code generation
     */
    verificationUriComplete?: string

    /**
     * Time in seconds until the code expires
     */
    expiresIn: number

    /**
     * Custom CSS class for the card
     */
    className?: string

    /**
     * Show QR code for mobile scanning
     * @default false
     * Note: Requires QR code component to be installed
     */
    showQRCode?: boolean

    /**
     * Callback when code expires
     */
    onExpired?: () => void

    /**
     * Callback when authorization is successful
     */
    onSuccess?: () => void

    /**
     * Callback when authorization fails
     */
    onError?: (error: string) => void

    /**
     * Polling interval in seconds
     * @default 5
     */
    pollingInterval?: number

    /**
     * Whether to automatically poll for authorization
     * @default true
     */
    autoPoll?: boolean

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>
}

/**
 * DeviceCodeDisplay Component
 *
 * Displays device authorization codes for CLI applications, smart TVs, and IoT devices.
 * Shows a large, readable code and verification URL, with optional QR code.
 * Includes countdown timer and automatic polling for authorization status.
 *
 * @example
 * ```tsx
 * import { DeviceCodeDisplay } from '@bettercone/ui';
 *
 * export function CLIAuthFlow() {
 *   const { deviceCode, userCode, verificationUri, expiresIn } = await requestDeviceCode();
 *
 *   return (
 *     <DeviceCodeDisplay
 *       deviceCode={deviceCode}
 *       userCode={userCode}
 *       verificationUri={verificationUri}
 *       expiresIn={expiresIn}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * With QR code
 * ```tsx
 * <DeviceCodeDisplay
 *   deviceCode={deviceCode}
 *   userCode={userCode}
 *   verificationUri={verificationUri}
 *   verificationUriComplete={verificationUriComplete}
 *   expiresIn={1800}
 *   showQRCode={true}
 * />
 * ```
 */
export function DeviceCodeDisplay({
    deviceCode,
    userCode,
    verificationUri,
    verificationUriComplete,
    expiresIn,
    className,
    showQRCode = false,
    onExpired,
    onSuccess,
    onError,
    pollingInterval = 5,
    autoPoll = true,
    localization: localizationProp,
}: DeviceCodeDisplayProps) {
    const context = React.useContext(AuthUIContext)
    const localization = React.useMemo(
        () => ({ ...context?.localization, ...localizationProp }),
        [context?.localization, localizationProp]
    )
    const authClient = context?.authClient

    const [timeRemaining, setTimeRemaining] = React.useState(expiresIn)
    const [isPolling, setIsPolling] = React.useState(autoPoll)
    const [isApproved, setIsApproved] = React.useState(false)
    const [copiedUrl, setCopiedUrl] = React.useState(false)
    const [copiedCode, setCopiedCode] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const pollingIntervalRef = React.useRef<number | null>(null)
    const countdownIntervalRef = React.useRef<number | null>(null)

    // Format user code for display (add dash after 4 characters)
    const formattedUserCode = userCode.length === 8
        ? `${userCode.slice(0, 4)}-${userCode.slice(4)}`
        : userCode

    // Format time remaining as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Countdown timer
    React.useEffect(() => {
        if (isApproved) return

        countdownIntervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    if (onExpired) onExpired()
                    setIsPolling(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
        }
    }, [isApproved, onExpired])

    // Polling for authorization status
    React.useEffect(() => {
        if (!authClient?.device || !isPolling || isApproved || timeRemaining === 0) return

        const poll = async () => {
            if (!authClient.device) return // Type guard for nested function
            
            try {
                const response = await authClient.device.token({
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    device_code: deviceCode,
                    client_id: verificationUri.split("/")[2], // Extract client ID from URL (temporary)
                })

                if (response.data?.access_token) {
                    setIsApproved(true)
                    setIsPolling(false)
                    if (onSuccess) onSuccess()
                } else if (response.error) {
                    switch (response.error.error) {
                        case "authorization_pending":
                            // Continue polling
                            break
                        case "slow_down":
                            // Increase polling interval (handled by server)
                            break
                        case "expired_token":
                            setError(localization.DEVICE_EXPIRED || "Code expired")
                            setIsPolling(false)
                            if (onError) onError("expired")
                            break
                        case "access_denied":
                            setError(
                                localization.DEVICE_ACCESS_DENIED || "Access denied"
                            )
                            setIsPolling(false)
                            if (onError) onError("denied")
                            break
                        default:
                            setError(response.error.error_description || "Unknown error")
                            setIsPolling(false)
                            if (onError) onError(response.error.error)
                    }
                }
            } catch (err) {
                // Continue polling on network errors
                console.error("Polling error:", err)
            }
        }

        // Initial poll
        poll()

        // Set up polling interval
        pollingIntervalRef.current = setInterval(poll, pollingInterval * 1000)

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
        }
    }, [
        authClient,
        deviceCode,
        isPolling,
        isApproved,
        timeRemaining,
        pollingInterval,
        verificationUri,
        onSuccess,
        onError,
        localization,
    ])

    const copyToClipboard = async (text: string, type: "url" | "code") => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === "url") {
                setCopiedUrl(true)
                setTimeout(() => setCopiedUrl(false), 2000)
            } else {
                setCopiedCode(true)
                setTimeout(() => setCopiedCode(false), 2000)
            }
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader className={cn("text-start")}>
                <CardTitle className={cn("text-lg md:text-xl")}>
                    {localization.DEVICE_DISPLAY_TITLE || "Sign In on Your Computer"}
                </CardTitle>
                <CardDescription className={cn("text-xs md:text-sm")}>
                    {localization.DEVICE_DISPLAY_DESCRIPTION ||
                        "Follow the steps below to complete authentication"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Step 1: Visit URL */}
                <div className="space-y-3">
                    <p className="text-sm font-medium">
                        {localization.DEVICE_DISPLAY_URL_LABEL || "1. Visit this URL"}
                    </p>
                    <div className="bg-secondary rounded-lg p-4 flex items-center gap-2">
                        <code className="flex-1 text-sm font-mono text-center break-all">
                            {verificationUri}
                        </code>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() => copyToClipboard(verificationUri, "url")}
                        >
                            {copiedUrl ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Step 2: Enter Code */}
                <div className="space-y-3">
                    <p className="text-sm font-medium">
                        {localization.DEVICE_DISPLAY_CODE_LABEL || "2. Enter this code"}
                    </p>
                    <div className="bg-secondary rounded-lg p-4 flex items-center gap-2">
                        <p className="flex-1 text-4xl md:text-5xl font-mono font-bold tracking-[0.3em] select-all text-center">
                            {formattedUserCode}
                        </p>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() => copyToClipboard(userCode, "code")}
                        >
                            {copiedCode ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* QR Code (optional) */}
                {showQRCode && verificationUriComplete && (
                    <div className="flex flex-col items-center gap-3 pt-2">
                        <div className="relative w-full">
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 text-muted-foreground">
                                    {localization.DEVICE_OR_SCAN_QR || "or scan QR code"}
                                </span>
                            </div>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                            <div className="bg-white dark:bg-white p-2 rounded">
                                <QRCode
                                    value={verificationUriComplete}
                                    size={180}
                                    level="H"
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>
                                {localization.DEVICE_EXPIRES_IN || "Expires in"}{" "}
                                <span
                                    className={cn(
                                        "font-mono font-semibold",
                                        timeRemaining < 300 &&
                                            "text-orange-600 dark:text-orange-400",
                                        timeRemaining < 60 && "text-destructive"
                                    )}
                                >
                                    {formatTime(timeRemaining)}
                                </span>
                            </span>
                        </div>
                        {isPolling && !isApproved && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>
                                        {localization.DEVICE_POLLING_STATUS || "Checking..."}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Success Message */}
                    {isApproved && (
                        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
                            <CheckCheck className="h-4 w-4" />
                            <AlertDescription>
                                {localization.DEVICE_APPROVED || "Approved! Redirecting..."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Expired Message */}
                    {timeRemaining === 0 && !isApproved && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {localization.DEVICE_EXPIRED ||
                                    "Code expired. Please try again."}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
