/**
 * settings-card
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import type { ComponentProps, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import type { UserAvatarClassNames } from "../../user"
import { SettingsCardFooter } from "./settings-card-footer"
import { SettingsCardHeader } from "./settings-card-header"

export type SettingsCardClassNames = {
    base?: string
    avatar?: UserAvatarClassNames
    button?: string
    cell?: string
    checkbox?: string
    destructiveButton?: string
    content?: string
    description?: string
    dialog?: {
        content?: string
        footer?: string
        header?: string
    }
    error?: string
    footer?: string
    header?: string
    icon?: string
    input?: string
    instructions?: string
    label?: string
    primaryButton?: string
    secondaryButton?: string
    outlineButton?: string
    skeleton?: string
    title?: string
}

export interface SettingsCardProps
    extends Omit<ComponentProps<typeof Card>, "title"> {
    children?: ReactNode
    className?: string
    classNames?: SettingsCardClassNames
    title?: ReactNode
    description?: ReactNode
    instructions?: ReactNode
    actionLabel?: ReactNode
    isSubmitting?: boolean
    disabled?: boolean
    isPending?: boolean
    optimistic?: boolean
    variant?: "default" | "destructive"
    size?: "default" | "compact" | "button-only"
    icon?: LucideIcon
    localization?: AuthLocalization
    action?: () => Promise<unknown> | unknown
}

export function SettingsCard({
    children,
    className,
    classNames,
    title,
    description,
    instructions,
    actionLabel,
    disabled,
    isPending,
    isSubmitting,
    optimistic,
    variant,
    size = "default",
    icon: IconComponent,
    action,
    ...props
}: SettingsCardProps) {
    // Button-only variant - render just the action button with optional icon
    if (size === "button-only") {
        return (
            <Button
                className={cn(
                    classNames?.button,
                    variant === "destructive" && classNames?.destructiveButton
                )}
                variant={variant === "destructive" ? "destructive" : "default"}
                disabled={disabled || isPending || isSubmitting}
                onClick={action}
            >
                {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                {actionLabel}
            </Button>
        )
    }

    // Compact variant - minimal horizontal layout with icon, title, and action button
    if (size === "compact") {
        const hasChildren = Boolean(children);
        const hasAction = Boolean(action) && Boolean(actionLabel);

        return (
            <Card
                className={cn(
                    "w-full",
                    variant === "destructive" && "border-destructive/40 bg-destructive/5",
                    className,
                    classNames?.base
                )}
                {...props}
            >
                <div className="p-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left side: Icon and Title */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {IconComponent && (
                                <div className={cn(
                                    "flex-shrink-0",
                                    variant === "destructive" ? "text-destructive" : "text-muted-foreground",
                                    classNames?.icon
                                )}>
                                    <IconComponent className="h-4 w-4" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                {isPending ? (
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                ) : (
                                    <h3 className={cn(
                                        "text-sm font-medium",
                                        variant === "destructive" ? "text-destructive" : "text-foreground",
                                        classNames?.title
                                    )}>
                                        {title}
                                    </h3>
                                )}
                            </div>
                        </div>

                        {/* Right side: Children OR Action Button */}
                        {hasChildren ? (
                            <div className="flex-shrink-0">
                                {children}
                            </div>
                        ) : hasAction ? (
                            <div className="flex-shrink-0">
                                <Button
                                    className={cn(
                                        "text-sm h-8 px-3",
                                        variant === "destructive" && classNames?.destructiveButton,
                                        classNames?.button
                                    )}
                                    variant={variant === "destructive" ? "destructive" : "outline"}
                                    disabled={disabled || isPending || isSubmitting}
                                    onClick={action}
                                >
                                    {actionLabel}
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Card>
        )
    }

    // Default variant - full card with all features
    return (
        <Card
            className={cn(
                "w-full pb-0 text-start",
                variant === "destructive" && "border-destructive/40",
                className,
                classNames?.base
            )}
            {...props}
        >
            <SettingsCardHeader
                classNames={classNames}
                description={description}
                isPending={isPending}
                title={title}
            />

            {children}

            <SettingsCardFooter
                classNames={classNames}
                actionLabel={actionLabel}
                disabled={disabled}
                isPending={isPending}
                isSubmitting={isSubmitting}
                instructions={instructions}
                optimistic={optimistic}
                variant={variant}
                action={action}
            />
        </Card>
    )
}
