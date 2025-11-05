/**
 * wallet-connection-card
 * Manage Web3 wallet connections
 * Part of @bettercone/ui Web3 components
 */

"use client"

import { Loader2, Trash2, Wallet } from "lucide-react"
import { useContext, useEffect, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"

export type WalletConnectionCardClassNames = {
    base?: string
    header?: string
    title?: string
    description?: string
    content?: string
    walletItem?: string
    button?: string
    badge?: string
}

export interface WalletConnectionCardProps {
    /**
     * Custom CSS class names for styling different parts of the component
     */
    classNames?: WalletConnectionCardClassNames

    /**
     * Custom CSS class for the card
     */
    className?: string

    /**
     * Localization object for customizing text
     */
    localization?: Partial<AuthLocalization>

    /**
     * Card title
     * @default "Wallet Connections"
     */
    title?: string

    /**
     * Card description
     * @default "Manage your connected Web3 wallets"
     */
    description?: string
}

interface WalletConnection {
    id: string
    userId: string
    address: string
    chainId: number
    isPrimary?: boolean
    createdAt: Date
}

/**
 * WalletConnectionCard Component
 *
 * Displays and manages connected Web3 wallets for the current user.
 * Allows users to view, connect, and disconnect Ethereum wallets.
 *
 * @example
 * ```tsx
 * import { WalletConnectionCard } from '@bettercone/ui';
 *
 * export function SettingsPage() {
 *   return (
 *     <div className="space-y-6">
 *       <WalletConnectionCard />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom title
 * ```tsx
 * <WalletConnectionCard
 *   title="My Web3 Wallets"
 *   description="Connect and manage your Ethereum addresses"
 * />
 * ```
 */
export function WalletConnectionCard({
    className,
    classNames,
    localization: localizationProp,
    title = "Wallet Connections",
    description = "Manage your connected Web3 wallets"
}: WalletConnectionCardProps) {
    const {
        authClient,
        localization: contextLocalization,
        toast,
        hooks: { useSession }
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const { data: sessionData, refetch: refetchSession } = useSession()
    const [wallets, setWallets] = useState<WalletConnection[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [walletToRemove, setWalletToRemove] = useState<string | null>(null)
    const [isRemoving, setIsRemoving] = useState(false)

    // Load wallet connections
    useEffect(() => {
        if (sessionData?.user) {
            loadWallets()
        }
    }, [sessionData])

    async function loadWallets() {
        setIsLoading(true)
        try {
            // Fetch connected wallets from Better Auth
            const response = await authClient.$fetch("/api/auth/wallets", {
                method: "GET"
            })

            if (response && response.wallets) {
                setWallets(response.wallets)
            }
        } catch (error) {
            console.error("Failed to load wallets:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function connectWallet() {
        setIsConnecting(true)

        try {
            if (typeof window === "undefined" || !window.ethereum) {
                toast({
                    variant: "error",
                    message: "No Ethereum wallet found. Please install MetaMask or another Web3 wallet."
                })
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
                return
            }

            const address = accounts[0]

            // Connect wallet via Better Auth
            await authClient.$fetch("/api/auth/wallets/connect", {
                method: "POST",
                body: { address }
            })

            toast({
                variant: "success",
                message: "Wallet connected successfully"
            })

            await loadWallets()
            await refetchSession()
        } catch (error) {
            console.error("Wallet connection error:", error)
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        } finally {
            setIsConnecting(false)
        }
    }

    async function disconnectWallet(walletId: string) {
        setIsRemoving(true)

        try {
            await authClient.$fetch("/api/auth/wallets/disconnect", {
                method: "POST",
                body: { walletId }
            })

            toast({
                variant: "success",
                message: "Wallet disconnected successfully"
            })

            await loadWallets()
            await refetchSession()
            setWalletToRemove(null)
        } catch (error) {
            console.error("Wallet disconnect error:", error)
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        } finally {
            setIsRemoving(false)
        }
    }

    function formatAddress(address: string): string {
        if (!address) return ""
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    function getChainName(chainId: number): string {
        const chainNames: Record<number, string> = {
            1: "Ethereum",
            137: "Polygon",
            42161: "Arbitrum",
            8453: "Base",
            10: "Optimism",
        }
        return chainNames[chainId] || `Chain ${chainId}`
    }

    return (
        <>
            <Card className={cn("", className, classNames?.base)}>
                <CardHeader className={classNames?.header}>
                    <CardTitle className={classNames?.title}>
                        {title}
                    </CardTitle>
                    <CardDescription className={classNames?.description}>
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent className={cn("space-y-4", classNames?.content)}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : wallets.length > 0 ? (
                        <div className="space-y-3">
                            {wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border bg-card",
                                        classNames?.walletItem
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Wallet className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm">
                                                    {formatAddress(wallet.address)}
                                                </p>
                                                {wallet.isPrimary && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn("text-xs", classNames?.badge)}
                                                    >
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {getChainName(wallet.chainId)} • {new Date(wallet.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setWalletToRemove(wallet.id)}
                                        disabled={wallet.isPrimary && wallets.length === 1}
                                        title={
                                            wallet.isPrimary && wallets.length === 1
                                                ? "Cannot remove your only wallet"
                                                : "Disconnect wallet"
                                        }
                                    >
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No wallets connected</p>
                        </div>
                    )}

                    <Button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className={cn("w-full", classNames?.button)}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Wallet className="mr-2 h-4 w-4" />
                                Connect Wallet
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Disconnect Confirmation Dialog */}
            <Dialog
                open={walletToRemove !== null}
                onOpenChange={(open) => !open && setWalletToRemove(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Disconnect Wallet</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to disconnect this wallet? You
                            can reconnect it anytime.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setWalletToRemove(null)}
                            disabled={isRemoving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                walletToRemove && disconnectWallet(walletToRemove)
                            }
                            disabled={isRemoving}
                        >
                            {isRemoving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Disconnecting...
                                </>
                            ) : (
                                "Disconnect"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
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
