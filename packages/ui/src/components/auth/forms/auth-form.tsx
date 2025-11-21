/**
 * auth-form
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import { useContext, useEffect } from "react"

import { AuthUIContext } from "@/lib/auth-ui-provider"
import { getViewByPath } from "@/lib/utils"
import type { AuthViewPath } from "@/lib/view-paths"
import type { AuthLocalization } from "@/localization/auth-localization"
import { AuthCallback } from "@/components/auth/components/auth-callback"
import { EmailOTPForm } from "./email-otp-form"
import { ForgotPasswordForm } from "./forgot-password-form"
import { MagicLinkForm } from "./magic-link-form"
import { PhoneSignInForm } from "./phone-sign-in-form"
import { PhoneSignUpForm } from "./phone-sign-up-form"
import { RecoverAccountForm } from "./recover-account-form"
import { ResetPasswordForm } from "./reset-password-form"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { TwoFactorForm } from "./two-factor-form"
import { SignOut } from "@/components/auth/components/sign-out"

export type AuthFormClassNames = {
    base?: string
    button?: string
    checkbox?: string
    description?: string
    error?: string
    forgotPasswordLink?: string
    icon?: string
    input?: string
    label?: string
    otpInput?: string
    otpInputContainer?: string
    outlineButton?: string
    primaryButton?: string
    providerButton?: string
    qrCode?: string
    secondaryButton?: string
}

export interface AuthFormProps {
    className?: string
    classNames?: AuthFormClassNames
    callbackURL?: string
    isSubmitting?: boolean
    localization?: Partial<AuthLocalization>
    pathname?: string
    redirectTo?: string
    view?: AuthViewPath
    otpSeparators?: 0 | 1 | 2
    setIsSubmitting?: (isSubmitting: boolean) => void
}

export function AuthForm({
    className,
    classNames,
    callbackURL,
    isSubmitting,
    localization,
    pathname,
    redirectTo,
    view,
    otpSeparators = 0,
    setIsSubmitting
}: AuthFormProps) {
    const {
        basePath,
        credentials,
        localization: contextLocalization,
        magicLink,
        emailOTP,
        phoneNumber,
        signUp,
        twoFactor: twoFactorEnabled,
        viewPaths,
        replace
    } = useContext(AuthUIContext)

    const signUpEnabled = !!signUp

    localization = { ...contextLocalization, ...localization }

    useEffect(() => {
        if (pathname && !getViewByPath(viewPaths, pathname)) {
            console.error(`Invalid auth view: ${pathname}`)
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [pathname, viewPaths, basePath, replace])

    view =
        view ||
        (getViewByPath(viewPaths, pathname) as AuthViewPath) ||
        "SIGN_IN"

    // Redirect to appropriate view based on enabled features
    useEffect(() => {
        let isInvalidView = false

        if (
            view === "MAGIC_LINK" &&
            (!magicLink || (!credentials && !emailOTP))
        ) {
            isInvalidView = true
        }

        if (
            view === "EMAIL_OTP" &&
            (!emailOTP || (!credentials && !magicLink))
        ) {
            isInvalidView = true
        }

        if (view === "SIGN_UP" && !signUpEnabled) {
            isInvalidView = true
        }

        if (
            !credentials &&
            [
                "SIGN_UP",
                "FORGOT_PASSWORD",
                "RESET_PASSWORD",
                "TWO_FACTOR",
                "RECOVER_ACCOUNT"
            ].includes(view)
        ) {
            isInvalidView = true
        }

        if (
            ["TWO_FACTOR", "RECOVER_ACCOUNT"].includes(view) &&
            !twoFactorEnabled
        ) {
            isInvalidView = true
        }

        if (isInvalidView) {
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [
        basePath,
        view,
        viewPaths,
        credentials,
        replace,
        emailOTP,
        signUpEnabled,
        magicLink,
        twoFactorEnabled
    ])

    if (view === "SIGN_OUT") return <SignOut />
    if (view === "CALLBACK") return <AuthCallback redirectTo={redirectTo} />

    if (view === "SIGN_IN") {
        return credentials ? (
            <SignInForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : phoneNumber ? (
            <PhoneSignInForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : magicLink ? (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : emailOTP ? (
            <EmailOTPForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : null
    }

    if (view === "TWO_FACTOR") {
        return (
            <TwoFactorForm
                className={className}
                classNames={classNames}
                localization={localization}
                otpSeparators={otpSeparators}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "RECOVER_ACCOUNT") {
        return (
            <RecoverAccountForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "MAGIC_LINK") {
        return (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "EMAIL_OTP") {
        return (
            <EmailOTPForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "FORGOT_PASSWORD") {
        return (
            <ForgotPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "RESET_PASSWORD") {
        return (
            <ResetPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
            />
        )
    }

    if (view === "SIGN_UP") {
        if (!signUpEnabled) return null

        return credentials ? (
            <SignUpForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : phoneNumber ? (
            <PhoneSignUpForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : null
    }
}
