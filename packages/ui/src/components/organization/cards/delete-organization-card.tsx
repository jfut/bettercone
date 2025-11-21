/**
 * delete-organization-card
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import type { Organization } from "better-auth/plugins/organization"
import { useContext, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"

import { useCurrentOrganization } from "../../../hooks/use-current-organization"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import type { SettingsCardProps } from "../../settings/shared/settings-card"
import { SettingsCard } from "../../settings/shared/settings-card"
import { DeleteOrganizationDialog } from "../dialogs/delete-organization-dialog"

export interface OrganizationCardProps
    extends SettingsCardProps {
    organization?: Organization
    slug?: string
}

export function DeleteOrganizationCard({
    className,
    classNames,
    localization: localizationProp,
    slug,
    size = "default",
    icon,
    ...props
}: OrganizationCardProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const { data: organization } = useCurrentOrganization({ slug })

    if (!organization)
        return (
            <SettingsCard
                className={className}
                classNames={classNames}
                actionLabel={localization?.DELETE_ORGANIZATION}
                description={localization?.DELETE_ORGANIZATION_DESCRIPTION}
                isPending
                title={localization?.DELETE_ORGANIZATION}
                variant="destructive"
                size={size}
                icon={icon}
            />
        )

    return (
        <DeleteOrganizationForm
            className={className}
            classNames={classNames}
            localization={localization}
            organization={organization}
            size={size}
            icon={icon}
            {...props}
        />
    )
}

function DeleteOrganizationForm({
    className,
    classNames,
    localization: localizationProp,
    organization,
    size = "default",
    icon
}: SettingsCardProps & { organization: Organization; size?: "default" | "compact" | "button-only"; icon?: LucideIcon }) {
    const {
        localization: contextLocalization,
        hooks: { useHasPermission }
    } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const { data: hasPermission, isPending } = useHasPermission({
        organizationId: organization.id,
        permissions: {
            organization: ["delete"]
        }
    })

    const [showDialog, setShowDialog] = useState(false)

    if (!hasPermission?.success) return null

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization?.DELETE_ORGANIZATION}
                actionLabel={localization?.DELETE_ORGANIZATION}
                description={size === "default" ? localization?.DELETE_ORGANIZATION_DESCRIPTION : undefined}
                isPending={isPending}
                variant="destructive"
                size={size}
                icon={icon}
                action={() => setShowDialog(true)}
            />

            <DeleteOrganizationDialog
                classNames={classNames}
                localization={localization}
                open={showDialog}
                onOpenChange={setShowDialog}
                organization={organization}
            />
        </>
    )
}
