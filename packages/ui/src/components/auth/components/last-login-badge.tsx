/**
 * last-login-badge
 * Badge component to display the last authentication method used
 * Part of @bettercone/ui Authentication components
 */

"use client"

import { useContext } from "react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { socialProviders } from "@/lib/social-providers"
import type { AuthLocalization } from "@/localization/auth-localization"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface LastLoginBadgeProps {
    /**
     * The authentication method that was last used
     * If not provided, will attempt to read from authClient
     */
    method?: string

    /**
     * Custom CSS class for the badge
     */
    className?: string

    /**
     * Badge variant
     * @default "secondary"
     */
    variant?: "default" | "secondary" | "outline" | "destructive"

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>

    /**
     * Show provider icon alongside text
     * @default true
     */
    showIcon?: boolean

    /**
     * Custom text format
     * Use {provider} as placeholder for the provider name
     * @default "Last used"
     */
    text?: string
}

/**
 * LastLoginBadge Component
 *
 * Displays a badge indicating the last authentication method used by the user.
 * Integrates with Better Auth's Last Login Method plugin.
 *
 * @example
 * ```tsx
 * import { LastLoginBadge } from '@bettercone/ui';
 *
 * export function SignInPage() {
 *   return (
 *     <div>
 *       <Button>
 *         Sign in with Google
 *         <LastLoginBadge method="google" />
 *       </Button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom text
 * ```tsx
 * <LastLoginBadge 
 *   method="email" 
 *   text="Used before"
 *   variant="outline"
 * />
 * ```
 */
export function LastLoginBadge({
    method: methodProp,
    className,
    variant = "secondary",
    localization: localizationProp,
    showIcon = true,
    text = "Last used"
}: LastLoginBadgeProps) {
    const context = useContext(AuthUIContext)
    const localization = {
        ...context?.localization,
        ...localizationProp
    }

    // Try to get method from authClient if not provided
    let method = methodProp
    if (!method && context?.authClient) {
        try {
            // Check if lastLoginMethod plugin is available
            if ("getLastUsedLoginMethod" in context.authClient) {
                method = (context.authClient as any).getLastUsedLoginMethod()
            }
        } catch (error) {
            // Plugin not available, silently fail
            console.warn(
                "LastLoginBadge: lastLoginMethod plugin not found in authClient"
            )
        }
    }

    // Don't render if no method is available
    if (!method) {
        return null
    }

    // Find provider info for social/OAuth methods
    const provider = socialProviders.find((p) => p.provider === method)

    // Determine display name
    let displayName: string
    if (provider) {
        displayName = provider.name
    } else if (method === "email") {
        displayName = "Email"
    } else if (method === "passkey") {
        displayName = "Passkey"
    } else if (method === "magic-link") {
        displayName = "Magic Link"
    } else if (method === "phone") {
        displayName = "Phone"
    } else if (method === "anonymous") {
        displayName = "Guest"
    } else if (method === "siwe") {
        displayName = "Ethereum"
    } else {
        // Capitalize first letter for unknown methods
        displayName = method.charAt(0).toUpperCase() + method.slice(1)
    }

    const ProviderIcon = provider?.icon

    return (
        <Badge variant={variant} className={cn("ml-2 gap-1", className)}>
            {showIcon && ProviderIcon && (
                <ProviderIcon className="h-3 w-3" />
            )}
            {text}
        </Badge>
    )
}
