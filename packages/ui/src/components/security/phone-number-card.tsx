/**
 * phone-number-card
 * Manage phone number in user settings
 * Uses Better Auth phoneNumber plugin
 */

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ShieldCheck } from "lucide-react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { CardContent } from "../ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import { Input } from "../ui/input"
import {
    SettingsCard,
    type SettingsCardClassNames
} from "../settings/shared/settings-card"

export interface PhoneNumberCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: Partial<AuthLocalization>
}

export function PhoneNumberCard({
    className,
    classNames,
    localization
}: PhoneNumberCardProps) {
    const {
        authClient,
        hooks: { useSession },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const { data: sessionData, refetch: refetchSession } = useSession()
    const [showOtpDialog, setShowOtpDialog] = useState(false)
    const [pendingPhoneNumber, setPendingPhoneNumber] = useState("")
    const [resendTimer, setResendTimer] = useState(0)

    localization = { ...contextLocalization, ...localization }

    const phoneFormSchema = z.object({
        phoneNumber: z
            .string()
            .min(1, { message: "Phone number is required" })
            .regex(/^\+[1-9]\d{1,14}$/, {
                message: "Invalid phone number format. Use international format (e.g., +1234567890)"
            })
    })

    const otpFormSchema = z.object({
        code: z
            .string()
            .length(6, { message: "OTP code must be 6 digits" })
            .regex(/^\d{6}$/, { message: "OTP code must contain only numbers" })
    })

    const phoneForm = useForm({
        resolver: zodResolver(phoneFormSchema),
        defaultValues: {
            phoneNumber: sessionData?.user.phoneNumber || ""
        }
    })

    const otpForm = useForm({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            code: ""
        }
    })

    const { isSubmitting } = phoneForm.formState

    // Resend timer countdown
    useState(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    })

    async function sendOtp({ phoneNumber }: z.infer<typeof phoneFormSchema>) {
        try {
            await authClient.phoneNumber.sendOtp({
                phoneNumber,
                fetchOptions: { throw: true }
            })

            setPendingPhoneNumber(phoneNumber)
            setShowOtpDialog(true)
            setResendTimer(60)

            toast({
                variant: "success",
                message: "OTP code sent to your phone"
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    async function verifyOtp({ code }: z.infer<typeof otpFormSchema>) {
        try {
            await authClient.phoneNumber.verify({
                phoneNumber: pendingPhoneNumber,
                code,
                updatePhoneNumber: true,
                fetchOptions: { throw: true }
            })

            await refetchSession()
            setShowOtpDialog(false)
            setPendingPhoneNumber("")
            otpForm.reset()
            phoneForm.reset({ phoneNumber: pendingPhoneNumber })

            toast({
                variant: "success",
                message: "Phone number updated successfully"
            })
        } catch (error: any) {
            otpForm.resetField("code")

            // Handle rate limiting
            if (error?.status === 403) {
                toast({
                    variant: "error",
                    message: "Too many attempts. Please request a new code."
                })
                setShowOtpDialog(false)
                setPendingPhoneNumber("")
                otpForm.reset()
            } else {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error, localization })
                })
            }
        }
    }

    async function resendOtp() {
        if (resendTimer > 0) return

        try {
            await authClient.phoneNumber.sendOtp({
                phoneNumber: pendingPhoneNumber,
                fetchOptions: { throw: true }
            })

            setResendTimer(60)
            otpForm.reset()

            toast({
                variant: "success",
                message: "New OTP code sent"
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    const currentPhoneNumber = sessionData?.user.phoneNumber
    const isVerified = sessionData?.user.phoneNumberVerified

    return (
        <>
            <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(sendOtp)}>
                    <SettingsCard
                        className={className}
                        classNames={classNames}
                        actionLabel="Update Phone"
                        description="Manage your phone number for authentication"
                        isPending={false}
                        title="Phone Number"
                    >
                        <CardContent
                            className={cn("grid gap-6", classNames?.content)}
                        >
                            {currentPhoneNumber && (
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="font-medium">
                                            Current Phone Number
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {currentPhoneNumber}
                                        </div>
                                    </div>
                                    {isVerified && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            <ShieldCheck className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <FormField
                                control={phoneForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={classNames?.label}>
                                            {currentPhoneNumber
                                                ? "New Phone Number"
                                                : "Phone Number"}
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                autoComplete="tel"
                                                className={classNames?.input}
                                                type="tel"
                                                placeholder="+1234567890"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            Enter your phone number in
                                            international format
                                        </FormDescription>

                                        <FormMessage
                                            className={classNames?.error}
                                        />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </SettingsCard>
                </form>
            </Form>

            <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Phone Number</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code sent to{" "}
                            <span className="font-medium">
                                {pendingPhoneNumber}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...otpForm}>
                        <form
                            onSubmit={otpForm.handleSubmit(verifyOtp)}
                            className="grid gap-4"
                        >
                            <FormField
                                control={otpForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP Code</FormLabel>

                                        <FormControl>
                                            <Input
                                                autoComplete="one-time-code"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="\d{6}"
                                                maxLength={6}
                                                placeholder="123456"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex-col gap-2 sm:flex-col">
                                <Button type="submit" className="w-full">
                                    {otpForm.formState.isSubmitting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Verify & Update"
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resendOtp}
                                    disabled={resendTimer > 0}
                                    className="w-full"
                                >
                                    {resendTimer > 0
                                        ? `Resend code in ${resendTimer}s`
                                        : "Resend code"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
