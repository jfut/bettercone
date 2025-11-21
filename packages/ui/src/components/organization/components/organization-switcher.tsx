/**
 * organization-switcher
 * Adapted from @daveyplate/better-auth-ui
 * Enhanced for @bettercone/ui
 */

"use client"

import type { Organization } from "better-auth/plugins/organization"
import {
    ChevronsUpDown,
    LogInIcon,
    Plus,
    PlusCircleIcon,
    SettingsIcon
} from "lucide-react"
import {
    type ComponentProps,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react"

import { useCurrentOrganization } from "../../../hooks/use-current-organization"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import type { User } from "../../../types/auth-client"
import { Button } from "../../ui/button"


import { UserAvatar, type UserAvatarClassNames } from "../../user"
import type { UserViewClassNames } from "../../ui/user-view"
import { CreateOrganizationDialog } from "../dialogs/create-organization-dialog"
import {
    OrganizationCellView,
    type OrganizationViewClassNames
} from "../cells/organization-cell-view"
import { OrganizationLogo } from "./organization-logo"
import { PersonalAccountView } from "../views/personal-account-view"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"

export interface OrganizationSwitcherClassNames {
    base?: string
    skeleton?: string
    trigger?: {
        base?: string
        avatar?: UserAvatarClassNames
        user?: UserViewClassNames
        organization?: OrganizationViewClassNames
        skeleton?: string
    }
    content?: {
        base?: string
        user?: UserViewClassNames
        organization?: OrganizationViewClassNames
        avatar?: UserAvatarClassNames
        menuItem?: string
        separator?: string
    }
}

export interface OrganizationSwitcherProps
    extends Omit<ComponentProps<typeof Button>, "trigger"> {
    classNames?: OrganizationSwitcherClassNames
    align?: "center" | "start" | "end"
    alignOffset?: number
    side?: "top" | "right" | "bottom" | "left"
    sideOffset?: number
    trigger?: ReactNode
    localization?: AuthLocalization
    slug?: string
    onSetActive?: (organization: Organization | null) => void
    /**
     * Hide the personal organization option from the switcher.
     * When true, users can only switch between organizations and cannot access their personal account.
     * If no organization is active, the first available organization will be automatically selected.
     * @default false
     */
    hidePersonal?: boolean
}

/**
 * Displays an interactive user button with dropdown menu functionality
 *
 * Renders a user interface element that can be displayed as either an icon or full button:
 * - Shows a user avatar or placeholder when in icon mode
 * - Displays user name and email with dropdown indicator in full mode
 * - Provides dropdown menu with authentication options (sign in/out, settings, etc.)
 * - Supports multi-session functionality for switching between accounts
 * - Can be customized with additional links and styling options
 */
export function OrganizationSwitcher({
    className,
    classNames,
    align,
    alignOffset,
    side,
    sideOffset,
    trigger,
    localization: localizationProp,
    slug: slugProp,
    size,
    onSetActive,
    hidePersonal,
    ...props
}: OrganizationSwitcherProps) {
    const {
        authClient,
        basePath,
        hooks: { useSession, useListOrganizations },
        localization: contextLocalization,
        account: accountOptions,
        organization: organizationOptions,
        redirectTo,
        navigate,
        toast,
        viewPaths,
        Link
    } = useContext(AuthUIContext)

    const {
        pathMode,
        slug: contextSlug,
        personalPath
    } = organizationOptions || {}

    const slug = slugProp || contextSlug

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const [activeOrganizationPending, setActiveOrganizationPending] =
        useState(false)
    const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const { data: sessionData, isPending: sessionPending } = useSession()
    const user = sessionData?.user

    const { data: organizations, isPending: organizationsPending } =
        useListOrganizations()

    const {
        data: activeOrganization,
        isPending: organizationPending,
        isRefetching: organizationRefetching,
        refetch: organizationRefetch
    } = useCurrentOrganization({ slug })

    const isPending =
        organizationsPending ||
        sessionPending ||
        activeOrganizationPending ||
        organizationPending

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (organizationRefetching) return

        setActiveOrganizationPending(false)
    }, [activeOrganization, organizationRefetching])

    const switchOrganization = useCallback(
        async (organization: Organization | null) => {
            // Prevent switching to personal account when hidePersonal is true
            if (hidePersonal && organization === null) {
                return
            }

            if (pathMode === "slug") {
                if (organization) {
                    navigate(
                        `${organizationOptions?.basePath}/${organization.slug}`
                    )
                } else {
                    navigate(personalPath ?? redirectTo)
                }

                return
            }

            setActiveOrganizationPending(true)

            try {
                onSetActive?.(organization)

                await authClient.organization.setActive({
                    organizationId: organization?.id || null,
                    fetchOptions: {
                        throw: true
                    }
                })

                organizationRefetch?.()
            } catch (error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error, localization })
                })

                setActiveOrganizationPending(false)
            }
        },
        [
            authClient,
            toast,
            localization,
            onSetActive,
            hidePersonal,
            pathMode,
            personalPath,
            organizationOptions?.basePath,
            redirectTo,
            navigate,
            organizationRefetch
        ]
    )

    // Auto-select first organization when hidePersonal is true
    useEffect(() => {
        if (
            hidePersonal &&
            !activeOrganization &&
            !activeOrganizationPending &&
            organizations &&
            organizations.length > 0 &&
            !sessionPending &&
            !organizationPending &&
            !slug
        ) {
            switchOrganization(organizations[0])
        }
    }, [
        hidePersonal,
        activeOrganization,
        activeOrganizationPending,
        organizations,
        sessionPending,
        organizationPending,
        switchOrganization,
        slug
    ])

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    {trigger ||
                        (size === "icon" ? (
                            <Button
                                size="icon"
                                className={cn(
                                    "size-fit rounded-full",
                                    className,
                                    classNames?.trigger?.base
                                )}
                                variant="ghost"
                                type="button"
                                {...props}
                            >
                                {isPending ||
                                activeOrganization ||
                                !sessionData ||
                                (user as User)?.isAnonymous ||
                                hidePersonal ? (
                                    <OrganizationLogo
                                        key={activeOrganization?.logo}
                                        className={cn(
                                            className,
                                            classNames?.base
                                        )}
                                        classNames={classNames?.trigger?.avatar}
                                        isPending={isPending}
                                        organization={activeOrganization}
                                        aria-label={localization.ORGANIZATION}
                                        localization={localization}
                                    />
                                ) : (
                                    <UserAvatar
                                        key={user?.image}
                                        className={cn(
                                            className,
                                            classNames?.base
                                        )}
                                        classNames={classNames?.trigger?.avatar}
                                        user={user}
                                        aria-label={localization.ACCOUNT}
                                        localization={localization}
                                    />
                                )}
                            </Button>
                        ) : (
                            <Button
                                className={cn(
                                    "h-auto w-full justify-start gap-2 px-2 py-1.5 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                                    className,
                                    classNames?.trigger?.base
                                )}
                                variant="ghost"
                                size={size}
                                type="button"
                                {...props}
                            >
                                {isPending ||
                                activeOrganization ||
                                !sessionData ||
                                (user as User)?.isAnonymous ||
                                hidePersonal ? (
                                    <OrganizationCellView
                                        classNames={
                                            classNames?.trigger?.organization
                                        }
                                        isPending={isPending}
                                        localization={localization}
                                        organization={activeOrganization}
                                        size={size}
                                    />
                                ) : (
                                    <PersonalAccountView
                                        classNames={classNames?.trigger?.user}
                                        localization={localization}
                                        size={size}
                                        user={user}
                                    />
                                )}

                                <ChevronsUpDown className="ml-auto size-4" />
                            </Button>
                        ))}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className={cn(
                        "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",
                        classNames?.content?.base
                    )}
                    align={align || "start"}
                    alignOffset={alignOffset}
                    side={side || "bottom"}
                    sideOffset={sideOffset || 4}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {hidePersonal ? localization.ORGANIZATION : localization.ACCOUNT}
                    </DropdownMenuLabel>

                    {activeOrganization &&
                        !hidePersonal &&
                        (pathMode === "slug" ? (
                            <Link href={personalPath ?? redirectTo}>
                                <DropdownMenuItem className="gap-2 p-2">
                                    <PersonalAccountView
                                        classNames={classNames?.content?.user}
                                        isPending={isPending}
                                        localization={localization}
                                        user={user}
                                    />
                                </DropdownMenuItem>
                            </Link>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => switchOrganization(null)}
                                className="gap-2 p-2"
                            >
                                <PersonalAccountView
                                    classNames={classNames?.content?.user}
                                    isPending={isPending}
                                    localization={localization}
                                    user={user}
                                />
                            </DropdownMenuItem>
                        ))}

                    {organizations?.map(
                        (organization: any) =>
                            organization.id !== activeOrganization?.id &&
                            (pathMode === "slug" ? (
                                <Link
                                    key={organization.id}
                                    href={`${organizationOptions?.basePath}/${organization.slug}`}
                                >
                                    <DropdownMenuItem className="gap-2 p-2">
                                        <OrganizationCellView
                                            classNames={
                                                classNames?.content
                                                    ?.organization
                                            }
                                            isPending={isPending}
                                            localization={localization}
                                            organization={organization}
                                        />
                                    </DropdownMenuItem>
                                </Link>
                            ) : (
                                <DropdownMenuItem
                                    key={organization.id}
                                    onClick={() =>
                                        switchOrganization(organization)
                                    }
                                    className="gap-2 p-2"
                                >
                                    <OrganizationCellView
                                        classNames={
                                            classNames?.content?.organization
                                        }
                                        isPending={isPending}
                                        localization={localization}
                                        organization={organization}
                                    />
                                </DropdownMenuItem>
                            ))
                    )}

                    {organizations &&
                        organizations.length > 0 &&
                        (!hidePersonal || organizations.length > 1) && (
                            <DropdownMenuSeparator
                                className={classNames?.content?.separator}
                            />
                        )}

                    {!isPending &&
                    sessionData &&
                    !(user as User).isAnonymous ? (
                        <DropdownMenuItem
                            className={cn("gap-2 p-2", classNames?.content?.menuItem)}
                            onClick={() => setIsCreateOrgDialogOpen(true)}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                {localization.CREATE_ORGANIZATION}
                            </div>
                        </DropdownMenuItem>
                    ) : (
                        <Link href={`${basePath}/${viewPaths.SIGN_IN}`}>
                            <DropdownMenuItem
                                className={cn("gap-2 p-2", classNames?.content?.menuItem)}
                            >
                                <LogInIcon />
                                {localization.SIGN_IN}
                            </DropdownMenuItem>
                        </Link>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateOrganizationDialog
                open={isCreateOrgDialogOpen}
                onOpenChange={setIsCreateOrgDialogOpen}
                localization={localization}
            />
        </>
    )
}
