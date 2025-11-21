/**
 * form-error
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import { AlertCircle } from "lucide-react"
import { useFormState } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { AuthFormClassNames } from "@/components/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export interface FormErrorProps {
    title?: string
    classNames?: AuthFormClassNames
}

export function FormError({ title, classNames }: FormErrorProps) {
    const { errors } = useFormState()

    if (!errors.root?.message) return null

    return (
        <Alert variant="destructive" className={cn(classNames?.error)}>
            <AlertCircle className="self-center" />
            <AlertTitle>{title || "Error"}</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
    )
}
