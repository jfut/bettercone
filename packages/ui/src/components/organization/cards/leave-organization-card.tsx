/**
 * leave-organization-card
 * Card wrapper for LeaveOrganizationDialog
 */

"use client"

import type { Organization } from "better-auth/plugins/organization"
import { useContext, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import type { SettingsCardProps } from "../../settings/shared/settings-card"
import { SettingsCard } from "../../settings/shared/settings-card"
import { LeaveOrganizationDialog } from "../dialogs/leave-organization-dialog"

export interface OrganizationCardProps
    extends SettingsCardProps {
    organization: Organization
}

export function LeaveOrganizationCard({
    className,
    classNames,
    localization: localizationProp,
    organization,
    size = "default",
    icon,
    ...props
}: OrganizationCardProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const [showDialog, setShowDialog] = useState(false)

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization?.LEAVE_ORGANIZATION}
                description={size === "default" ? localization?.LEAVE_ORGANIZATION_CONFIRM : undefined}
                actionLabel={localization?.LEAVE_ORGANIZATION}
                variant="destructive"
                size={size}
                icon={icon}
                action={() => setShowDialog(true)}
                {...props}
            />

            <LeaveOrganizationDialog
                classNames={classNames}
                localization={localization}
                open={showDialog}
                onOpenChange={setShowDialog}
                organization={organization}
            />
        </>
    )
}