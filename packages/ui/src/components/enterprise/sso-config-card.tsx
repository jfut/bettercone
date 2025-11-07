/**
 * sso-config-card
 * SAML and OIDC SSO configuration component
 * Redesigned with clean tab-based layout following BetterCone design system
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
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
} from "../ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Separator } from "../ui/separator"
import { 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    Copy, 
    Check,
    Upload,
    Settings2,
    TestTube2
} from "lucide-react"
import { cn } from "../../lib/utils"

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Attribute Mapping for OIDC and SAML
 */
export interface AttributeMapping {
    id?: string
    email?: string
    emailVerified?: string
    name?: string
    firstName?: string
    lastName?: string
    image?: string
    extraFields?: Record<string, string>
}

/**
 * IdP Metadata (SAML)
 */
export interface IDPMetadata {
    metadata?: string
    privateKey?: string
    privateKeyPass?: string
    isAssertionEncrypted?: boolean
    encPrivateKey?: string
    encPrivateKeyPass?: string
}

/**
 * SP Metadata (SAML)
 */
export interface SPMetadata {
    metadata?: string
    binding?: 'post' | 'redirect'
    privateKey?: string
    privateKeyPass?: string
    isAssertionEncrypted?: boolean
    encPrivateKey?: string
    encPrivateKeyPass?: string
}

/**
 * OIDC Configuration
 */
export interface OIDCConfig {
    clientId: string
    clientSecret?: string
    authorizationEndpoint: string
    tokenEndpoint: string
    jwksEndpoint?: string
    discoveryEndpoint?: string
    scopes?: string[]
    pkce?: boolean
    mapping?: AttributeMapping
}

/**
 * SAML Configuration
 */
export interface SAMLConfig {
    entryPoint: string
    cert: string
    callbackUrl: string
    audience?: string
    wantAssertionsSigned?: boolean
    signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512'
    digestAlgorithm?: 'sha1' | 'sha256' | 'sha512'
    identifierFormat?: string
    idpMetadata?: IDPMetadata
    spMetadata?: SPMetadata
    mapping?: AttributeMapping
}

/**
 * SSO Provider Data Structure
 */
export interface SSOProvider {
    id: string
    providerId: string
    issuer: string
    domain: string
    organizationId?: string
    oidcConfig?: OIDCConfig
    samlConfig?: SAMLConfig
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Component Props
 */
export interface SSOConfigCardProps {
    data?: SSOProvider
    providerId?: string
    authClient?: AnyAuthClient
    className?: string
    classNames?: {
        base?: string
        header?: string
        title?: string
        description?: string
        content?: string
        footer?: string
    }
    localization?: Partial<AuthLocalization>
    onSuccess?: (provider: SSOProvider) => void
    onError?: (error: Error) => void
    showActions?: boolean
    allowDelete?: boolean
    allowMetadataUpload?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * SSOConfigCard Component
 *
 * Configure SAML and OIDC single sign-on providers for enterprise authentication.
 * Clean tab-based layout with separate sections for configuration, mapping, and advanced options.
 *
 * @example
 * ```tsx
 * import { SSOConfigCard } from '@bettercone/ui';
 *
 * export function SSOPage() {
 *   return <SSOConfigCard />;
 * }
 * ```
 */
export function SSOConfigCard({
    data: dataProp,
    providerId: providerIdProp,
    authClient: authClientProp,
    className,
    classNames,
    localization: localizationProp,
    onSuccess,
    onError,
    showActions = true,
    allowDelete = true,
    allowMetadataUpload = true,
}: SSOConfigCardProps) {
    const context = React.useContext(AuthUIContext)
    const localization = React.useMemo(
        () => ({ ...context?.localization, ...localizationProp }),
        [context?.localization, localizationProp]
    )
    const authClient = authClientProp || context?.authClient

    // State
    const [activeTab, setActiveTab] = React.useState<"config" | "mapping" | "advanced">("config")
    const [providerType, setProviderType] = React.useState<"oidc" | "saml">("oidc")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isTesting, setIsTesting] = React.useState(false)
    const [testResult, setTestResult] = React.useState<{ success: boolean; message?: string } | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [copiedField, setCopiedField] = React.useState<string | null>(null)

    // Form data - Common fields
    const [providerId, setProviderId] = React.useState("")
    const [issuer, setIssuer] = React.useState("")
    const [domain, setDomain] = React.useState("")
    const [organizationId, setOrganizationId] = React.useState("")

    // OIDC fields
    const [clientId, setClientId] = React.useState("")
    const [clientSecret, setClientSecret] = React.useState("")
    const [authEndpoint, setAuthEndpoint] = React.useState("")
    const [tokenEndpoint, setTokenEndpoint] = React.useState("")
    const [jwksEndpoint, setJwksEndpoint] = React.useState("")
    const [discoveryEndpoint, setDiscoveryEndpoint] = React.useState("")
    const [scopes, setScopes] = React.useState("openid email profile")
    const [pkceEnabled, setPkceEnabled] = React.useState("true")

    // SAML fields
    const [entryPoint, setEntryPoint] = React.useState("")
    const [certificate, setCertificate] = React.useState("")
    const [callbackUrl, setCallbackUrl] = React.useState("")
    const [entityId, setEntityId] = React.useState("")
    const [idpMetadataXml, setIdpMetadataXml] = React.useState("")
    
    // SAML Advanced
    const [wantAssertionsSigned, setWantAssertionsSigned] = React.useState("true")
    const [signatureAlgorithm, setSignatureAlgorithm] = React.useState<'sha256' | 'sha512'>('sha256')
    const [digestAlgorithm, setDigestAlgorithm] = React.useState<'sha256' | 'sha512'>('sha256')
    const [identifierFormat, setIdentifierFormat] = React.useState("urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")

    // Attribute Mapping
    const [mapId, setMapId] = React.useState("")
    const [mapEmail, setMapEmail] = React.useState("")
    const [mapName, setMapName] = React.useState("")
    const [mapFirstName, setMapFirstName] = React.useState("")
    const [mapLastName, setMapLastName] = React.useState("")
    const [mapEmailVerified, setMapEmailVerified] = React.useState("")
    const [mapImage, setMapImage] = React.useState("")
    const [extraFieldsJson, setExtraFieldsJson] = React.useState("{}")

    // Load existing provider data
    React.useEffect(() => {
        if (dataProp) {
            loadProviderData(dataProp)
        } else if (providerIdProp && authClient?.sso) {
            fetchProvider(providerIdProp)
        }
    }, [dataProp, providerIdProp])

    const loadProviderData = (provider: SSOProvider) => {
        setProviderId(provider.providerId)
        setIssuer(provider.issuer)
        setDomain(provider.domain)
        setOrganizationId(provider.organizationId || "")

        if (provider.oidcConfig) {
            setProviderType("oidc")
            const oidc = provider.oidcConfig
            setClientId(oidc.clientId)
            setClientSecret(oidc.clientSecret || "")
            setAuthEndpoint(oidc.authorizationEndpoint)
            setTokenEndpoint(oidc.tokenEndpoint)
            setJwksEndpoint(oidc.jwksEndpoint || "")
            setDiscoveryEndpoint(oidc.discoveryEndpoint || "")
            setScopes(oidc.scopes?.join(" ") || "openid email profile")
            setPkceEnabled(oidc.pkce !== false ? "true" : "false")

            if (oidc.mapping) {
                loadMapping(oidc.mapping)
            }
        } else if (provider.samlConfig) {
            setProviderType("saml")
            const saml = provider.samlConfig
            setEntryPoint(saml.entryPoint)
            setCertificate(saml.cert)
            setCallbackUrl(saml.callbackUrl)
            setEntityId(saml.audience || "")
            setIdpMetadataXml(saml.idpMetadata?.metadata || "")
            setWantAssertionsSigned(saml.wantAssertionsSigned !== false ? "true" : "false")
            setSignatureAlgorithm(saml.signatureAlgorithm as any || 'sha256')
            setDigestAlgorithm(saml.digestAlgorithm as any || 'sha256')
            setIdentifierFormat(saml.identifierFormat || "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")

            if (saml.mapping) {
                loadMapping(saml.mapping)
            }
        }
    }

    const loadMapping = (mapping: AttributeMapping) => {
        setMapId(mapping.id || "")
        setMapEmail(mapping.email || "")
        setMapName(mapping.name || "")
        setMapFirstName(mapping.firstName || "")
        setMapLastName(mapping.lastName || "")
        setMapEmailVerified(mapping.emailVerified || "")
        setMapImage(mapping.image || "")
        if (mapping.extraFields) {
            setExtraFieldsJson(JSON.stringify(mapping.extraFields, null, 2))
        }
    }

    const fetchProvider = async (id: string) => {
        if (!authClient?.sso?.getProvider) return

        setIsLoading(true)
        try {
            const response = await authClient.sso.getProvider({ providerId: id })
            if (response.data) {
                loadProviderData(response.data)
            } else if (response.error) {
                onError?.(new Error(response.error.message || "Failed to load provider"))
            }
        } catch (error) {
            onError?.(error as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const buildMapping = (): AttributeMapping | undefined => {
        const mapping: AttributeMapping = {}
        if (mapId) mapping.id = mapId
        if (mapEmail) mapping.email = mapEmail
        if (mapName) mapping.name = mapName
        if (mapFirstName) mapping.firstName = mapFirstName
        if (mapLastName) mapping.lastName = mapLastName
        if (mapEmailVerified) mapping.emailVerified = mapEmailVerified
        if (mapImage) mapping.image = mapImage
        
        try {
            const extraFields = JSON.parse(extraFieldsJson || "{}")
            if (Object.keys(extraFields).length > 0) {
                mapping.extraFields = extraFields
            }
        } catch (e) {
            // Invalid JSON, ignore
        }

        return Object.keys(mapping).length > 0 ? mapping : undefined
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!authClient?.sso) {
            onError?.(new Error(localization.SSO_CONFIG_DESCRIPTION || "SSO client not configured"))
            return
        }

        setIsLoading(true)
        setTestResult(null)

        try {
            const config: any = {
                providerId,
                issuer,
                domain,
                organizationId: organizationId || undefined,
            }

            const mapping = buildMapping()

            if (providerType === "oidc") {
                config.oidcConfig = {
                    clientId,
                    clientSecret: clientSecret || undefined,
                    authorizationEndpoint: authEndpoint,
                    tokenEndpoint,
                    jwksEndpoint: jwksEndpoint || undefined,
                    discoveryEndpoint: discoveryEndpoint || undefined,
                    scopes: scopes.split(" ").filter(Boolean),
                    pkce: pkceEnabled === "true",
                    mapping,
                }
            } else {
                config.samlConfig = {
                    entryPoint,
                    cert: certificate,
                    callbackUrl,
                    audience: entityId || undefined,
                    wantAssertionsSigned: wantAssertionsSigned === "true",
                    signatureAlgorithm,
                    digestAlgorithm,
                    identifierFormat,
                    mapping,
                }

                if (idpMetadataXml) {
                    config.samlConfig.idpMetadata = {
                        metadata: idpMetadataXml,
                    }
                }
            }

            const response = dataProp
                ? await authClient.sso.updateProvider?.(config)
                : await authClient.sso.register(config)

            if (response?.error) {
                throw new Error(response.error.message || "Failed to save provider")
            }

            context?.toast?.({
                variant: "success",
                message: dataProp
                    ? localization.SSO_PROVIDER_UPDATED || "SSO provider updated"
                    : localization.SSO_PROVIDER_CREATED || "SSO provider created"
            })

            onSuccess?.(response?.data || config)
        } catch (error) {
            context?.toast?.({
                variant: "error",
                message: (error as Error).message
            })
            onError?.(error as Error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestConnection = async () => {
        if (!authClient?.sso?.testConnection || !providerId) return

        setIsTesting(true)
        setTestResult(null)

        try {
            const response = await authClient.sso.testConnection({ providerId })
            if (response.data) {
                setTestResult(response.data)
                context?.toast?.({
                    variant: response.data.success ? "success" : "error",
                    message: response.data.message || (response.data.success
                        ? localization.SSO_TEST_SUCCESS || "Connection successful"
                        : localization.SSO_TEST_FAILED || "Connection failed")
                })
            } else if (response.error) {
                setTestResult({ success: false, message: response.error.message })
            }
        } catch (error) {
            setTestResult({ success: false, message: (error as Error).message })
        } finally {
            setIsTesting(false)
        }
    }

    const handleFetchSpMetadata = async () => {
        if (!authClient?.sso?.spMetadata || !providerId) return

        try {
            const response = await authClient.sso.spMetadata({ 
                providerId,
                format: 'xml' 
            })
            
            let metadataXml: string
            if (response instanceof Response) {
                metadataXml = await response.text()
            } else if (response.data?.metadata) {
                metadataXml = response.data.metadata
            } else {
                throw new Error("Failed to fetch SP metadata")
            }

            copyToClipboard(metadataXml, "sp-metadata")
        } catch (error) {
            context?.toast?.({
                variant: "error",
                message: (error as Error).message
            })
        }
    }

    const handleDelete = async () => {
        if (!authClient?.sso?.deleteProvider || !providerId) return

        setIsLoading(true)
        try {
            const response = await authClient.sso.deleteProvider({ providerId })
            if (response.error) {
                throw new Error(response.error.message || "Failed to delete provider")
            }

            context?.toast?.({
                variant: "success",
                message: localization.SSO_PROVIDER_DELETED || "SSO provider deleted"
            })

            onSuccess?.(null as any)
        } catch (error) {
            context?.toast?.({
                variant: "error",
                message: (error as Error).message
            })
            onError?.(error as Error)
        } finally {
            setIsLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        context?.toast?.({
            variant: "success",
            message: localization.COPIED_TO_CLIPBOARD || "Copied to clipboard"
        })
        setTimeout(() => setCopiedField(null), 2000)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result as string
            setIdpMetadataXml(content)
        }
        reader.readAsText(file)
    }

    if (isLoading && !dataProp) {
        return (
            <Card className={cn("w-full", className, classNames?.base)}>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className={cn("w-full", className, classNames?.base)}>
                <form onSubmit={handleSubmit}>
                    <CardHeader className={classNames?.header}>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className={classNames?.title}>
                                    {localization.SSO_CONFIG || "SSO Configuration"}
                                </CardTitle>
                                <CardDescription className={classNames?.description}>
                                    {localization.SSO_CONFIG_DESCRIPTION || "Configure SAML and OIDC single sign-on"}
                                </CardDescription>
                            </div>
                            {dataProp && (
                                <Badge variant="secondary">
                                    {providerType.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className={cn("space-y-6", classNames?.content)}>
                        {/* Provider Type Selection */}
                        {!dataProp && (
                            <div className="space-y-3">
                                <Label>{localization.SSO_PROVIDER_TYPE || "Provider Type"}</Label>
                                <Select value={providerType} onValueChange={(v) => setProviderType(v as "oidc" | "saml")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="oidc">
                                            OIDC (OpenID Connect)
                                        </SelectItem>
                                        <SelectItem value="saml">
                                            SAML 2.0
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Main Configuration Tabs */}
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} >
                            <TabsList className="w-full">
                                <TabsTrigger value="config">Configuration</TabsTrigger>
                                <TabsTrigger value="mapping">Mapping</TabsTrigger>
                                <TabsTrigger value="advanced" className="gap-1.5">
                                    <Settings2 className="h-3.5 w-3.5" />
                                    Advanced
                                </TabsTrigger>
                            </TabsList>

                            {/* Configuration Tab */}
                            <TabsContent value="config" className="space-y-4 mt-4">
                                {/* Basic Settings */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Basic Information</h3>
                                        <div className="space-y-3">
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="providerId">
                                                        {localization.SSO_PROVIDER_ID || "Provider ID"}
                                                    </Label>
                                                    <Input
                                                        id="providerId"
                                                        value={providerId}
                                                        onChange={(e) => setProviderId(e.target.value)}
                                                        placeholder="my-company-sso"
                                                        required
                                                        disabled={!!dataProp}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="domain">
                                                        {localization.SSO_DOMAIN || "Domain"}
                                                    </Label>
                                                    <Input
                                                        id="domain"
                                                        value={domain}
                                                        onChange={(e) => setDomain(e.target.value)}
                                                        placeholder="example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="issuer">
                                                    {localization.SSO_ISSUER || "Issuer URL"}
                                                </Label>
                                                <Input
                                                    id="issuer"
                                                    value={issuer}
                                                    onChange={(e) => setIssuer(e.target.value)}
                                                    placeholder="https://idp.example.com"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="organizationId">
                                                    {localization.SSO_ORGANIZATION || "Organization"} 
                                                    <span className="text-muted-foreground ml-1">(Optional)</span>
                                                </Label>
                                                <Input
                                                    id="organizationId"
                                                    value={organizationId}
                                                    onChange={(e) => setOrganizationId(e.target.value)}
                                                    placeholder="org_xxxxx"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Provider-specific Configuration */}
                                    {providerType === "oidc" ? (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">OIDC Configuration</h3>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="clientId">Client ID</Label>
                                                    <Input
                                                        id="clientId"
                                                        value={clientId}
                                                        onChange={(e) => setClientId(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="clientSecret">Client Secret</Label>
                                                    <Input
                                                        id="clientSecret"
                                                        type="password"
                                                        value={clientSecret}
                                                        onChange={(e) => setClientSecret(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="authEndpoint">Authorization Endpoint</Label>
                                                    <Input
                                                        id="authEndpoint"
                                                        value={authEndpoint}
                                                        onChange={(e) => setAuthEndpoint(e.target.value)}
                                                        placeholder="https://idp.example.com/authorize"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tokenEndpoint">Token Endpoint</Label>
                                                    <Input
                                                        id="tokenEndpoint"
                                                        value={tokenEndpoint}
                                                        onChange={(e) => setTokenEndpoint(e.target.value)}
                                                        placeholder="https://idp.example.com/token"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="discoveryEndpoint">
                                                        Discovery Endpoint <span className="text-muted-foreground">(Optional)</span>
                                                    </Label>
                                                    <Input
                                                        id="discoveryEndpoint"
                                                        value={discoveryEndpoint}
                                                        onChange={(e) => setDiscoveryEndpoint(e.target.value)}
                                                        placeholder="https://idp.example.com/.well-known/openid-configuration"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="scopes">Scopes</Label>
                                                    <Input
                                                        id="scopes"
                                                        value={scopes}
                                                        onChange={(e) => setScopes(e.target.value)}
                                                        placeholder="openid email profile"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Space-separated list of OAuth scopes
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="pkce">PKCE</Label>
                                                    <Select value={pkceEnabled} onValueChange={setPkceEnabled}>
                                                        <SelectTrigger id="pkce">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">Enabled (Recommended)</SelectItem>
                                                            <SelectItem value="false">Disabled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground">
                                                        Proof Key for Code Exchange adds additional security
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">SAML Configuration</h3>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="entryPoint">SSO Entry Point</Label>
                                                    <Input
                                                        id="entryPoint"
                                                        value={entryPoint}
                                                        onChange={(e) => setEntryPoint(e.target.value)}
                                                        placeholder="https://idp.example.com/sso"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="certificate">IdP Certificate (X.509)</Label>
                                                    <Textarea
                                                        id="certificate"
                                                        value={certificate}
                                                        onChange={(e) => setCertificate(e.target.value)}
                                                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                                                        rows={5}
                                                        required
                                                        className="font-mono text-xs"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="callbackUrl">Callback URL (ACS)</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="callbackUrl"
                                                            value={callbackUrl}
                                                            onChange={(e) => setCallbackUrl(e.target.value)}
                                                            placeholder="https://yourapp.com/api/auth/sso/saml2/callback/provider-id"
                                                            required
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => copyToClipboard(callbackUrl, "callback")}
                                                        >
                                                            {copiedField === "callback" ? (
                                                                <Check className="h-4 w-4" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="entityId">
                                                        Entity ID <span className="text-muted-foreground">(Optional)</span>
                                                    </Label>
                                                    <Input
                                                        id="entityId"
                                                        value={entityId}
                                                        onChange={(e) => setEntityId(e.target.value)}
                                                        placeholder="https://yourapp.com"
                                                    />
                                                </div>

                                                {allowMetadataUpload && (
                                                    <div className="space-y-2">
                                                        <Label>IdP Metadata XML <span className="text-muted-foreground">(Optional)</span></Label>
                                                        <div className="flex gap-2">
                                                            <label htmlFor="metadata-file" className="cursor-pointer">
                                                                <Button type="button" variant="outline" size="sm" asChild>
                                                                    <span>
                                                                        <Upload className="mr-2 h-4 w-4" />
                                                                        Upload File
                                                                    </span>
                                                                </Button>
                                                                <input
                                                                    id="metadata-file"
                                                                    type="file"
                                                                    accept=".xml,text/xml"
                                                                    className="hidden"
                                                                    onChange={handleFileUpload}
                                                                />
                                                            </label>
                                                        </div>
                                                        {idpMetadataXml && (
                                                            <Textarea
                                                                value={idpMetadataXml}
                                                                onChange={(e) => setIdpMetadataXml(e.target.value)}
                                                                placeholder="<EntityDescriptor>...</EntityDescriptor>"
                                                                rows={4}
                                                                className="font-mono text-xs"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Attribute Mapping Tab */}
                            <TabsContent value="mapping" className="space-y-4 mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Map SSO provider attributes to user profile fields. Leave empty to use defaults.
                                </p>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="mapId">User ID Attribute</Label>
                                        <Input
                                            id="mapId"
                                            value={mapId}
                                            onChange={(e) => setMapId(e.target.value)}
                                            placeholder={providerType === "oidc" ? "sub" : "nameID"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapEmail">Email Attribute</Label>
                                        <Input
                                            id="mapEmail"
                                            value={mapEmail}
                                            onChange={(e) => setMapEmail(e.target.value)}
                                            placeholder="email"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapName">Full Name Attribute</Label>
                                        <Input
                                            id="mapName"
                                            value={mapName}
                                            onChange={(e) => setMapName(e.target.value)}
                                            placeholder={providerType === "oidc" ? "name" : "displayName"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapFirstName">First Name Attribute</Label>
                                        <Input
                                            id="mapFirstName"
                                            value={mapFirstName}
                                            onChange={(e) => setMapFirstName(e.target.value)}
                                            placeholder="givenName"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapLastName">Last Name Attribute</Label>
                                        <Input
                                            id="mapLastName"
                                            value={mapLastName}
                                            onChange={(e) => setMapLastName(e.target.value)}
                                            placeholder={providerType === "oidc" ? "family_name" : "surname"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapEmailVerified">Email Verified Attribute</Label>
                                        <Input
                                            id="mapEmailVerified"
                                            value={mapEmailVerified}
                                            onChange={(e) => setMapEmailVerified(e.target.value)}
                                            placeholder="email_verified"
                                        />
                                    </div>

                                    {providerType === "oidc" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="mapImage">Profile Image Attribute</Label>
                                            <Input
                                                id="mapImage"
                                                value={mapImage}
                                                onChange={(e) => setMapImage(e.target.value)}
                                                placeholder="picture"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="extraFields">Extra Fields (JSON)</Label>
                                    <Textarea
                                        id="extraFields"
                                        value={extraFieldsJson}
                                        onChange={(e) => setExtraFieldsJson(e.target.value)}
                                        placeholder='{"department": "department", "role": "role"}'
                                        rows={4}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Map additional custom attributes as JSON key-value pairs
                                    </p>
                                </div>
                            </TabsContent>

                            {/* Advanced Tab */}
                            <TabsContent value="advanced" className="space-y-4 mt-4">
                                {providerType === "oidc" ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Advanced OIDC configuration options
                                        </p>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="jwksEndpoint">JWKS Endpoint</Label>
                                            <Input
                                                id="jwksEndpoint"
                                                value={jwksEndpoint}
                                                onChange={(e) => setJwksEndpoint(e.target.value)}
                                                placeholder="https://idp.example.com/.well-known/jwks.json"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                JSON Web Key Set endpoint for token validation
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Advanced SAML security and signing options
                                        </p>

                                        <div className="space-y-2">
                                            <Label htmlFor="wantAssertionsSigned">Require Signed Assertions</Label>
                                            <Select value={wantAssertionsSigned} onValueChange={setWantAssertionsSigned}>
                                                <SelectTrigger id="wantAssertionsSigned">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Required</SelectItem>
                                                    <SelectItem value="false">Not Required</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="signatureAlgorithm">Signature Algorithm</Label>
                                                <Select value={signatureAlgorithm} onValueChange={(v) => setSignatureAlgorithm(v as any)}>
                                                    <SelectTrigger id="signatureAlgorithm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sha256">SHA-256 (Recommended)</SelectItem>
                                                        <SelectItem value="sha512">SHA-512</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="digestAlgorithm">Digest Algorithm</Label>
                                                <Select value={digestAlgorithm} onValueChange={(v) => setDigestAlgorithm(v as any)}>
                                                    <SelectTrigger id="digestAlgorithm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sha256">SHA-256 (Recommended)</SelectItem>
                                                        <SelectItem value="sha512">SHA-512</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="identifierFormat">Name ID Format</Label>
                                            <Input
                                                id="identifierFormat"
                                                value={identifierFormat}
                                                onChange={(e) => setIdentifierFormat(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                SAML NameID format identifier
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* Test Results */}
                        {testResult && (
                            <div
                                className={cn(
                                    "flex items-center gap-3 rounded-lg border p-4",
                                    testResult.success
                                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                                        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                                )}
                            >
                                {testResult.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                                <div className="flex-1">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        testResult.success
                                            ? "text-green-900 dark:text-green-100"
                                            : "text-red-900 dark:text-red-100"
                                    )}>
                                        {testResult.message || (testResult.success
                                            ? "Connection successful"
                                            : "Connection failed")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    {showActions && (
                        <CardFooter className={cn("flex flex-col gap-3 border-t pt-6", classNames?.footer)}>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end sm:items-center">
                                <div className="flex flex-wrap gap-2">
                                    {dataProp && allowDelete && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setShowDeleteDialog(true)}
                                            disabled={isLoading}
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    {dataProp && authClient?.sso?.testConnection && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleTestConnection}
                                            disabled={isTesting || !providerId}
                                            size="sm"
                                        >
                                            {isTesting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Testing...
                                                </>
                                            ) : (
                                                <>
                                                    <TestTube2 className="mr-2 h-4 w-4" />
                                                    Test Connection
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    {dataProp && providerType === "saml" && authClient?.sso?.spMetadata && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleFetchSpMetadata}
                                            disabled={!providerId}
                                            size="sm"
                                        >
                                            {copiedField === "sp-metadata" ? (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy SP Metadata
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                <Button type="submit" disabled={isLoading} size="sm" className="sm:ml-auto">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        localization.SAVE || "Save Configuration"
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </form>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete SSO Provider</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this SSO provider? Users will no longer be able to sign in using this provider. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete Provider
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
