/**
 * api-key-usage-card
 * Detailed usage view for Better Auth API Key with remaining count, refills, rate limits
 * Shows progress bars, countdowns, and usage trends
 */

"use client"

import { useContext, useMemo } from "react"
import { 
    ActivityIcon, 
    RefreshCwIcon, 
    TrendingUpIcon, 
    TrendingDownIcon,
    AlertTriangleIcon,
    CheckCircleIcon 
} from "lucide-react"

import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import type { ApiKey } from "@/types/api-key"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export interface ApiKeyUsageCardClassNames {
    base?: string
    header?: string
    title?: string
    description?: string
    content?: string
    icon?: string
    badge?: string
    progress?: string
    stat?: string
}

export interface ApiKeyUsageCardProps {
    /** API Key object with usage data */
    apiKey: ApiKey
    
    /** Optional CSS class name */
    className?: string
    
    /** CSS class names for specific parts */
    classNames?: ApiKeyUsageCardClassNames
    
    /** Localization strings */
    localization?: Partial<AuthLocalization>
    
    /** Warning threshold percentage (default: 80) */
    warningThreshold?: number
}

export function ApiKeyUsageCard({
    apiKey,
    className,
    classNames,
    localization,
    warningThreshold = 80
}: ApiKeyUsageCardProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)
    localization = { ...contextLocalization, ...localization }

    // Calculate usage percentage (if we have refillAmount as the "total")
    const usageData = useMemo(() => {
        if (apiKey.remaining === null || apiKey.remaining === undefined) {
            return null
        }

        const total = apiKey.refillAmount || apiKey.remaining
        const used = total - apiKey.remaining
        const percentage = (apiKey.remaining / total) * 100

        return {
            remaining: apiKey.remaining,
            used,
            total,
            percentage,
            isLow: percentage < (100 - warningThreshold)
        }
    }, [apiKey.remaining, apiKey.refillAmount, warningThreshold])

    // Calculate refill countdown
    const refillData = useMemo(() => {
        if (!apiKey.refillInterval || !apiKey.lastRefillAt) return null

        const lastRefill = new Date(apiKey.lastRefillAt)
        const nextRefill = new Date(lastRefill.getTime() + apiKey.refillInterval)
        const now = new Date()

        if (nextRefill <= now) {
            return {
                status: "refilling",
                text: "Refilling now...",
                percentage: 100
            }
        }

        const total = apiKey.refillInterval
        const elapsed = now.getTime() - lastRefill.getTime()
        const percentage = (elapsed / total) * 100

        const remaining = nextRefill.getTime() - now.getTime()
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

        let text = "Refills in "
        if (days > 0) text += `${days}d ${hours}h`
        else if (hours > 0) text += `${hours}h ${minutes}m`
        else text += `${minutes}m`

        return {
            status: "waiting",
            text,
            percentage,
            nextRefill
        }
    }, [apiKey.refillInterval, apiKey.lastRefillAt])

    // Calculate rate limit status
    const rateLimitData = useMemo(() => {
        if (!apiKey.rateLimitEnabled || !apiKey.rateLimitMax || !apiKey.rateLimitTimeWindow) {
            return null
        }

        const percentage = (apiKey.requestCount / apiKey.rateLimitMax) * 100
        const remaining = apiKey.rateLimitMax - apiKey.requestCount

        const hours = apiKey.rateLimitTimeWindow / (1000 * 60 * 60)
        const days = hours / 24

        let window = ""
        if (days >= 1) window = `${Math.round(days)} day${days > 1 ? 's' : ''}`
        else if (hours >= 1) window = `${Math.round(hours)} hour${hours > 1 ? 's' : ''}`
        else window = "window"

        return {
            current: apiKey.requestCount,
            max: apiKey.rateLimitMax,
            remaining,
            percentage,
            window,
            isHigh: percentage > warningThreshold
        }
    }, [apiKey.rateLimitEnabled, apiKey.rateLimitMax, apiKey.rateLimitTimeWindow, apiKey.requestCount, warningThreshold])

    if (!usageData && !refillData && !rateLimitData) {
        return (
            <Card className={cn(className, classNames?.base)}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={cn("flex items-center gap-2", classNames?.title)}>
                        <ActivityIcon className={cn("size-5", classNames?.icon)} />
                        API Key Usage
                    </CardTitle>
                    <CardDescription className={classNames?.description}>
                        No usage tracking configured for this key
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className={cn(className, classNames?.base)}>
            <CardHeader className={classNames?.header}>
                <CardTitle className={cn("flex items-center gap-2", classNames?.title)}>
                    <ActivityIcon className={cn("size-5", classNames?.icon)} />
                    API Key Usage
                </CardTitle>
                <CardDescription className={classNames?.description}>
                    {apiKey.name || "Unnamed Key"}
                </CardDescription>
            </CardHeader>

            <CardContent className={cn("space-y-6", classNames?.content)}>
                {/* Usage Status */}
                {usageData && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Requests Remaining</span>
                                {usageData.isLow && (
                                    <Badge variant="destructive" className={cn("text-xs", classNames?.badge)}>
                                        <AlertTriangleIcon className="size-3 mr-1" />
                                        Low
                                    </Badge>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {usageData.remaining} / {usageData.total}
                            </span>
                        </div>
                        
                        <Progress 
                            value={usageData.percentage} 
                            className={cn("h-2", classNames?.progress)}
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{usageData.used} used</span>
                            <span>{Math.round(usageData.percentage)}% available</span>
                        </div>
                    </div>
                )}

                {/* Rate Limit Status */}
                {rateLimitData && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Rate Limit</span>
                                {rateLimitData.isHigh && (
                                    <Badge variant="outline" className={cn("text-xs", classNames?.badge)}>
                                        <TrendingUpIcon className="size-3 mr-1" />
                                        High
                                    </Badge>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {rateLimitData.current} / {rateLimitData.max}
                            </span>
                        </div>
                        
                        <Progress 
                            value={rateLimitData.percentage} 
                            className={cn("h-2", classNames?.progress)}
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{rateLimitData.remaining} remaining</span>
                            <span>per {rateLimitData.window}</span>
                        </div>
                    </div>
                )}

                {/* Refill Schedule */}
                {refillData && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RefreshCwIcon className={cn("size-4", classNames?.icon)} />
                                <span className="text-sm font-medium">Auto-Refill</span>
                                {refillData.status === "refilling" && (
                                    <Badge variant="default" className={cn("text-xs", classNames?.badge)}>
                                        <CheckCircleIcon className="size-3 mr-1" />
                                        Active
                                    </Badge>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                            {refillData.text}
                        </div>

                        {apiKey.refillAmount && (
                            <div className="text-xs text-muted-foreground">
                                Refills to {apiKey.refillAmount} requests
                            </div>
                        )}
                    </div>
                )}

                {/* Last Request */}
                {apiKey.lastRequest && (
                    <div className="pt-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Last used {new Date(apiKey.lastRequest).toLocaleString()}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function ApiKeyUsageCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
