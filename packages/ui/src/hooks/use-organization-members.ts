import type { Member } from "better-auth/plugins/organization"
import { useContext, useMemo } from "react"
import { AuthUIContext } from "../lib/auth-ui-provider"

export function useOrganizationMembers({
    organizationId
}: {
    organizationId?: string
} = {}) {
    const { hooks } = useContext(AuthUIContext)

    const {
        data,
        isPending,
        refetch
    } = hooks.useListMembers({
        query: organizationId ? { organizationId } : undefined
    })

    return useMemo(
        () => ({
            data: data?.members as (Member & { user?: any })[] | undefined,
            isPending,
            refetch
        }),
        [data, isPending, refetch]
    )
}