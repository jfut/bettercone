/**
 * passkey-setup-wizard
 * Step-by-step passkey registration wizard for Better Auth
 * Enhanced for @bettercone/ui
 */

"use client"

import { CheckCircle2, Fingerprint, Key, Loader2, ShieldCheck } from "lucide-react"
import { useContext, useState } from "react"
import { AuthUIContext } from "@/lib/auth-ui-provider"
import { cn, getLocalizedError } from "@/lib/utils"
import type { AuthLocalization } from "@/localization/auth-localization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type WizardStep = "intro" | "name" | "type" | "register" | "success"

export interface PasskeySetupWizardProps {
    className?: string
    classNames?: {
        card?: string
        header?: string
        title?: string
        description?: string
        content?: string
        footer?: string
        button?: string
        input?: string
        label?: string
        error?: string
        step?: string
        stepIcon?: string
        stepText?: string
    }
    localization?: Partial<AuthLocalization>
    onSuccess?: () => void
    onCancel?: () => void
    defaultName?: string
    defaultType?: "platform" | "cross-platform"
}

export function PasskeySetupWizard({
    className,
    classNames,
    localization: localizationProp,
    onSuccess,
    onCancel,
    defaultName,
    defaultType = "platform"
}: PasskeySetupWizardProps) {
    const {
        authClient,
        hooks: { useSession },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp } as any

    const { data: sessionData } = useSession()
    const [currentStep, setCurrentStep] = useState<WizardStep>("intro")
    const [passkeyName, setPasskeyName] = useState(
        defaultName || sessionData?.user.email || sessionData?.user.name || ""
    )
    const [authenticatorType, setAuthenticatorType] = useState<"platform" | "cross-platform">(defaultType)
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState<string>()

    const handleRegister = async () => {
        setIsRegistering(true)
        setError(undefined)

        try {
            const result = await authClient.passkey.addPasskey({
                name: passkeyName || undefined,
                authenticatorAttachment: authenticatorType
            })

            if (result.error) {
                setError(getLocalizedError({ error: result.error, localization }))
                setIsRegistering(false)
                return
            }

            toast({
                variant: "success",
                message: "Passkey registered successfully!"
            })

            setCurrentStep("success")
            setIsRegistering(false)
        } catch (err) {
            setError(getLocalizedError({ error: err, localization }))
            setIsRegistering(false)
        }
    }

    const handleFinish = () => {
        onSuccess?.()
    }

    const handleCancel = () => {
        onCancel?.()
    }

    const renderStep = () => {
        switch (currentStep) {
            case "intro":
                return (
                    <>
                        <CardHeader className={classNames?.header}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <ShieldCheck className={cn("h-6 w-6 text-primary", classNames?.stepIcon)} />
                                </div>
                                <div>
                                    <CardTitle className={classNames?.title}>
                                        {localization.PASSKEY_SETUP_TITLE || "Set Up Passkey"}
                                    </CardTitle>
                                    <CardDescription className={classNames?.description}>
                                        {localization.PASSKEY_SETUP_DESCRIPTION || "Secure your account with passwordless authentication"}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className={cn("space-y-4", classNames?.content)}>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">
                                            {localization.PASSKEY_BENEFIT_1_TITLE || "Passwordless Login"}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {localization.PASSKEY_BENEFIT_1_DESC || "Sign in with your fingerprint, face, or PIN"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">
                                            {localization.PASSKEY_BENEFIT_2_TITLE || "Enhanced Security"}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {localization.PASSKEY_BENEFIT_2_DESC || "Phishing-resistant authentication using WebAuthn"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">
                                            {localization.PASSKEY_BENEFIT_3_TITLE || "Faster Access"}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {localization.PASSKEY_BENEFIT_3_DESC || "Quick authentication without typing passwords"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className={cn("flex justify-between", classNames?.footer)}>
                            {onCancel && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className={classNames?.button}
                                >
                                    {localization.CANCEL || "Cancel"}
                                </Button>
                            )}
                            <Button
                                onClick={() => setCurrentStep("name")}
                                className={cn("ml-auto", classNames?.button)}
                            >
                                {localization.GET_STARTED || "Get Started"}
                            </Button>
                        </CardFooter>
                    </>
                )

            case "name":
                return (
                    <>
                        <CardHeader className={classNames?.header}>
                            <CardTitle className={classNames?.title}>
                                {localization.PASSKEY_NAME_TITLE || "Name Your Passkey"}
                            </CardTitle>
                            <CardDescription className={classNames?.description}>
                                {localization.PASSKEY_NAME_DESCRIPTION || "Choose a memorable name to identify this passkey"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={cn("space-y-4", classNames?.content)}>
                            <div className="space-y-2">
                                <Label htmlFor="passkey-name" className={classNames?.label}>
                                    {localization.PASSKEY_NAME || "Passkey Name"}
                                </Label>
                                <Input
                                    id="passkey-name"
                                    type="text"
                                    placeholder={localization.PASSKEY_NAME_PLACEHOLDER || "e.g., My iPhone, Work Laptop"}
                                    value={passkeyName}
                                    onChange={(e) => setPasskeyName(e.target.value)}
                                    className={classNames?.input}
                                />
                                <p className="text-muted-foreground text-xs">
                                    {localization.PASSKEY_NAME_HINT || "This helps you identify which device or authenticator you're using"}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className={cn("flex justify-between", classNames?.footer)}>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("intro")}
                                className={classNames?.button}
                            >
                                {localization.BACK || "Back"}
                            </Button>
                            <Button
                                onClick={() => setCurrentStep("type")}
                                className={classNames?.button}
                            >
                                {localization.NEXT || "Next"}
                            </Button>
                        </CardFooter>
                    </>
                )

            case "type":
                return (
                    <>
                        <CardHeader className={classNames?.header}>
                            <CardTitle className={classNames?.title}>
                                Choose Authenticator Type
                            </CardTitle>
                            <CardDescription className={classNames?.description}>
                                Select how you want to authenticate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={cn("space-y-4", classNames?.content)}>
                            <RadioGroup
                                value={authenticatorType}
                                onValueChange={(value: "platform" | "cross-platform") => setAuthenticatorType(value)}
                                className="grid gap-3"
                            >
                                <Label
                                    htmlFor="platform"
                                    className={cn(
                                        "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                        authenticatorType === "platform" && "border-primary bg-primary/5"
                                    )}
                                >
                                    <RadioGroupItem value="platform" id="platform" className="mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Fingerprint className="h-5 w-5 text-primary" />
                                            <span className="font-medium">This Device</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            Use built-in biometrics like Face ID, Touch ID, or Windows Hello
                                        </p>
                                    </div>
                                </Label>
                                <Label
                                    htmlFor="cross-platform"
                                    className={cn(
                                        "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                        authenticatorType === "cross-platform" && "border-primary bg-primary/5"
                                    )}
                                >
                                    <RadioGroupItem value="cross-platform" id="cross-platform" className="mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Key className="h-5 w-5 text-primary" />
                                            <span className="font-medium">Security Key</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            Use a physical security key like YubiKey or other FIDO2 device
                                        </p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </CardContent>
                        <CardFooter className={cn("flex justify-between", classNames?.footer)}>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("name")}
                                className={classNames?.button}
                            >
                                {localization.SIGN_IN_BACK || "Back"}
                            </Button>
                            <Button
                                onClick={() => setCurrentStep("register")}
                                className={classNames?.button}
                            >
                                Next
                            </Button>
                        </CardFooter>
                    </>
                )

            case "register":
                return (
                    <>
                        <CardHeader className={classNames?.header}>
                            <CardTitle className={classNames?.title}>
                                {localization.PASSKEY_REGISTER_TITLE || "Register Your Passkey"}
                            </CardTitle>
                            <CardDescription className={classNames?.description}>
                                {localization.PASSKEY_REGISTER_DESCRIPTION || "Click the button below to complete registration"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={cn("space-y-4", classNames?.content)}>
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{localization.PASSKEY_NAME || "Name"}:</span>
                                    <span className="text-muted-foreground">{passkeyName || localization.UNNAMED || "Unnamed"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{localization.PASSKEY_TYPE || "Type"}:</span>
                                    <span className="text-muted-foreground">
                                        {authenticatorType === "platform"
                                            ? localization.PASSKEY_TYPE_PLATFORM || "This Device"
                                            : localization.PASSKEY_TYPE_CROSS_PLATFORM || "Security Key"}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className={cn("text-destructive text-sm", classNames?.error)}>
                                    {error}
                                </div>
                            )}

                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <p className="text-sm">
                                    {authenticatorType === "platform"
                                        ? localization.PASSKEY_REGISTER_HINT_PLATFORM || "You'll be prompted to use your device's biometric authentication (fingerprint, face recognition, or PIN)."
                                        : localization.PASSKEY_REGISTER_HINT_CROSS_PLATFORM || "Insert your security key when prompted and follow the on-screen instructions."}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className={cn("flex justify-between", classNames?.footer)}>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("type")}
                                disabled={isRegistering}
                                className={classNames?.button}
                            >
                                {localization.BACK || "Back"}
                            </Button>
                            <Button
                                onClick={handleRegister}
                                disabled={isRegistering}
                                className={classNames?.button}
                            >
                                {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isRegistering
                                    ? localization.PASSKEY_REGISTERING || "Registering..."
                                    : localization.PASSKEY_REGISTER || "Register Passkey"}
                            </Button>
                        </CardFooter>
                    </>
                )

            case "success":
                return (
                    <>
                        <CardHeader className={classNames?.header}>
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <CheckCircle2 className={cn("h-8 w-8 text-primary", classNames?.stepIcon)} />
                                </div>
                                <div>
                                    <CardTitle className={classNames?.title}>
                                        {localization.PASSKEY_SUCCESS_TITLE || "Passkey Registered!"}
                                    </CardTitle>
                                    <CardDescription className={classNames?.description}>
                                        {localization.PASSKEY_SUCCESS_DESCRIPTION || "Your passkey has been successfully registered"}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className={cn("space-y-4", classNames?.content)}>
                            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                <p className="text-sm">
                                    {localization.PASSKEY_SUCCESS_MESSAGE || "You can now use your passkey to sign in quickly and securely without a password."}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className={cn("flex justify-center", classNames?.footer)}>
                            <Button
                                onClick={handleFinish}
                                className={classNames?.button}
                            >
                                {localization.DONE || "Done"}
                            </Button>
                        </CardFooter>
                    </>
                )
        }
    }

    return (
        <Card className={cn("w-full max-w-2xl", className, classNames?.card)}>
            {renderStep()}
        </Card>
    )
}
