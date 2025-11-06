/**
 * link-account-card
 * Link OAuth providers to existing account
 * Enhanced for @bettercone/ui
 */

"use client"

import { Loader2, Link2 } from "lucide-react"
import { useContext, useState } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import { Button } from "../ui/button"
import { CardContent } from "../ui/card"
import type { SettingsCardProps } from "../settings/shared/settings-card"
import { SettingsCard } from "../settings/shared/settings-card"

export interface LinkAccountCardProps extends Omit<SettingsCardProps, 'action'> {
    providers?: Array<{
        id: string
        name: string
    }>
    callbackURL?: string
    onLinkStart?: (providerId: string) => void
}

export function LinkAccountCard({
    className,
    classNames,
    localization: localizationProp,
    providers = [],
    callbackURL,
    onLinkStart
}: LinkAccountCardProps) {
    const {
        authClient,
        hooks: { useListAccounts },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp } as any

    const { data: accounts, isPending } = useListAccounts()
    const [linkingProvider, setLinkingProvider] = useState<string | null>(null)

    const linkedProviderIds = new Set(
        (accounts || []).map((account: any) => account.providerId)
    )

    const availableProviders = providers.filter(
        provider => !linkedProviderIds.has(provider.id)
    )

    const handleLinkProvider = (providerId: string) => {
        setLinkingProvider(providerId)
        onLinkStart?.(providerId)

        // Redirect to OAuth link flow
        // The OAuth flow will redirect back to callbackURL after completion
        const linkURL = `${window.location.origin}/api/auth/oauth2/link/${providerId}?callbackURL=${encodeURIComponent(callbackURL || window.location.pathname)}`
        window.location.href = linkURL
    }

    return (
        <SettingsCard
            className={className}
            classNames={classNames}
            title={localization.LINK_ACCOUNT || "Link Account"}
            description={localization.LINK_ACCOUNT_DESCRIPTION || "Connect additional OAuth providers to your account"}
            isPending={isPending}
        >
            <CardContent className={cn("grid gap-3", classNames?.content)}>
                {availableProviders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        {localization.ALL_PROVIDERS_LINKED || 
                            "All available providers are already linked to your account."}
                    </p>
                ) : (
                    availableProviders.map((provider) => (
                        <Button
                            key={provider.id}
                            variant="outline"
                            onClick={() => handleLinkProvider(provider.id)}
                            disabled={linkingProvider !== null}
                            className={cn(
                                "w-full justify-start",
                                linkingProvider === provider.id && "opacity-70"
                            )}
                        >
                            {linkingProvider === provider.id ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {localization.LINKING || "Linking..."}
                                </>
                            ) : (
                                <>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    {localization.LINK_WITH || "Link with"} {provider.name}
                                </>
                            )}
                        </Button>
                    ))
                )}
            </CardContent>
        </SettingsCard>
    )
}
