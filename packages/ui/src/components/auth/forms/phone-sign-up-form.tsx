/**
 * phone-sign-up-form
 * Sign up with phone number and OTP verification
 * Uses Better Auth phoneNumber plugin
 */

"use client"

import type { BetterFetchOption } from "@better-fetch/fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useCaptchaStub } from "../../../hooks/use-captcha-stub"
import { useIsHydrated } from "../../../hooks/use-hydrated"
import { useOnSuccessTransition } from "../../../hooks/use-success-transition"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import {
    cn,
    getLocalizedError
} from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import { Button } from "../../ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form"
import { Input } from "../../ui/input"
import type { AuthFormClassNames } from "../auth-form"

export interface PhoneSignUpFormProps {
    className?: string
    classNames?: AuthFormClassNames
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    redirectTo?: string
    setIsSubmitting?: (isSubmitting: boolean) => void
}

export function PhoneSignUpForm({
    className,
    classNames,
    isSubmitting,
    localization,
    redirectTo,
    setIsSubmitting
}: PhoneSignUpFormProps) {
    const isHydrated = useIsHydrated()
    const [step, setStep] = useState<"phone" | "otp">("phone")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [resendTimer, setResendTimer] = useState(0)

    const {
        authClient,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { getCaptchaHeaders, resetCaptcha } = useCaptchaStub()

    const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
        redirectTo
    })

    // Phone number form schema
    const phoneFormSchema = z.object({
        phoneNumber: z
            .string()
            .min(1, {
                message: "Phone number is required"
            })
            .regex(/^\+[1-9]\d{1,14}$/, {
                message: "Invalid phone number format. Use international format (e.g., +1234567890)"
            })
    })

    // OTP verification form schema
    const otpFormSchema = z.object({
        code: z
            .string()
            .length(6, {
                message: "OTP code must be 6 digits"
            })
            .regex(/^\d{6}$/, {
                message: "OTP code must contain only numbers"
            })
    })

    const phoneForm = useForm({
        resolver: zodResolver(phoneFormSchema),
        defaultValues: {
            phoneNumber: ""
        }
    })

    const otpForm = useForm({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            code: ""
        }
    })

    isSubmitting =
        isSubmitting ||
        phoneForm.formState.isSubmitting ||
        otpForm.formState.isSubmitting ||
        transitionPending

    useEffect(() => {
        setIsSubmitting?.(
            phoneForm.formState.isSubmitting ||
                otpForm.formState.isSubmitting ||
                transitionPending
        )
    }, [
        phoneForm.formState.isSubmitting,
        otpForm.formState.isSubmitting,
        transitionPending,
        setIsSubmitting
    ])

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    async function sendOtp({ phoneNumber }: z.infer<typeof phoneFormSchema>) {
        try {
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/phone-number/send-otp")
            }

            await authClient.phoneNumber.sendOtp({
                phoneNumber,
                fetchOptions
            })

            setPhoneNumber(phoneNumber)
            setStep("otp")
            setResendTimer(60)

            toast({
                variant: "success",
                message: "OTP code sent to your phone"
            })
        } catch (error) {
            resetCaptcha()

            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    async function verifyOtp({ code }: z.infer<typeof otpFormSchema>) {
        try {
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/phone-number/verify")
            }

            await authClient.phoneNumber.verify({
                phoneNumber,
                code,
                disableSession: false,
                fetchOptions
            })

            await onSuccess()
        } catch (error: any) {
            otpForm.resetField("code")
            resetCaptcha()

            // Handle rate limiting
            if (error?.status === 403) {
                toast({
                    variant: "error",
                    message: "Too many attempts. Please request a new code."
                })
                setStep("phone")
                setPhoneNumber("")
                phoneForm.reset()
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
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/phone-number/send-otp")
            }

            await authClient.phoneNumber.sendOtp({
                phoneNumber,
                fetchOptions
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

    if (step === "phone") {
        return (
            <Form {...phoneForm}>
                <form
                    onSubmit={phoneForm.handleSubmit(sendOtp)}
                    noValidate={isHydrated}
                    className={cn(
                        "grid w-full gap-6",
                        className,
                        classNames?.base
                    )}
                >
                    <FormField
                        control={phoneForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={classNames?.label}>
                                    Phone Number
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
                                    Enter your phone number in international
                                    format
                                </FormDescription>

                                <FormMessage className={classNames?.error} />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full",
                            classNames?.button,
                            classNames?.primaryButton
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Send OTP Code"
                        )}
                    </Button>
                </form>
            </Form>
        )
    }

    return (
        <Form {...otpForm}>
            <form
                onSubmit={otpForm.handleSubmit(verifyOtp)}
                noValidate={isHydrated}
                className={cn("grid w-full gap-6", className, classNames?.base)}
            >
                <div className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-medium text-foreground">
                        {phoneNumber}
                    </span>
                </div>

                <FormField
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={classNames?.label}>
                                OTP Code
                            </FormLabel>

                            <FormControl>
                                <Input
                                    autoComplete="one-time-code"
                                    className={classNames?.input}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{6}"
                                    maxLength={6}
                                    placeholder="123456"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className={classNames?.error} />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full",
                            classNames?.button,
                            classNames?.primaryButton
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Verify & Sign Up"
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={resendOtp}
                        disabled={isSubmitting || resendTimer > 0}
                        className="w-full"
                    >
                        {resendTimer > 0
                            ? `Resend code in ${resendTimer}s`
                            : "Resend code"}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setStep("phone")
                            setPhoneNumber("")
                            otpForm.reset()
                        }}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        Change phone number
                    </Button>
                </div>
            </form>
        </Form>
    )
}
