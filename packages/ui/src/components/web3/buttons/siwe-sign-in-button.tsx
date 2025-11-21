/**
 * siwe-sign-in-button
 * Sign-In with Ethereum (SIWE) button component
 * Part of @bettercone/ui Web3 components
 */

"use client"

import type { BetterFetchOption } from "@better-fetch/fetch"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"

import { useCaptchaStub } from "@/hooks/use-captcha-stub"
import { useOnSuccessTransition } from "@/hooks/use-success-transition"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn, getLocalizedError } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import { Button } from "@/components/ui/button"

export type SiweSignInButtonClassNames = {
    base?: string
    button?: string
}

export interface SiweSignInButtonProps {
    /**
     * Custom CSS class names for styling different parts of the component
     */
    classNames?: SiweSignInButtonClassNames

    /**
     * Custom CSS class for the button
     */
    className?: string

    /**
     * Whether the component is in a submitting state
     */
    isSubmitting?: boolean

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>

    /**
     * URL to redirect to after successful sign-in
     */
    redirectTo?: string

    /**
     * Callback to update the submitting state
     */
    setIsSubmitting?: (isSubmitting: boolean) => void

    /**
     * Button variant
     * @default "default"
     */
    variant?: "default" | "outline" | "ghost" | "secondary"

    /**
     * Button size
     * @default "default"
     */
    size?: "default" | "sm" | "lg" | "icon"
}

/**
 * SiweSignInButton Component
 *
 * Provides a button for Sign-In with Ethereum (SIWE) authentication.
 * Integrates with Better Auth's SIWE plugin and wallet providers.
 *
 * @example
 * ```tsx
 * import { SiweSignInButton } from '@bettercone/ui';
 *
 * export function LoginPage() {
 *   return (
 *     <div className="space-y-4">
 *       <SiweSignInButton />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom styling
 * ```tsx
 * <SiweSignInButton
 *   variant="outline"
 *   size="lg"
 *   classNames={{
 *     button: "w-full"
 *   }}
 * />
 * ```
 */
export function SiweSignInButton({
    className,
    classNames,
    isSubmitting: isSubmittingProp,
    localization: localizationProp,
    redirectTo: redirectToProp,
    setIsSubmitting: setIsSubmittingProp,
    variant = "default",
    size = "default"
}: SiweSignInButtonProps) {
    const {
        authClient,
        basePath,
        localization: contextLocalization,
        replace,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const [isSubmittingState, setIsSubmittingState] = useState(false)
    const isSubmitting = isSubmittingProp ?? isSubmittingState
    const setIsSubmitting = setIsSubmittingProp ?? setIsSubmittingState

    const { getCaptchaHeaders, resetCaptcha } = useCaptchaStub()
    const { onSuccess, isPending } = useOnSuccessTransition({
        redirectTo: redirectToProp
    })

    async function handleSiweSignIn() {
        setIsSubmitting(true)

        try {
            // Check if window.ethereum is available
            if (typeof window === "undefined" || !window.ethereum) {
                toast({
                    variant: "error",
                    message: "No Ethereum wallet found. Please install MetaMask or another Web3 wallet."
                })
                setIsSubmitting(false)
                return
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })

            if (!accounts || accounts.length === 0) {
                toast({
                    variant: "error",
                    message: "Failed to connect to wallet"
                })
                setIsSubmitting(false)
                return
            }

            const walletAddress = accounts[0] as `0x${string}`

            // Get chain ID
            const chainId = await window.ethereum.request({
                method: "eth_chainId"
            })
            const chainIdNumber = parseInt(chainId, 16)

            // Step 1: Get nonce from Better Auth
            const nonceResponse = await authClient.siwe.nonce({
                walletAddress,
                chainId: chainIdNumber
            })

            if (!nonceResponse.data?.nonce) {
                toast({
                    variant: "error",
                    message: "Failed to get authentication nonce"
                })
                setIsSubmitting(false)
                return
            }

            const nonce = nonceResponse.data.nonce

            // Step 2: Create SIWE message
            const domain = window.location.host
            const origin = window.location.origin
            const statement = "Sign in with Ethereum to the app."
            
            const message = `${domain} wants you to sign in with your Ethereum account:
${walletAddress}

${statement}

URI: ${origin}
Version: 1
Chain ID: ${chainIdNumber}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`

            // Step 3: Request signature from wallet
            const signature = await window.ethereum.request({
                method: "personal_sign",
                params: [message, walletAddress]
            })

            // Step 4: Verify signature with Better Auth
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/siwe/verify")
            }

            const verifyResponse = await authClient.siwe.verify(
                {
                    message,
                    signature,
                    walletAddress,
                    chainId: chainIdNumber,
                    fetchOptions
                },
                {
                    onSuccess: async () => {
                        toast({
                            variant: "success",
                            message: "Successfully signed in with Ethereum"
                        })

                        await onSuccess()
                    },
                    onError: (ctx: any) => {
                        toast({
                            variant: "error",
                            message: getLocalizedError({
                                error: ctx.error,
                                localization
                            })
                        })
                        resetCaptcha()
                        setIsSubmitting(false)
                    }
                }
            )
        } catch (error: any) {
            console.error("SIWE sign-in error:", error)
            
            // Handle user rejection
            if (error.code === 4001) {
                toast({
                    variant: "error",
                    message: "Signature request was rejected"
                })
            } else {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error, localization })
                })
            }
            
            resetCaptcha()
            setIsSubmitting(false)
        }
    }

    return (
        <div className={cn("space-y-2", classNames?.base)}>
            <Button
                type="button"
                variant={variant}
                size={size}
                onClick={handleSiweSignIn}
                disabled={isSubmitting}
                className={cn("w-full", className, classNames?.button)}
            >
                {isSubmitting || isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <EthereumIcon className="mr-2 h-4 w-4" />
                        Sign in with Ethereum
                    </>
                )}
            </Button>
        </div>
    )
}

/**
 * Simple Ethereum icon component
 */
function EthereumIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
        </svg>
    )
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>
            on?: (event: string, handler: (...args: any[]) => void) => void
            removeListener?: (
                event: string,
                handler: (...args: any[]) => void
            ) => void
        }
    }
}
