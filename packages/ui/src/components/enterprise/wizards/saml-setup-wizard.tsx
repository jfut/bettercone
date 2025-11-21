"use client"

import * as React from "react"
import { Check, ChevronRight, ChevronLeft, Upload, FileText, Settings, Link2, TestTube2, AlertCircle, Info, Copy, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Stepper, type Step } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * SAML attribute mapping configuration
 * Maps SAML assertion attributes to user model fields
 */
export interface SAMLAttributeMapping {
  /** User ID (typically nameID) */
  id?: string
  /** Email address attribute */
  email?: string
  /** Email verified status attribute */
  emailVerified?: string
  /** Full name attribute */
  name?: string
  /** First/given name attribute */
  firstName?: string
  /** Last/family name attribute */
  lastName?: string
  /** Profile image/picture URL attribute */
  image?: string
  /** Custom additional attributes */
  extraFields?: Record<string, string>
}

/**
 * Complete SAML configuration
 */
export interface SAMLConfiguration {
  /** SSO entry point URL (IdP initiated login) */
  entryPoint: string
  /** X.509 certificate for signature verification (PEM format) */
  cert: string
  /** Assertion Consumer Service (ACS) URL - your callback endpoint */
  callbackUrl: string
  /** Expected audience (entity ID) */
  audience?: string
  /** Entity ID for your service provider */
  entityId?: string
  /** Require signed SAML assertions */
  wantAssertionsSigned?: boolean
  /** Signature algorithm */
  signatureAlgorithm?: "sha1" | "sha256" | "sha512"
  /** Digest algorithm */
  digestAlgorithm?: "sha1" | "sha256" | "sha512"
  /** NameID format */
  identifierFormat?: string
  /** Attribute mapping configuration */
  mapping?: SAMLAttributeMapping
}

/**
 * Known SAML Identity Provider presets
 */
interface SAMLIdPPreset {
  id: string
  name: string
  logo?: string
  description: string
  metadataUrl?: string
  defaultConfig?: Partial<SAMLConfiguration>
}

/**
 * Props for SAMLSetupWizard component
 */
export interface SAMLSetupWizardProps {
  /** Better Auth client instance (optional - uses context if not provided) */
  authClient?: {
    sso?: {
      createProvider?: (config: SAMLConfiguration) => Promise<unknown>
      testConnection?: (providerId: string) => Promise<{ success: boolean; error?: string }>
    }
  }
  /** Organization ID to scope this SSO configuration */
  organizationId?: string
  /** Initial SAML configuration (for editing existing provider) */
  initialConfig?: Partial<SAMLConfiguration>
  /** Called when setup completes successfully */
  onSuccess?: (config: SAMLConfiguration) => void
  /** Called on errors */
  onError?: (error: Error) => void
  /** Called when wizard is cancelled */
  onCancel?: () => void
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// IDENTITY PROVIDER PRESETS
// ============================================================================

const SAML_IDP_PRESETS: SAMLIdPPreset[] = [
  {
    id: "azure-ad",
    name: "Azure Active Directory",
    description: "Microsoft Azure AD / Entra ID",
    metadataUrl: "https://login.microsoftonline.com/{tenant-id}/federationmetadata/2007-06/federationmetadata.xml",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        firstName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        lastName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
      },
    },
  },
  {
    id: "okta",
    name: "Okta",
    description: "Okta Identity Platform",
    metadataUrl: "https://{your-domain}.okta.com/app/{app-id}/sso/saml/metadata",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "email",
        name: "displayName",
        firstName: "firstName",
        lastName: "lastName",
      },
    },
  },
  {
    id: "google",
    name: "Google Workspace",
    description: "Google Workspace SAML SSO",
    metadataUrl: "https://accounts.google.com/o/saml2/idp?idpid={idp-id}",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "email",
        name: "displayName",
        firstName: "firstName",
        lastName: "lastName",
      },
    },
  },
  {
    id: "onelogin",
    name: "OneLogin",
    description: "OneLogin Identity Platform",
    metadataUrl: "https://app.onelogin.com/saml/metadata/{app-id}",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "User.email",
        name: "User.DisplayName",
        firstName: "User.FirstName",
        lastName: "User.LastName",
      },
    },
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Auth0 SAML Provider",
    metadataUrl: "https://{your-domain}.auth0.com/samlp/metadata/{client-id}",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "email",
        name: "name",
        firstName: "given_name",
        lastName: "family_name",
      },
    },
  },
  {
    id: "jumpcloud",
    name: "JumpCloud",
    description: "JumpCloud Directory Platform",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "email",
        name: "displayName",
        firstName: "firstname",
        lastName: "lastname",
      },
    },
  },
  {
    id: "custom",
    name: "Custom SAML Provider",
    description: "Configure manually for other providers",
    defaultConfig: {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      mapping: {
        id: "nameID",
        email: "email",
        name: "name",
      },
    },
  },
]

// ============================================================================
// COMPONENT
// ============================================================================

export const SAMLSetupWizard = ({
  authClient,
  organizationId,
  initialConfig,
  onSuccess,
  onError,
  onCancel,
  className,
}: SAMLSetupWizardProps) => {
  // State: Current wizard step (1-5)
  const [currentStep, setCurrentStep] = React.useState(1)
  
  // State: Track completed steps
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  
  // State: Selected IdP preset
  const [selectedIdP, setSelectedIdP] = React.useState<string>("")
  
  // State: SAML configuration
  const [config, setConfig] = React.useState<Partial<SAMLConfiguration>>(
    initialConfig || {
      signatureAlgorithm: "sha256",
      digestAlgorithm: "sha256",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      wantAssertionsSigned: true,
      callbackUrl: "https://yourapp.com/api/auth/sso/saml2/callback",
      entityId: "https://yourapp.com",
    }
  )
  
  // State: Metadata XML
  const [metadataXML, setMetadataXML] = React.useState("")
  
  // State: Loading & error states
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string>("")
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null)
  
  // State: Copied states
  const [copiedACS, setCopiedACS] = React.useState(false)
  const [copiedEntity, setCopiedEntity] = React.useState(false)

  // Wizard steps configuration
  const steps: Step[] = [
    {
      id: 1,
      title: "Select Identity Provider",
      description: "Choose your SAML IdP",
      completed: completedSteps.has(1) && currentStep > 1,
    },
    {
      id: 2,
      title: "Upload Metadata",
      description: "Provide IdP metadata",
      completed: completedSteps.has(2) && currentStep > 2,
    },
    {
      id: 3,
      title: "Configure Settings",
      description: "Set SAML parameters",
      completed: completedSteps.has(3) && currentStep > 3,
    },
    {
      id: 4,
      title: "Attribute Mapping",
      description: "Map user attributes",
      completed: completedSteps.has(4) && currentStep > 4,
    },
    {
      id: 5,
      title: "Test & Complete",
      description: "Verify and finish",
      completed: completedSteps.has(5) && currentStep > 5,
    },
  ]

  // Auto-populate config when IdP is selected
  const handleIdPSelect = (idpId: string) => {
    setSelectedIdP(idpId)
    const preset = SAML_IDP_PRESETS.find((p) => p.id === idpId)
    if (preset?.defaultConfig) {
      setConfig((prev) => ({
        ...prev,
        ...preset.defaultConfig,
      }))
    }
  }

  // Parse SAML metadata XML
  const handleMetadataUpload = (xml: string) => {
    setMetadataXML(xml)
    try {
      // Extract entryPoint (SSO URL) - look for Location in SingleSignOnService
      const ssoMatch = xml.match(/<SingleSignOnService[^>]*Location="([^"]+)"/i)
      if (ssoMatch) {
        setConfig((prev) => ({ ...prev, entryPoint: ssoMatch[1] }))
      }

      // Extract certificate
      const certMatch = xml.match(/<X509Certificate>([^<]+)<\/X509Certificate>/i)
      if (certMatch) {
        const cert = certMatch[1].replace(/\s/g, "")
        const formattedCert = `-----BEGIN CERTIFICATE-----\n${cert.match(/.{1,64}/g)?.join("\n")}\n-----END CERTIFICATE-----`
        setConfig((prev) => ({ ...prev, cert: formattedCert }))
      }

      // Extract entityID
      const entityMatch = xml.match(/entityID="([^"]+)"/i)
      if (entityMatch) {
        setConfig((prev) => ({ ...prev, audience: entityMatch[1] }))
      }

      setError("")
    } catch (err) {
      setError("Failed to parse metadata XML. Please check the format.")
    }
  }

  // Test SAML connection
  const handleTestConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      // Validate required fields
      if (!config.entryPoint || !config.cert || !config.callbackUrl) {
        throw new Error("Missing required fields: entryPoint, cert, or callbackUrl")
      }

      // If authClient is provided, use it to test
      if (authClient?.sso?.testConnection) {
        const result = await authClient.sso.testConnection("temp-test-id")
        setTestResult({
          success: result.success,
          message: result.success 
            ? "SAML configuration is valid!" 
            : result.error || "Connection test failed",
        })
        
        // Mark step 5 as completed if test succeeds
        if (result.success) {
          setCompletedSteps((prev) => new Set(prev).add(5))
        }
      } else {
        // Basic validation without actual connection test
        setTestResult({
          success: true,
          message: "Configuration appears valid (no connection test available)",
        })
        // Mark step 5 as completed
        setCompletedSteps((prev) => new Set(prev).add(5))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setTestResult({
        success: false,
        message: errorMessage,
      })
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  // Complete wizard
  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Validate complete config
      if (!config.entryPoint || !config.cert || !config.callbackUrl) {
        throw new Error("Missing required SAML configuration")
      }

      const completeConfig: SAMLConfiguration = {
        entryPoint: config.entryPoint,
        cert: config.cert,
        callbackUrl: config.callbackUrl,
        audience: config.audience,
        entityId: config.entityId,
        wantAssertionsSigned: config.wantAssertionsSigned,
        signatureAlgorithm: config.signatureAlgorithm,
        digestAlgorithm: config.digestAlgorithm,
        identifierFormat: config.identifierFormat,
        mapping: config.mapping,
      }

      // If authClient is provided, create provider
      if (authClient?.sso?.createProvider) {
        await authClient.sso.createProvider(completeConfig)
      }

      onSuccess?.(completeConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete setup"
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  // Copy to clipboard helpers
  const copyToClipboard = (text: string, type: "acs" | "entity") => {
    navigator.clipboard.writeText(text)
    if (type === "acs") {
      setCopiedACS(true)
      setTimeout(() => setCopiedACS(false), 2000)
    } else {
      setCopiedEntity(true)
      setTimeout(() => setCopiedEntity(false), 2000)
    }
  }

  // Navigate steps
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step)
      setError("")
    }
  }

  // Validate if current step can proceed
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedIdP
      case 2:
        return !!config.entryPoint && !!config.cert
      case 3:
        // Step 3 shows callbackUrl (always has default) - just ensure it exists
        return !!config.callbackUrl
      case 4:
        return !!config.mapping?.email
      case 5:
        return testResult?.success || false
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 5 && canProceedFromStep(currentStep)) {
      // Mark current step as completed before moving to next
      setCompletedSteps((prev) => new Set(prev).add(currentStep))
      setCurrentStep(currentStep + 1)
      setError("")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError("")
    }
  }

  // ============================================================================
  // RENDER: Step Content
  // ============================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      // STEP 1: Select Identity Provider
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Identity Provider</h3>
              <p className="text-sm text-muted-foreground">
                Select your SAML provider. We'll pre-configure the optimal settings for you.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SAML_IDP_PRESETS.map((idp) => (
                <Card
                  key={idp.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedIdP === idp.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => handleIdPSelect(idp.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{idp.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {idp.description}
                        </CardDescription>
                      </div>
                      {selectedIdP === idp.id && (
                        <div className="flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {idp.metadataUrl && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {idp.metadataUrl}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {selectedIdP && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>{SAML_IDP_PRESETS.find((p) => p.id === selectedIdP)?.name}</strong> selected. 
                  Click Continue to proceed.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      // STEP 2: Upload Metadata
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Import SAML Metadata</h3>
              <p className="text-sm text-muted-foreground">
                Paste your IdP metadata XML to auto-configure, or enter settings manually.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  SAML Metadata XML
                </CardTitle>
                <CardDescription>
                  Download from your IdP's admin console or metadata endpoint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="metadata-xml"
                  placeholder="<EntityDescriptor xmlns=...>"
                  value={metadataXML}
                  onChange={(e) => handleMetadataUpload(e.target.value)}
                  rows={8}
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Or configure manually</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entry-point">
                  SSO Entry Point URL
                  <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="entry-point"
                  placeholder="https://idp.example.com/saml2/sso"
                  value={config.entryPoint || ""}
                  onChange={(e) => setConfig((prev) => ({ ...prev, entryPoint: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert">
                  X.509 Certificate (PEM)
                  <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Textarea
                  id="cert"
                  placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDdzCCAl+gAwIBAgIE...&#10;-----END CERTIFICATE-----"
                  value={config.cert || ""}
                  onChange={(e) => setConfig((prev) => ({ ...prev, cert: e.target.value }))}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience / Entity ID</Label>
                <Input
                  id="audience"
                  placeholder="https://yourapp.com"
                  value={config.audience || ""}
                  onChange={(e) => setConfig((prev) => ({ ...prev, audience: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )

      // STEP 3: Configure Settings
      case 3:
        const acsUrl = config.callbackUrl || "https://yourapp.com/api/auth/sso/saml2/callback"
        const spEntityId = config.entityId || "https://yourapp.com"

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Configure SAML Settings</h3>
              <p className="text-sm text-muted-foreground">
                Provide these URLs to your IdP and configure security settings.
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Copy these URLs to your Identity Provider's SAML application settings
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Provider URLs</CardTitle>
                <CardDescription>Configure these in your IdP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assertion Consumer Service (ACS) URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={acsUrl}
                      onChange={(e) => setConfig((prev) => ({ ...prev, callbackUrl: e.target.value }))}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(acsUrl, "acs")}
                    >
                      {copiedACS ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Provider Entity ID</Label>
                  <div className="flex gap-2">
                    <Input
                      value={spEntityId}
                      onChange={(e) => setConfig((prev) => ({ ...prev, entityId: e.target.value }))}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(spEntityId, "entity")}
                    >
                      {copiedEntity ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Security Settings</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signature-algorithm">Signature Algorithm</Label>
                  <Select
                    value={config.signatureAlgorithm || "sha256"}
                    onValueChange={(value: "sha1" | "sha256" | "sha512") =>
                      setConfig((prev) => ({ ...prev, signatureAlgorithm: value }))
                    }
                  >
                    <SelectTrigger id="signature-algorithm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sha256">SHA-256 (Recommended)</SelectItem>
                      <SelectItem value="sha512">SHA-512</SelectItem>
                      <SelectItem value="sha1">SHA-1 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="digest-algorithm">Digest Algorithm</Label>
                  <Select
                    value={config.digestAlgorithm || "sha256"}
                    onValueChange={(value: "sha1" | "sha256" | "sha512") =>
                      setConfig((prev) => ({ ...prev, digestAlgorithm: value }))
                    }
                  >
                    <SelectTrigger id="digest-algorithm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sha256">SHA-256 (Recommended)</SelectItem>
                      <SelectItem value="sha512">SHA-512</SelectItem>
                      <SelectItem value="sha1">SHA-1 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier-format">NameID Format</Label>
                <Select
                  value={config.identifierFormat || "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, identifierFormat: value }))
                  }
                >
                  <SelectTrigger id="identifier-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
                      Email Address
                    </SelectItem>
                    <SelectItem value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">
                      Persistent
                    </SelectItem>
                    <SelectItem value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">
                      Transient
                    </SelectItem>
                    <SelectItem value="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
                      Unspecified
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="want-signed">Require Signed Assertions</Label>
                <Select
                  value={config.wantAssertionsSigned ? "true" : "false"}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, wantAssertionsSigned: value === "true" }))
                  }
                >
                  <SelectTrigger id="want-signed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes (Recommended)</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Digitally signed assertions for enhanced security
                </p>
              </div>
            </div>
          </div>
        )

      // STEP 4: Attribute Mapping
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Map User Attributes</h3>
              <p className="text-sm text-muted-foreground">
                Specify SAML attribute names that map to user fields. These are attribute names, not values.
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Enter attribute names from your IdP's SAML response (e.g., "email", "givenName"). 
                Check your IdP documentation for exact names.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Standard Attributes</CardTitle>
                <CardDescription>Basic user profile fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="map-id">User ID</Label>
                    <Input
                      id="map-id"
                      placeholder="nameID"
                      value={config.mapping?.id || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, id: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="map-email">
                      Email Address
                      <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                    </Label>
                    <Input
                      id="map-email"
                      placeholder="email"
                      value={config.mapping?.email || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, email: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="map-first-name">First Name</Label>
                    <Input
                      id="map-first-name"
                      placeholder="givenName"
                      value={config.mapping?.firstName || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, firstName: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="map-last-name">Last Name</Label>
                    <Input
                      id="map-last-name"
                      placeholder="surname"
                      value={config.mapping?.lastName || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, lastName: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="map-name">Full Name</Label>
                    <Input
                      id="map-name"
                      placeholder="displayName"
                      value={config.mapping?.name || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, name: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="map-image">Profile Picture</Label>
                    <Input
                      id="map-image"
                      placeholder="picture"
                      value={config.mapping?.image || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mapping: { ...prev.mapping, image: e.target.value },
                        }))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Attributes (Optional)</CardTitle>
                <CardDescription>Organization-specific fields as JSON</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={'{\n  "department": "dept",\n  "employeeId": "empId"\n}'}
                  value={
                    config.mapping?.extraFields
                      ? JSON.stringify(config.mapping.extraFields, null, 2)
                      : ""
                  }
                  onChange={(e) => {
                    try {
                      const extraFields = e.target.value ? JSON.parse(e.target.value) : {}
                      setConfig((prev) => ({
                        ...prev,
                        mapping: { ...prev.mapping, extraFields },
                      }))
                      setError("")
                    } catch {
                      setError("Invalid JSON format for custom attributes")
                    }
                  }}
                  rows={5}
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>
          </div>
        )

      // STEP 5: Test & Complete
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review & Test Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Verify your setup and test the connection before completing.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration Summary</CardTitle>
                <CardDescription>Review your SAML settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Provider</span>
                    <Badge variant="outline">
                      {SAML_IDP_PRESETS.find((p) => p.id === selectedIdP)?.name || "Custom"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SSO Entry Point</span>
                    <code className="text-xs">{config.entryPoint ? "✓" : "✗"}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Callback URL</span>
                    <code className="text-xs">{config.callbackUrl ? "✓" : "✗"}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate</span>
                    <Badge variant={config.cert ? "default" : "destructive"}>
                      {config.cert ? "Configured" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Mapping</span>
                    <code className="text-xs">{config.mapping?.email || "-"}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TestTube2 className="h-4 w-4" />
                  Connection Test
                </CardTitle>
                <CardDescription>Test SAML configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isLoading || !config.entryPoint || !config.cert}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    "Testing..."
                  ) : (
                    <>
                      <TestTube2 className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>

                {testResult && (
                  <Alert variant={testResult.success ? "default" : "destructive"}>
                    {testResult.success ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{testResult.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Ensure ACS URL and Entity ID are configured in your IdP before testing
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  // ============================================================================
  // RENDER: Main Component
  // ============================================================================

  return (
    <Card className={cn("w-full mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">SAML 2.0 Setup Wizard</Badge>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <CardTitle>
          {steps[currentStep - 1]?.title}
        </CardTitle>
        <CardDescription>
          {steps[currentStep - 1]?.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 ">
        {/* Progress Stepper */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
          variant="controlled"
        />

        <Separator />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isLoading || !canProceedFromStep(currentStep)}
              className="flex-1 sm:flex-none"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleComplete}
              disabled={isLoading || !testResult?.success}
              className="flex-1 sm:flex-none"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default SAMLSetupWizard
