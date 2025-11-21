/**
 * sessions-card
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"
import { useContext } from "react"

import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import { CardContent } from "@/components/ui/card"
import type { SettingsCardClassNames } from "@/components/settings/shared/settings-card"
import { SettingsCard } from "@/components/settings/shared/settings-card"
import { SettingsCellSkeleton } from "@/components/settings/skeletons/settings-cell-skeleton"
import { SessionCell } from "@/components/security/cells/session-cell"

export interface SessionsCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: Partial<AuthLocalization>
}

export function SessionsCard({
    className,
    classNames,
    localization
}: SessionsCardProps) {
    const {
        hooks: { useListSessions },
        localization: contextLocalization
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { data: sessions, isPending, refetch } = useListSessions()

    return (
        <SettingsCard
            className={className}
            classNames={classNames}
            description={localization.SESSIONS_DESCRIPTION}
            isPending={isPending}
            title={localization.SESSIONS}
        >
            <CardContent className={cn("grid gap-4", classNames?.content)}>
                {isPending ? (
                    <SettingsCellSkeleton classNames={classNames} />
                ) : (
                    sessions?.map((session) => (
                        <SessionCell
                            key={session.id}
                            classNames={classNames}
                            localization={localization}
                            session={session}
                            refetch={refetch}
                        />
                    ))
                )}
            </CardContent>
        </SettingsCard>
    )
}
