/**
 * captcha
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

// Optional dependencies - install if needed:
// import HCaptcha from "@hcaptcha/react-hcaptcha"
// import { Turnstile } from "@marsidev/react-turnstile"
import { type RefObject, useContext } from "react"

import { useTheme } from "@/hooks/use-theme"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import type { AuthLocalization } from "@/localization/auth-localization"
// import { RecaptchaBadge } from "./recaptcha-badge" // Not extracted
// import { RecaptchaV2 } from "./recaptcha-v2" // Not extracted

// Type declarations for optional dependencies
declare global {
    const HCaptcha: any
    const Turnstile: any
    const RecaptchaV2: any
    const RecaptchaBadge: any
}

// Default captcha endpoints
const DEFAULT_CAPTCHA_ENDPOINTS = [
    "/sign-up/email",
    "/sign-in/email",
    "/forget-password"
]

interface CaptchaProps {
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    ref: RefObject<any>
    localization: Partial<AuthLocalization>
    action?: string // Optional action to check if it's in the endpoints list
}

export function Captcha({ ref, localization, action }: CaptchaProps) {
    const { captcha } = useContext(AuthUIContext)
    if (!captcha) return null

    // If action is provided, check if it's in the list of captcha-enabled endpoints
    if (action) {
        const endpoints = captcha.endpoints || DEFAULT_CAPTCHA_ENDPOINTS
        if (!endpoints.includes(action)) {
            return null
        }
    }

    const { theme } = useTheme()

    const showRecaptchaV2 =
        captcha.provider === "google-recaptcha-v2-checkbox" ||
        captcha.provider === "google-recaptcha-v2-invisible"

    const showRecaptchaBadge =
        captcha.provider === "google-recaptcha-v3" ||
        captcha.provider === "google-recaptcha-v2-invisible"

    const showTurnstile = captcha.provider === "cloudflare-turnstile"

    const showHCaptcha = captcha.provider === "hcaptcha"

    return (
        <>
            {showRecaptchaV2 && typeof RecaptchaV2 !== 'undefined' && <RecaptchaV2 ref={ref} />}
            {showRecaptchaBadge && typeof RecaptchaBadge !== 'undefined' && (
                <RecaptchaBadge localization={localization} />
            )}
            {showTurnstile && typeof Turnstile !== 'undefined' && (
                <Turnstile
                    className="mx-auto"
                    ref={ref}
                    siteKey={captcha.siteKey}
                    options={{
                        theme: theme,
                        size: "flexible"
                    }}
                />
            )}
            {showHCaptcha && typeof HCaptcha !== 'undefined' && (
                <div className="mx-auto">
                    <HCaptcha
                        ref={ref}
                        sitekey={captcha.siteKey}
                        theme={theme}
                    />
                </div>
            )}
        </>
    )
}
