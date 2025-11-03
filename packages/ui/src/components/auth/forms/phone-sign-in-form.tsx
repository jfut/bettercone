/**
 * phone-sign-in-form
 * Sign in with phone number and password
 * Uses Better Auth phoneNumber plugin
 */

"use client"

import type { BetterFetchOption } from "@better-fetch/fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useCaptchaStub } from "../../../hooks/use-captcha-stub"
import { useIsHydrated } from "../../../hooks/use-hydrated"
import { useOnSuccessTransition } from "../../../hooks/use-success-transition"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import {
    cn,
    getLocalizedError,
    getPasswordSchema
} from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import type { PasswordValidation } from "../../../types/password-validation"
import { PasswordInput } from "../../utility/password-input"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form"
import { Input } from "../../ui/input"
import type { AuthFormClassNames } from "../auth-form"

export interface PhoneSignInFormProps {
    className?: string
    classNames?: AuthFormClassNames
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    redirectTo?: string
    setIsSubmitting?: (isSubmitting: boolean) => void
    passwordValidation?: PasswordValidation
}

export function PhoneSignInForm({
    className,
    classNames,
    isSubmitting,
    localization,
    redirectTo,
    setIsSubmitting,
    passwordValidation
}: PhoneSignInFormProps) {
    const isHydrated = useIsHydrated()

    const {
        authClient,
        credentials,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const rememberMeEnabled = credentials?.rememberMe
    const contextPasswordValidation = credentials?.passwordValidation

    localization = { ...contextLocalization, ...localization }
    passwordValidation = { ...contextPasswordValidation, ...passwordValidation }

    const { getCaptchaHeaders, resetCaptcha } = useCaptchaStub()

    const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
        redirectTo
    })

    const formSchema = z.object({
        phoneNumber: z
            .string()
            .min(1, {
                message: "Phone number is required"
            })
            .regex(/^\+[1-9]\d{1,14}$/, {
                message: "Invalid phone number format. Use international format (e.g., +1234567890)"
            }),
        password: getPasswordSchema(passwordValidation, localization),
        rememberMe: z.boolean().optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber: "",
            password: "",
            rememberMe: !rememberMeEnabled
        }
    })

    isSubmitting =
        isSubmitting || form.formState.isSubmitting || transitionPending

    useEffect(() => {
        setIsSubmitting?.(form.formState.isSubmitting || transitionPending)
    }, [form.formState.isSubmitting, transitionPending, setIsSubmitting])

    async function signIn({
        phoneNumber,
        password,
        rememberMe
    }: z.infer<typeof formSchema>) {
        try {
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/sign-in/phone-number")
            }

            await authClient.signIn.phoneNumber({
                phoneNumber,
                password,
                rememberMe,
                fetchOptions
            })

            await onSuccess()
        } catch (error) {
            form.resetField("password")
            resetCaptcha()

            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(signIn)}
                noValidate={isHydrated}
                className={cn("grid w-full gap-6", className, classNames?.base)}
            >
                <FormField
                    control={form.control}
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

                            <FormMessage className={classNames?.error} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={classNames?.label}>
                                {localization.PASSWORD}
                            </FormLabel>

                            <FormControl>
                                <PasswordInput
                                    autoComplete="current-password"
                                    className={classNames?.input}
                                    placeholder={
                                        localization.PASSWORD_PLACEHOLDER
                                    }
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className={classNames?.error} />
                        </FormItem>
                    )}
                />

                {rememberMeEnabled && (
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>

                                <FormLabel>
                                    {localization.REMEMBER_ME}
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                )}

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
                        localization.SIGN_IN_ACTION
                    )}
                </Button>
            </form>
        </Form>
    )
}
