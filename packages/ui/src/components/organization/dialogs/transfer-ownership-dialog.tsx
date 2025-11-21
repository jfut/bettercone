/**
 * transfer-ownership-dialog
 * Transfer organization ownership to another member
 * Enhanced for @bettercone/ui
 */

"use client"

import { Loader2, UserCog } from "lucide-react"
import { useContext, useState } from "react"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../ui/dialog"
import { Label } from "../../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../ui/select"

export interface TransferOwnershipDialogProps {
    className?: string
    classNames?: {
        trigger?: string
        dialog?: string
        header?: string
        title?: string
        description?: string
        content?: string
        footer?: string
        label?: string
        select?: string
        button?: string
    }
    organizationId?: string
    onSuccess?: (newOwnerId: string) => void
    onCancel?: () => void
    children?: React.ReactNode
}

export function TransferOwnershipDialog({
    className,
    classNames,
    organizationId: orgIdProp,
    onSuccess,
    onCancel,
    children
}: TransferOwnershipDialogProps) {
    const {
        authClient,
        hooks: { useActiveOrganization, useSession },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = contextLocalization as any

    const { data: activeOrg } = useActiveOrganization()
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const [selectedMemberId, setSelectedMemberId] = useState<string>("")
    const [isTransferring, setIsTransferring] = useState(false)
    const [members, setMembers] = useState<any[]>([])
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)

    const organizationId = orgIdProp || activeOrg?.id

    // Load members when dialog opens
    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen)
        
        if (isOpen && organizationId) {
            setIsLoadingMembers(true)
            try {
                const { data, error } = await authClient.organization.listMembers({
                    organizationId
                })

                if (error) {
                    toast({
                        variant: "error",
                        message: getLocalizedError({ error, localization })
                    })
                    return
                }

                // Filter out current user and non-admin members
                const eligibleMembers = (data || []).filter(
                    (member: any) => 
                        member.userId !== session?.user?.id &&
                        (member.role === "admin" || member.role === "owner")
                )
                
                setMembers(eligibleMembers)
            } catch (err) {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error: err, localization })
                })
            } finally {
                setIsLoadingMembers(false)
            }
        } else {
            setSelectedMemberId("")
            setMembers([])
        }
    }

    const handleTransfer = async () => {
        if (!selectedMemberId || !organizationId) return

        setIsTransferring(true)

        try {
            // Update the selected member's role to owner
            const { error: updateError } = await authClient.organization.updateMemberRole({
                memberId: selectedMemberId,
                role: "owner",
                organizationId
            })

            if (updateError) {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error: updateError, localization })
                })
                setIsTransferring(false)
                return
            }

            // Update current owner's role to admin
            const currentMember = members.find(m => m.userId === session?.user?.id)
            if (currentMember) {
                await authClient.organization.updateMemberRole({
                    memberId: currentMember.id,
                    role: "admin",
                    organizationId
                })
            }

            toast({
                variant: "success",
                message: localization.OWNERSHIP_TRANSFERRED || "Ownership transferred successfully"
            })

            onSuccess?.(selectedMemberId)
            setOpen(false)
        } catch (err) {
            toast({
                variant: "error",
                message: getLocalizedError({ error: err, localization })
            })
        } finally {
            setIsTransferring(false)
        }
    }

    const handleCancel = () => {
        setOpen(false)
        onCancel?.()
    }

    if (!organizationId) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild className={classNames?.trigger}>
                {children || (
                    <Button variant="outline" className={className}>
                        <UserCog className="mr-2 h-4 w-4" />
                        {localization.TRANSFER_OWNERSHIP || "Transfer Ownership"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className={cn("sm:max-w-[425px]", classNames?.dialog)}>
                <DialogHeader className={classNames?.header}>
                    <DialogTitle className={classNames?.title}>
                        {localization.TRANSFER_OWNERSHIP || "Transfer Ownership"}
                    </DialogTitle>
                    <DialogDescription className={classNames?.description}>
                        {localization.TRANSFER_OWNERSHIP_DESCRIPTION || 
                            "Transfer organization ownership to another admin. You will become an admin after the transfer."}
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("grid gap-4 py-4", classNames?.content)}>
                    <div className="grid gap-2">
                        <Label htmlFor="new-owner" className={classNames?.label}>
                            {localization.NEW_OWNER || "New Owner"}
                        </Label>
                        {isLoadingMembers ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : members.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                                {localization.NO_ELIGIBLE_MEMBERS || 
                                    "No eligible members found. Only admins can receive ownership."}
                            </p>
                        ) : (
                            <Select
                                value={selectedMemberId}
                                onValueChange={setSelectedMemberId}
                                disabled={isTransferring}
                            >
                                <SelectTrigger id="new-owner" className={classNames?.select}>
                                    <SelectValue 
                                        placeholder={localization.SELECT_MEMBER || "Select a member"} 
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {member.user.name || member.user.email}
                                                </span>
                                                {member.user.name && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {member.user.email}
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {selectedMemberId && (
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">
                                    {localization.WARNING || "Warning"}:
                                </strong>{" "}
                                {localization.TRANSFER_OWNERSHIP_WARNING || 
                                    "This action will transfer full ownership to the selected member. You will lose owner privileges and become an admin."}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className={classNames?.footer}>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isTransferring}
                        className={classNames?.button}
                    >
                        {localization.CANCEL || "Cancel"}
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        disabled={!selectedMemberId || isTransferring || members.length === 0}
                        className={classNames?.button}
                    >
                        {isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isTransferring
                            ? localization.TRANSFERRING || "Transferring..."
                            : localization.TRANSFER_OWNERSHIP || "Transfer Ownership"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
