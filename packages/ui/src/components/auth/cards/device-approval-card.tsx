/**
 * device-approval-card
 * Enhanced for @bettercone/ui
 */

"use client"

import * as React from "react"
import { CheckIcon, Loader2, XIcon, Smartphone } from "lucide-react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { SettingsCardClassNames } from "@/components/settings/shared/settings-card"

export interface DeviceApprovalCardProps {
    /**
     * The user code from the device authorization request
     * Usually passed as a URL query parameter
     */
    userCode: string

    /**
     * Custom CSS class for the card
     */
    className?: string

    /**
     * Custom class names for sub-components
     */
    classNames?: SettingsCardClassNames

    /**
     * URL to redirect to after approval or denial
     * @default "/"
     */
    redirectUrl?: string

    /**
     * Callback when device is approved
     */
    onApprove?: () => void

    /**
     * Callback when device is denied
     */
    onDeny?: () => void

    /**
     * Whether to show client information if available
     * @default true
     */
    showClientInfo?: boolean

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>
}

/**
 * DeviceApprovalCard Component
 *
 * Allows authenticated users to approve or deny device authorization requests.
 * Used in the OAuth 2.0 Device Authorization Grant flow (RFC 8628).
 *
 * @example
 * ```tsx
 * import { DeviceApprovalCard } from '@bettercone/ui';
 *
 * export function DeviceApprovalPage({ searchParams }) {
 *   return (
 *     <DeviceApprovalCard userCode={searchParams.user_code} />
 *   );
 * }
 * ```
 *
 * @example
 * With custom redirect
 * ```tsx
 * <DeviceApprovalCard 
 *   userCode="ABCD1234"
 *   redirectUrl="/dashboard"
 *   onApprove={() => console.log('Approved')}
 * />
 * ```
 */
export function DeviceApprovalCard({
    userCode,
    className,
    classNames,
    redirectUrl = "/",
    onApprove,
    onDeny,
    showClientInfo = true,
    localization: localizationProp,
}: DeviceApprovalCardProps) {
    const context = React.useContext(AuthUIContext)
    const localization = React.useMemo(
        () => ({ ...context?.localization, ...localizationProp }),
        [context?.localization, localizationProp]
    )
    const authClient = context?.authClient

    const [isApproving, setIsApproving] = React.useState(false)
    const [isDenying, setIsDenying] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const [deviceInfo, setDeviceInfo] = React.useState<{
        clientId?: string
        scope?: string
    } | null>(null)
    const [isPending, setIsPending] = React.useState(true)

    // Fetch device information on mount
    React.useEffect(() => {
        const fetchDeviceInfo = async () => {
            if (!authClient?.device || !userCode) {
                setIsPending(false)
                return
            }

            try {
                const response = await authClient.device({
                    query: { user_code: userCode },
                })

                if (response.data) {
                    setDeviceInfo({
                        clientId: response.data.clientId,
                        scope: response.data.scope,
                    })
                }
            } catch (err) {
                // Silently fail - device info is optional
                console.error("Failed to fetch device info:", err)
            } finally {
                setIsPending(false)
            }
        }

        fetchDeviceInfo()
    }, [authClient, userCode])

    const handleApprove = async () => {
        if (!authClient?.device) {
            setError(localization.DEVICE_CODE_NO_CLIENT || "Auth client not configured")
            return
        }

        setIsApproving(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await authClient.device.approve({
                userCode: userCode,
            })

            if (response.data) {
                setSuccess(
                    localization.DEVICE_APPROVED_SUCCESS || "Device approved successfully"
                )

                // Call onApprove callback
                if (onApprove) {
                    onApprove()
                }

                // Redirect after short delay to show success message
                setTimeout(() => {
                    if (typeof window !== "undefined") {
                        window.location.href = redirectUrl
                    }
                }, 1500)
            } else if (response.error) {
                setError(
                    response.error.message ||
                    localization.DEVICE_APPROVE_ERROR ||
                    "Failed to approve device"
                )
            }
        } catch (err) {
            setError(localization.DEVICE_APPROVE_ERROR || "Failed to approve device")
        } finally {
            setIsApproving(false)
        }
    }

    const handleDeny = async () => {
        if (!authClient?.device) {
            setError(localization.DEVICE_CODE_NO_CLIENT || "Auth client not configured")
            return
        }

        setIsDenying(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await authClient.device.deny({
                userCode: userCode,
            })

            if (response.data) {
                setSuccess(localization.DEVICE_DENIED_SUCCESS || "Device denied")

                // Call onDeny callback
                if (onDeny) {
                    onDeny()
                }

                // Redirect after short delay to show success message
                setTimeout(() => {
                    if (typeof window !== "undefined") {
                        window.location.href = redirectUrl
                    }
                }, 1500)
            } else if (response.error) {
                setError(
                    response.error.message ||
                    localization.DEVICE_DENY_ERROR ||
                    "Failed to deny device"
                )
            }
        } catch (err) {
            setError(localization.DEVICE_DENY_ERROR || "Failed to deny device")
        } finally {
            setIsDenying(false)
        }
    }

    const isProcessing = isApproving || isDenying

    // Format user code for display (add dash)
    const formattedUserCode = userCode.length === 8
        ? `${userCode.slice(0, 4)}-${userCode.slice(4)}`
        : userCode

    if (isPending) {
        return <DeviceApprovalSkeleton className={className} classNames={classNames} localization={localization} />
    }

    if (success) {
        return (
            <Card className={cn("w-full max-w-md", className, classNames?.base)}>
                <CardHeader className={cn("text-center", classNames?.header)}>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
                    </div>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {success}
                    </CardTitle>
                    <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                        {localization.DEVICE_APPROVED_SUCCESS || "Redirecting..."}
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className={cn("w-full max-w-md border-destructive/40", className, classNames?.base)}>
                <CardHeader className={cn("text-center", classNames?.header)}>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <XIcon className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                        {localization.UNEXPECTED_ERROR || "Error"}
                    </CardTitle>
                    <CardDescription className={cn("text-xs md:text-sm text-destructive", classNames?.description)}>
                        {error}
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className={cn("w-full max-w-md", className, classNames?.base)}>
            <CardHeader className={cn("text-center", classNames?.header)}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
                    {localization.DEVICE_APPROVAL_TITLE || "Device Authorization"}
                </CardTitle>
                <CardDescription className={cn("text-xs md:text-sm", classNames?.description)}>
                    {localization.DEVICE_APPROVAL_DESCRIPTION || "A device is requesting access to your account"}
                </CardDescription>
            </CardHeader>
            <CardContent className={cn("flex flex-col gap-6", classNames?.content)}>
                {/* Device Code Display */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground text-center">
                            {localization.DEVICE_APPROVAL_CODE_LABEL || "Device Code"}
                        </p>
                        <p className="text-center text-2xl font-mono font-bold tracking-wider">
                            {formattedUserCode}
                        </p>
                    </div>
                </Card>

                {/* Client Information (if available) */}
                {showClientInfo && (deviceInfo?.clientId || deviceInfo?.scope) && (
                    <div className="space-y-2">
                        {deviceInfo?.clientId && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    {localization.DEVICE_APPROVAL_APP_LABEL || "Application"}
                                </p>
                                <p className="text-sm">{deviceInfo.clientId}</p>
                            </div>
                        )}

                        {deviceInfo?.scope && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {localization.DEVICE_APPROVAL_SCOPES_LABEL || "Permissions"}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {deviceInfo.scope.split(" ").map((scope) => (
                                        <Badge key={scope} variant="secondary" className="text-xs">
                                            {scope}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className={cn(classNames?.button, classNames?.outlineButton)}
                        onClick={handleDeny}
                        disabled={isProcessing}
                    >
                        {isDenying ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <XIcon />
                        )}

                        {localization.DEVICE_DENY_BUTTON || "Deny"}
                    </Button>

                    <Button
                        className={cn("bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800", classNames?.button, classNames?.primaryButton)}
                        onClick={handleApprove}
                        disabled={isProcessing}
                    >
                        {isApproving ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <CheckIcon />
                        )}

                        {localization.DEVICE_APPROVE_BUTTON || "Approve"}
                    </Button>
                </div>

                {/* Security Notice */}
                <p className="text-xs text-center text-muted-foreground">
                    {localization.DEVICE_APPROVAL_NOTICE ||
                        "Only approve if you initiated this request on your device"}
                </p>
            </CardContent>
        </Card>
    )
}

function DeviceApprovalSkeleton({
    className,
    classNames,
    localization,
}: Pick<DeviceApprovalCardProps, 'className' | 'classNames' | 'localization'>) {
    return (
        <Card className={cn("w-full max-w-md", className, classNames?.base)}>
            <CardHeader className={cn("text-center", classNames?.header)}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className={cn("mx-auto h-5 w-48 md:h-5.5", classNames?.skeleton)} />
                <Skeleton className={cn("mx-auto mt-2 h-3 w-64 md:h-3.5", classNames?.skeleton)} />
            </CardHeader>
            <CardContent className={cn("flex flex-col gap-6", classNames?.content)}>
                <Card className="p-4">
                    <div className="space-y-3">
                        <Skeleton className="mx-auto h-3 w-20" />
                        <Skeleton className="mx-auto h-8 w-32" />
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>

                <Skeleton className="mx-auto h-3 w-56" />
            </CardContent>
        </Card>
    )
}
