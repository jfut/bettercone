/**
 * unlink-account-card
 * Unlink OAuth providers from account
 * Enhanced for @bettercone/ui
 */

"use client"

import { Loader2, Unlink } from "lucide-react"
import { useContext, useState } from "react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn, getLocalizedError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import type { SettingsCardProps } from "@/components/settings/shared/settings-card"
import { SettingsCard } from "@/components/settings/shared/settings-card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"

export interface UnlinkAccountCardProps extends Omit<SettingsCardProps, 'action'> {
    onUnlinkSuccess?: (providerId: string) => void
    onUnlinkError?: (providerId: string, error: any) => void
    minimumLinkedAccounts?: number
}

export function UnlinkAccountCard({
    className,
    classNames,
    localization: localizationProp,
    onUnlinkSuccess,
    onUnlinkError,
    minimumLinkedAccounts = 1
}: UnlinkAccountCardProps) {
    const {
        authClient,
        mutators,
        hooks: { useListAccounts },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp } as any

    const { data: accounts, isPending, refetch } = useListAccounts()
    const [unlinkingAccountId, setUnlinkingAccountId] = useState<string | null>(null)
    const [confirmUnlink, setConfirmUnlink] = useState<{ id: string; name: string } | null>(null)

    const handleUnlinkAccount = async (accountId: string, providerId: string) => {
        setUnlinkingAccountId(accountId)
        setConfirmUnlink(null)

        try {
            if (mutators?.unlinkAccount) {
                await mutators.unlinkAccount({ accountId })
            }

            toast({
                variant: "success",
                message: localization.ACCOUNT_UNLINKED || "Account unlinked successfully"
            })

            if (refetch) {
                await refetch()
            }
            onUnlinkSuccess?.(providerId)
        } catch (err) {
            toast({
                variant: "error",
                message: getLocalizedError({ error: err, localization })
            })
            onUnlinkError?.(providerId, err)
        } finally {
            setUnlinkingAccountId(null)
        }
    }

    const canUnlink = (accounts || []).length > minimumLinkedAccounts

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization.UNLINK_ACCOUNT || "Unlink Account"}
                description={localization.UNLINK_ACCOUNT_DESCRIPTION || "Remove OAuth providers from your account"}
                isPending={isPending}
            >
                <CardContent className={cn("grid gap-3", classNames?.content)}>
                    {!accounts || accounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">
                            {localization.NO_LINKED_ACCOUNTS || 
                                "No linked accounts found."}
                        </p>
                    ) : (
                        accounts.map((account: any) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium">
                                        {account.providerId}
                                    </p>
                                    {account.email && (
                                        <p className="text-xs text-muted-foreground">
                                            {account.email}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConfirmUnlink({ id: account.id, name: account.providerId })}
                                    disabled={!canUnlink || unlinkingAccountId === account.id}
                                >
                                    {unlinkingAccountId === account.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {localization.UNLINKING || "Unlinking..."}
                                        </>
                                    ) : (
                                        <>
                                            <Unlink className="mr-2 h-4 w-4" />
                                            {localization.UNLINK || "Unlink"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))
                    )}
                    {!canUnlink && accounts && accounts.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {localization.MINIMUM_ACCOUNTS_WARNING || 
                                "You must keep at least one account linked."}
                        </p>
                    )}
                </CardContent>
            </SettingsCard>

            <AlertDialog open={confirmUnlink !== null} onOpenChange={(open) => !open && setConfirmUnlink(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {localization.CONFIRM_UNLINK || "Confirm Unlink"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {localization.CONFIRM_UNLINK_DESCRIPTION || 
                                `Are you sure you want to unlink ${confirmUnlink?.name}? You won't be able to sign in with this provider anymore.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {localization.CANCEL || "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmUnlink && handleUnlinkAccount(confirmUnlink.id, confirmUnlink.name)}
                        >
                            {localization.UNLINK || "Unlink"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
