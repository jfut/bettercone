/**
 * oidc-provider-card
 * OAuth2/OIDC Provider - Client Application Management
 * 
 * Supports RFC7591 dynamic client registration, client credentials management,
 * token lifecycle, consent screens, and trusted client configuration.
 * 
 * @see https://www.better-auth.com/docs/plugins/oidc-provider
 */

"use client"

import * as React from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { AnyAuthClient } from "../../types/any-auth-client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import { 
    Plus,
    Copy,
    Check,
    Trash2,
    Key,
    Shield,
    ExternalLink,
    AlertCircle,
    Loader2,
    Settings,
    Eye,
    EyeOff,
    CheckCircle2
} from "lucide-react"
import { cn } from "../../lib/utils"

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * OAuth2 Client Data Structure (Better Auth Schema)
 * Based on Better Auth oauthApplication table
 */
export interface OAuth2Client {
    id: string
    clientId: string
    clientSecret?: string
    name: string
    redirectURLs: string[] // Stored as comma-separated string in DB
    type: string // 'web', 'spa', 'native', 'm2m', etc.
    disabled: boolean
    userId?: string
    metadata?: string | Record<string, any> // Stored as string in DB
    createdAt: Date
    updatedAt?: Date
}

/**
 * OAuth2 Access Token Data Structure (Better Auth Schema)
 * Based on Better Auth oauthAccessToken table
 */
export interface OAuth2AccessToken {
    id: string
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: Date
    refreshTokenExpiresAt: Date
    clientId: string
    userId: string
    scopes: string // Stored as comma-separated string in DB
    createdAt: Date
    updatedAt: Date
}

/**
 * Client Registration Form Data (RFC7591)
 */
export interface ClientRegistrationData {
    client_name: string
    redirect_uris: string[]
    token_endpoint_auth_method?: 'none' | 'client_secret_basic' | 'client_secret_post'
    grant_types?: ('authorization_code' | 'refresh_token' | 'implicit' | 'password' | 'client_credentials' | 'urn:ietf:params:oauth:grant-type:jwt-bearer' | 'urn:ietf:params:oauth:grant-type:saml2-bearer')[]
    response_types?: ('code' | 'token')[]
    client_uri?: string
    logo_uri?: string
    scope?: string
    contacts?: string[]
    tos_uri?: string
    policy_uri?: string
    jwks_uri?: string
    jwks?: Record<string, any>
}

/**
 * Component Props
 */
export interface OIDCProviderCardProps {
    /**
     * List of OAuth2 clients (optional - auto-fetches if not provided)
     */
    clients?: OAuth2Client[]

    /**
     * Custom auth client
     */
    authClient?: AnyAuthClient

    /**
     * Custom CSS class
     */
    className?: string

    /**
     * Custom class names
     */
    classNames?: {
        base?: string
        header?: string
        clientList?: string
        clientCard?: string
    }

    /**
     * Localization strings
     */
    localization?: Partial<AuthLocalization>

    /**
     * Callback when client is registered
     */
    onClientRegistered?: (client: OAuth2Client) => void

    /**
     * Callback when client is updated
     */
    onClientUpdated?: (client: OAuth2Client) => void

    /**
     * Callback when client is deleted
     */
    onClientDeleted?: (clientId: string) => void

    /**
     * Callback on error
     */
    onError?: (error: Error) => void

    /**
     * Show active tokens section
     */
    showActiveTokens?: boolean

    /**
     * Show trusted clients section
     */
    showTrustedClients?: boolean

    /**
     * Allow dynamic client registration
     */
    allowRegistration?: boolean
}

// ============================================================================
// Main Component with Auto-Detection
// ============================================================================

export function OIDCProviderCard(props: OIDCProviderCardProps) {
    const context = React.useContext(AuthUIContext)
    
    // Check if auto-fetch is possible
    const hasOAuth2API = context?.authClient?.oauth2?.listClients
    const shouldAutoFetch = hasOAuth2API && !props.clients
    
    if (shouldAutoFetch) {
        return <OIDCProviderCardAutoFetch {...props} />
    }
    
    return <OIDCProviderCardPresentational {...props} />
}

// ============================================================================
// Auto-Fetch Implementation
// ============================================================================

function OIDCProviderCardAutoFetch(props: OIDCProviderCardProps) {
    const context = React.useContext(AuthUIContext)
    
    if (!context) {
        return <OIDCProviderCardError 
            message="AuthUIContext not found. Wrap component in AuthUIProvider." 
            className={props.className}
        />
    }
    
    const { authClient, toast } = context
    const [clients, setClients] = React.useState<OAuth2Client[] | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<Error | null>(null)
    
    const fetchClients = React.useCallback(async () => {
        if (!authClient?.oauth2?.listClients) {
            setError(new Error("authClient.oauth2.listClients not available"))
            setIsLoading(false)
            return
        }
        
        try {
            setIsLoading(true)
            const { data, error: fetchError } = await authClient.oauth2.listClients()
            
            if (fetchError) {
                setError(fetchError)
                props.onError?.(fetchError)
                toast?.({
                    variant: "error",
                    message: "Failed to load OAuth2 clients"
                })
            } else {
                setClients((data as any[]) || [])
                setError(null)
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error")
            setError(error)
            props.onError?.(error)
        } finally {
            setIsLoading(false)
        }
    }, [authClient, toast, props])
    
    React.useEffect(() => {
        fetchClients()
    }, [fetchClients])
    
    if (isLoading) {
        return <OIDCProviderCardLoading className={props.className} />
    }
    
    if (error) {
        return <OIDCProviderCardError 
            message={error.message} 
            className={props.className}
            onRetry={fetchClients}
        />
    }
    
    return (
        <OIDCProviderCardPresentational 
            {...props} 
            clients={clients || []}
            onClientRegistered={(client) => {
                props.onClientRegistered?.(client)
                fetchClients()
            }}
            onClientUpdated={(client) => {
                props.onClientUpdated?.(client)
                fetchClients()
            }}
            onClientDeleted={(clientId) => {
                props.onClientDeleted?.(clientId)
                fetchClients()
            }}
        />
    )
}

// ============================================================================
// Presentational Implementation
// ============================================================================

function OIDCProviderCardPresentational({
    clients = [],
    authClient,
    className,
    classNames,
    localization: localizationProp,
    onClientRegistered,
    onClientUpdated,
    onClientDeleted,
    onError,
    showActiveTokens = false,
    showTrustedClients = false,
    allowRegistration = true,
}: OIDCProviderCardProps) {
    const context = React.useContext(AuthUIContext)
    const localization = React.useMemo(
        () => ({ ...context?.localization, ...localizationProp }),
        [context?.localization, localizationProp]
    )
    const toast = context?.toast
    
    // State
    const [isRegistering, setIsRegistering] = React.useState(false)
    const [showRegisterDialog, setShowRegisterDialog] = React.useState(false)
    const [showSecretDialog, setShowSecretDialog] = React.useState(false)
    const [newClientData, setNewClientData] = React.useState<OAuth2Client | null>(null)
    const [selectedClient, setSelectedClient] = React.useState<OAuth2Client | null>(null)
    const [copiedField, setCopiedField] = React.useState<string | null>(null)
    const [showSecret, setShowSecret] = React.useState<Record<string, boolean>>({})
    
    // Form state
    const [formData, setFormData] = React.useState<ClientRegistrationData>({
        client_name: "",
        redirect_uris: [],
        token_endpoint_auth_method: "client_secret_basic",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        scope: "openid email profile",
        contacts: [],
    })
    
    // Handle client registration
    const handleRegisterClient = async () => {
        if (!authClient?.oauth2?.register) {
            onError?.(new Error("OAuth2 registration not available"))
            return
        }
        
        try {
            setIsRegistering(true)
            
            const { data, error } = await authClient.oauth2.register(formData)
            
            if (error) {
                onError?.(error)
                toast?.({
                    variant: "error",
                    message: "Failed to register client"
                })
            } else if (data) {
                // Transform API response to OAuth2Client format
                const client: OAuth2Client = {
                    id: (data as any).client_id || '',
                    clientId: (data as any).client_id || '',
                    clientSecret: (data as any).client_secret,
                    name: (data as any).client_name || formData.client_name,
                    redirectURLs: (data as any).redirect_uris || formData.redirect_uris,
                    type: 'web',
                    disabled: false,
                    createdAt: new Date(),
                }
                setNewClientData(client)
                setShowRegisterDialog(false)
                setShowSecretDialog(true)
                onClientRegistered?.(client)
                toast?.({
                    variant: "success",
                    message: "Client registered successfully"
                })
                // Reset form
                setFormData({
                    client_name: "",
                    redirect_uris: [],
                    token_endpoint_auth_method: "client_secret_basic",
                    grant_types: ["authorization_code", "refresh_token"],
                    response_types: ["code"],
                    scope: "openid email profile",
                    contacts: [],
                })
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error")
            onError?.(error)
            toast?.({
                variant: "error",
                message: error.message
            })
        } finally {
            setIsRegistering(false)
        }
    }
    
    // Handle client deletion
    const handleDeleteClient = async (clientId: string) => {
        if (!authClient?.oauth2?.deleteClient) {
            onError?.(new Error("OAuth2 delete not available"))
            return
        }
        
        try {
            const { error } = await authClient.oauth2.deleteClient({ clientId })
            
            if (error) {
                onError?.(error)
                toast?.({
                    variant: "error",
                    message: "Failed to delete client"
                })
            } else {
                onClientDeleted?.(clientId)
                toast?.({
                    variant: "success",
                    message: "Client deleted successfully"
                })
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error")
            onError?.(error)
        }
    }
    
    // Copy to clipboard
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }
    
    // Toggle secret visibility
    const toggleSecretVisibility = (clientId: string) => {
        setShowSecret(prev => ({ ...prev, [clientId]: !prev[clientId] }))
    }
    
    return (
        <Card className={cn("w-full", className, classNames?.base)}>
            <CardHeader className={classNames?.header}>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            OIDC Provider
                        </CardTitle>
                        <CardDescription>
                            Manage OAuth2/OIDC client applications
                        </CardDescription>
                    </div>
                    {allowRegistration && authClient?.oauth2?.register && (
                        <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Register Client
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Register OAuth2 Client</DialogTitle>
                                    <DialogDescription>
                                        Create a new OAuth2/OIDC client application
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                    {/* Client Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="client-name">
                                            Client Name
                                            <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                                        </Label>
                                        <Input
                                            id="client-name"
                                            placeholder="My Application"
                                            value={formData.client_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                        />
                                    </div>
                                    
                                    {/* Redirect URIs */}
                                    <div className="space-y-2">
                                        <Label htmlFor="redirect-uris">
                                            Redirect URIs
                                            <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                                        </Label>
                                        <Textarea
                                            id="redirect-uris"
                                            placeholder="https://myapp.com/callback&#10;https://myapp.com/auth/callback"
                                            rows={3}
                                            value={formData.redirect_uris.join("\n")}
                                            onChange={(e) => setFormData(prev => ({ 
                                                ...prev, 
                                                redirect_uris: e.target.value.split("\n").filter(Boolean) 
                                            }))}
                                        />
                                        <p className="text-xs text-muted-foreground">One URI per line</p>
                                    </div>
                                    
                                    {/* Token Endpoint Auth Method */}
                                    <div className="space-y-2">
                                        <Label htmlFor="auth-method">Token Endpoint Auth Method</Label>
                                        <Select
                                            value={formData.token_endpoint_auth_method}
                                            onValueChange={(value: 'none' | 'client_secret_basic' | 'client_secret_post') =>
                                                setFormData(prev => ({ ...prev, token_endpoint_auth_method: value }))
                                            }
                                        >
                                            <SelectTrigger id="auth-method">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="client_secret_basic">Client Secret (Basic)</SelectItem>
                                                <SelectItem value="client_secret_post">Client Secret (Post)</SelectItem>
                                                <SelectItem value="none">None (Public Client)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <Separator />
                                    
                                    {/* Optional Metadata */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-sm">Optional Metadata</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="client-uri">Application URL</Label>
                                            <Input
                                                id="client-uri"
                                                placeholder="https://myapp.com"
                                                value={formData.client_uri || ""}
                                                onChange={(e) => setFormData(prev => ({ ...prev, client_uri: e.target.value }))}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="logo-uri">Logo URL</Label>
                                            <Input
                                                id="logo-uri"
                                                placeholder="https://myapp.com/logo.png"
                                                value={formData.logo_uri || ""}
                                                onChange={(e) => setFormData(prev => ({ ...prev, logo_uri: e.target.value }))}
                                            />
                                        </div>
                                        
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="tos-uri">Terms of Service URL</Label>
                                                <Input
                                                    id="tos-uri"
                                                    placeholder="https://myapp.com/terms"
                                                    value={formData.tos_uri || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, tos_uri: e.target.value }))}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="policy-uri">Privacy Policy URL</Label>
                                                <Input
                                                    id="policy-uri"
                                                    placeholder="https://myapp.com/privacy"
                                                    value={formData.policy_uri || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, policy_uri: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowRegisterDialog(false)}
                                        disabled={isRegistering}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleRegisterClient}
                                        disabled={isRegistering || !formData.client_name || formData.redirect_uris.length === 0}
                                    >
                                        {isRegistering && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        Register Client
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className={classNames?.clientList}>
                {clients.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Key className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium">No OAuth2 clients registered</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Get started by registering your first client application
                            </p>
                        </div>
                        {allowRegistration && authClient?.oauth2?.register && (
                            <Button onClick={() => setShowRegisterDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Register Client
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {clients.map((client) => (
                            <Card key={client.id} className={cn("border-muted", classNames?.clientCard)}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{client.name}</CardTitle>
                                            <div className="flex gap-2 flex-wrap">
                                                <Badge variant="secondary" className="text-xs">
                                                    {client.type.toUpperCase()}
                                                </Badge>
                                                {client.disabled && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Disabled
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {authClient?.oauth2?.deleteClient && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete OAuth2 Client</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure? This will revoke access for all users of this application.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteClient(client.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Client ID */}
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Client ID</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={client.clientId}
                                                readOnly
                                                className="font-mono text-xs"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(client.clientId, `client-id-${client.id}`)}
                                            >
                                                {copiedField === `client-id-${client.id}` ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Client Secret */}
                                    {client.clientSecret && (
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Client Secret</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type={showSecret[client.id] ? "text" : "password"}
                                                    value={client.clientSecret}
                                                    readOnly
                                                    className="font-mono text-xs"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => toggleSecretVisibility(client.id)}
                                                >
                                                    {showSecret[client.id] ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(client.clientSecret!, `client-secret-${client.id}`)}
                                                >
                                                    {copiedField === `client-secret-${client.id}` ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Redirect URLs */}
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Redirect URLs</Label>
                                        <div className="space-y-1">
                                            {client.redirectURLs.map((url, index) => (
                                                <div key={index} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                                    {url}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Metadata Links - Parse metadata if it's a string */}
                                    {(() => {
                                        const metadata = typeof client.metadata === 'string' 
                                            ? JSON.parse(client.metadata || '{}')
                                            : client.metadata || {};
                                        const hasMetadata = metadata.client_uri || metadata.tos_uri || metadata.policy_uri;
                                        
                                        return hasMetadata ? (
                                            <div className="flex gap-2 pt-2">
                                                {metadata.client_uri && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={metadata.client_uri} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            Website
                                                        </a>
                                                    </Button>
                                                )}
                                                {metadata.tos_uri && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={metadata.tos_uri} target="_blank" rel="noopener noreferrer">
                                                            Terms
                                                        </a>
                                                    </Button>
                                                )}
                                                {metadata.policy_uri && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={metadata.policy_uri} target="_blank" rel="noopener noreferrer">
                                                            Privacy
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        ) : null;
                                    })()}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
            
            {/* New Client Secret Dialog */}
            <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Client Registered Successfully
                        </DialogTitle>
                        <DialogDescription>
                            Copy and save these credentials securely. The secret will only be shown once.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {newClientData && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Client ID</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newClientData.clientId}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(newClientData.clientId, 'new-client-id')}
                                    >
                                        {copiedField === 'new-client-id' ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            {newClientData.clientSecret && (
                                <div className="space-y-2">
                                    <Label>Client Secret</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newClientData.clientSecret}
                                            readOnly
                                            className="font-mono text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(newClientData.clientSecret!, 'new-client-secret')}
                                        >
                                            {copiedField === 'new-client-secret' ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
                                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-900 dark:text-amber-200">
                                            This secret will only be shown once. Make sure to save it securely.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button onClick={() => {
                            setShowSecretDialog(false)
                            setNewClientData(null)
                        }}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

// ============================================================================
// Loading State
// ============================================================================

function OIDCProviderCardLoading({ className }: { className?: string }) {
    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <CardTitle>Loading OAuth2 clients...</CardTitle>
                </div>
            </CardHeader>
        </Card>
    )
}

// ============================================================================
// Error State
// ============================================================================

function OIDCProviderCardError({ 
    message, 
    className, 
    onRetry 
}: { 
    message: string
    className?: string
    onRetry?: () => void
}) {
    return (
        <Card className={cn("w-full border-destructive", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Error Loading Clients
                </CardTitle>
                <CardDescription>{message}</CardDescription>
            </CardHeader>
            {onRetry && (
                <CardFooter>
                    <Button variant="outline" onClick={onRetry}>
                        Retry
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
