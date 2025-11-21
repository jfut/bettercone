/**
 * update-api-key-dialog
 * Dialog for editing API key names (client-only field)
 * Enhanced for @bettercone/ui
 */

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { type ComponentProps, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn, getLocalizedError } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import type { ApiKey } from "@/types/api-key"
import type { Refetch } from "@/types/refetch"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { SettingsCardClassNames } from "@/components/settings/shared/settings-card"

interface UpdateApiKeyDialogProps extends ComponentProps<typeof Dialog> {
    classNames?: SettingsCardClassNames
    localization?: AuthLocalization
    apiKey: ApiKey | null
    onSuccess?: () => void
    refetch?: Refetch
}

export function UpdateApiKeyDialog({
    classNames,
    localization,
    apiKey,
    onSuccess,
    refetch,
    onOpenChange,
    ...props
}: UpdateApiKeyDialogProps) {
    const {
        authClient,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const formSchema = z.object({
        name: z.string().min(1, `${localization.NAME} ${localization.IS_REQUIRED}`),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    // Update form when apiKey changes
    useEffect(() => {
        if (apiKey) {
            form.reset({
                name: apiKey.name || "",
            })
        }
    }, [apiKey, form])

    const { isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!apiKey) return

        try {
            // Client can only update name (server-only fields like enabled, remaining, refills, rate limits cannot be updated from client)
            await authClient.apiKey.update({
                keyId: apiKey.id,
                name: values.name,
                fetchOptions: { throw: true }
            })

            await refetch?.()
            onSuccess?.()
            onOpenChange?.(false)
            
            toast({
                variant: "success",
                message: "API key updated successfully"
            })
        } catch (error: any) {
            toast({
                variant: "error",
                message: error?.body?.message || error?.message || getLocalizedError({ error, localization })
            })
        }
    }

    if (!apiKey) return null

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={classNames?.dialog?.content}
            >
                <DialogHeader className={classNames?.dialog?.header}>
                    <DialogTitle
                        className={cn("text-lg md:text-xl", classNames?.title)}
                    >
                        Edit API Key
                    </DialogTitle>

                    <DialogDescription
                        className={cn(
                            "text-xs md:text-sm",
                            classNames?.description
                        )}
                    >
                        Update the name for <span className="font-mono">{apiKey.name}</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={classNames?.label}>
                                        {localization.NAME}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className={classNames?.input}
                                            placeholder="API Key Name"
                                            autoFocus
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className={classNames?.dialog?.footer}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                                className={cn(
                                    classNames?.button,
                                    classNames?.outlineButton
                                )}
                                disabled={isSubmitting}
                            >
                                {localization.CANCEL}
                            </Button>

                            <Button
                                type="submit"
                                variant="default"
                                className={cn(
                                    classNames?.button,
                                    classNames?.primaryButton
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <Loader2 className="animate-spin" />
                                )}

                                {localization.SAVE || "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
