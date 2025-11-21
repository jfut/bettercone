/**
 * create-organization-card
 * Card wrapper for CreateOrganizationDialog
 */

"use client"

import { useContext, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import type { SettingsCardProps } from "../../settings/shared/settings-card"
import { SettingsCard } from "../../settings/shared/settings-card"
import { CreateOrganizationDialog } from "../dialogs/create-organization-dialog"

export interface OrganizationCardProps
    extends SettingsCardProps {
}

export function CreateOrganizationCard({
    className,
    classNames,
    localization: localizationProp,
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
                title={localization?.CREATE_ORGANIZATION}
                description={size === "default" ? localization?.ORGANIZATIONS_DESCRIPTION : undefined}
                instructions={size === "default" ? localization?.ORGANIZATIONS_INSTRUCTIONS : undefined}
                actionLabel={localization?.CREATE_ORGANIZATION}
                variant="default"
                size={size}
                icon={icon}
                action={() => setShowDialog(true)}
                {...props}
            />

            <CreateOrganizationDialog
                classNames={classNames}
                localization={localization}
                open={showDialog}
                onOpenChange={setShowDialog}
            />
        </>
    )
}