/**
 * api-key-cell
 * Enhanced to show Better Auth native fields: remaining, rate limits, refills, permissions
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import { KeyRoundIcon, ActivityIcon, RefreshCwIcon, ShieldCheckIcon, AlertTriangleIcon } from "lucide-react"
import { useContext, useState, useMemo } from "react"

import { useLang } from "@/hooks/use-lang"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import type { ApiKey } from "@/types/api-key"
import type { Refetch } from "@/types/refetch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { SettingsCardClassNames } from "@/components/settings/shared/settings-card"
import { ApiKeyDeleteDialog } from "@/components/settings/api-key/api-key-delete-dialog"
import { UpdateApiKeyDialog } from "../dialogs"

export interface ApiKeyCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    apiKey: ApiKey
    localization?: Partial<AuthLocalization>
    refetch?: Refetch
    showUsage?: boolean
    showRateLimit?: boolean
    showRefill?: boolean
    showPermissions?: boolean
    onClick?: () => void
    isSelected?: boolean
}

export function ApiKeyCell({
    className,
    classNames,
    apiKey,
    localization,
    refetch,
    showUsage = true,
    showRateLimit = true,
    showRefill = true,
    showPermissions = true,
    onClick,
    isSelected = false
}: ApiKeyCellProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)
    localization = { ...contextLocalization, ...localization }

    const { lang } = useLang()

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    // Format expiration date or show "Never expires"
    const formatExpiration = () => {
        if (!apiKey.expiresAt) return localization.NEVER_EXPIRES

        const expiresDate = new Date(apiKey.expiresAt)
        return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(
            lang ?? "en",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        )}`
    }

    // Calculate usage percentage
    const usagePercentage = useMemo(() => {
        if (!apiKey.remaining || !showUsage) return null
        // If we have remaining, we need to infer the total
        // This assumes remaining starts at some value and decrements
        // For display, we can show just the remaining count
        return apiKey.remaining
    }, [apiKey.remaining, showUsage])

    // Format refill time
    const formatRefillTime = () => {
        if (!apiKey.refillInterval || !apiKey.lastRefillAt) return null
        
        const lastRefill = new Date(apiKey.lastRefillAt)
        const nextRefill = new Date(lastRefill.getTime() + apiKey.refillInterval)
        const now = new Date()
        
        if (nextRefill <= now) return "Refilling..."
        
        const diff = nextRefill.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        
        if (days > 0) return `Refills in ${days}d`
        if (hours > 0) return `Refills in ${hours}h`
        return "Refills soon"
    }

    // Format rate limit
    const formatRateLimit = () => {
        if (!apiKey.rateLimitEnabled || !apiKey.rateLimitMax || !apiKey.rateLimitTimeWindow) return null
        
        const hours = apiKey.rateLimitTimeWindow / (1000 * 60 * 60)
        const days = hours / 24
        
        if (days >= 1) return `${apiKey.requestCount}/${apiKey.rateLimitMax} per ${Math.round(days)}d`
        if (hours >= 1) return `${apiKey.requestCount}/${apiKey.rateLimitMax} per ${Math.round(hours)}h`
        return `${apiKey.requestCount}/${apiKey.rateLimitMax} requests`
    }

    // Parse permissions
    const formattedPermissions = useMemo(() => {
        if (!apiKey.permissions || !showPermissions) return null
        
        try {
            const perms = typeof apiKey.permissions === 'string' 
                ? JSON.parse(apiKey.permissions) 
                : apiKey.permissions
            
            // Format as "resource:actions"
            return Object.entries(perms as Record<string, string[]>)
                .map(([resource, actions]) => `${resource}:${(actions as string[]).map(a => a[0]).join('')}`)
                .join(', ')
        } catch {
            return null
        }
    }, [apiKey.permissions, showPermissions])

    // Check if approaching limit
    const isApproachingLimit = useMemo(() => {
        if (!apiKey.remaining) return false
        return apiKey.remaining <= 100 // Warn when < 100 remaining
    }, [apiKey.remaining])

    return (
        <>
            <Card
                className={cn(
                    "flex flex-col gap-3 p-4 transition-colors",
                    !apiKey.enabled && "opacity-60",
                    onClick && "cursor-pointer hover:bg-accent",
                    isSelected && "ring-2 ring-primary",
                    className,
                    classNames?.cell
                )}
                onClick={onClick}
            >
                {/* Header Row */}
                <div className="flex items-start gap-3">
                    <KeyRoundIcon
                        className={cn("size-4 flex-shrink-0 mt-0.5", classNames?.icon)}
                    />

                    <div className="flex flex-col flex-1 truncate min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="truncate font-semibold text-sm">
                                {apiKey.name || "Unnamed Key"}
                            </span>

                            {!apiKey.enabled && (
                                <Badge variant="secondary" className="text-xs">
                                    Disabled
                                </Badge>
                            )}

                            {isApproachingLimit && (
                                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                    <AlertTriangleIcon className="size-3" />
                                    Low
                                </Badge>
                            )}
                        </div>

                        <span className="text-muted-foreground text-xs font-mono">
                            {apiKey.start}{"******"}
                        </span>
                    </div>

                    <div className="ml-auto flex gap-2 flex-shrink-0">
                        <Button
                            className={cn(
                                classNames?.button,
                                classNames?.outlineButton
                            )}
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowEditDialog(true)
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            className={cn(
                                classNames?.button,
                                classNames?.outlineButton
                            )}
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowDeleteDialog(true)
                            }}
                        >
                            {localization.DELETE}
                        </Button>
                    </div>
                </div>

                {/* Usage & Limits Row */}
                {(showUsage || showRateLimit || showRefill) && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {/* Remaining Requests */}
                        {showUsage && apiKey.remaining !== null && apiKey.remaining !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <ActivityIcon className="size-3" />
                                <span>{apiKey.remaining} remaining</span>
                            </div>
                        )}

                        {/* Rate Limit Status */}
                        {showRateLimit && formatRateLimit() && (
                            <div className="flex items-center gap-1.5">
                                <ActivityIcon className="size-3" />
                                <span>{formatRateLimit()}</span>
                            </div>
                        )}

                        {/* Refill Schedule */}
                        {showRefill && formatRefillTime() && (
                            <div className="flex items-center gap-1.5">
                                <RefreshCwIcon className="size-3" />
                                <span>{formatRefillTime()}</span>
                            </div>
                        )}

                        {/* Permissions */}
                        {formattedPermissions && (
                            <div className="flex items-center gap-1.5">
                                <ShieldCheckIcon className="size-3" />
                                <span className="truncate">{formattedPermissions}</span>
                            </div>
                        )}

                        {/* Expiration */}
                        <div className="flex items-center gap-1.5">
                            <span>{formatExpiration()}</span>
                        </div>
                    </div>
                )}

                {/* Usage Progress Bar (if we have remaining count) */}
                {showUsage && apiKey.remaining !== null && apiKey.remaining !== undefined && apiKey.refillAmount && (
                    <div className="space-y-1">
                        <Progress 
                            value={(apiKey.remaining / apiKey.refillAmount) * 100} 
                            className="h-1.5"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {apiKey.remaining} / {apiKey.refillAmount} requests
                        </div>
                    </div>
                )}
            </Card>

            <UpdateApiKeyDialog
                classNames={classNames}
                apiKey={apiKey}
                localization={localization}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                onSuccess={() => setShowEditDialog(false)}
                refetch={refetch}
            />

            <ApiKeyDeleteDialog
                classNames={classNames}
                apiKey={apiKey}
                localization={localization}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                refetch={refetch}
            />
        </>
    )
}
