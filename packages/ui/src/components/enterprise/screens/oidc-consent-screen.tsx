"use client"

import { useContext, useState, useEffect } from "react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function OIDCConsentScreen() {
    const { authClient } = useContext(AuthUIContext)
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState<{
        consentCode: string | null
        clientId: string | null
        scopes: string[]
    }>({ consentCode: null, clientId: null, scopes: [] })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search)
            const consentCode = searchParams.get("consent_code")
            const clientId = searchParams.get("client_id")
            const scopeString = searchParams.get("scope")

            if (!consentCode) {
                setError("Missing consent code")
            }

            setParams({
                consentCode,
                clientId,
                scopes: scopeString ? scopeString.split(" ") : []
            })
        }
    }, [])

    const handleAccept = async () => {
        if (!params.consentCode) return
        setLoading(true)
        try {
            // @ts-ignore - oauth2 property exists on better-auth client but might not be in context type yet
            await authClient.oauth2.consent({
                consent_code: params.consentCode,
                accept: true
            })
            // Redirect is usually handled by the SDK/Backend after consent
        } catch (error) {
            console.error("Failed to accept consent", error)
            setError("Failed to accept consent")
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!params.consentCode) return
        setLoading(true)
        try {
            // @ts-ignore
            await authClient.oauth2.consent({
                consent_code: params.consentCode,
                accept: false
            })
        } catch (error) {
            console.error("Failed to reject consent", error)
            setError("Failed to reject consent")
        } finally {
            setLoading(false)
        }
    }

    if (error) {
        return (
            <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-900/10">
                <CardContent className="pt-6 text-center text-red-600 dark:text-red-400">
                    {error}
                </CardContent>
            </Card>
        )
    }

    if (!params.consentCode) return null // Wait for hydration/params

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Authorize Application</CardTitle>
                <CardDescription>
                    <strong>{params.clientId || "An application"}</strong> wants to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">This application requests access to:</p>
                <ul className="space-y-2">
                    {params.scopes.map((scope) => (
                        <li key={scope} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="font-medium">{scope}</span>
                        </li>
                    ))}
                    {params.scopes.length === 0 && (
                        <li className="text-sm text-muted-foreground italic">No specific scopes requested</li>
                    )}
                </ul>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <Button variant="outline" onClick={handleReject} disabled={loading} className="w-full">
                    Cancel
                </Button>
                <Button onClick={handleAccept} disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Authorize
                </Button>
            </CardFooter>
        </Card>
    )
}
