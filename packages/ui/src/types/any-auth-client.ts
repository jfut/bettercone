/**
 * any-auth-client
 * Type for any Better Auth client
 */

export interface AnyAuthClient {
    $Infer: {
        Session: {
            session: any
            user: any
        }
    }
    $fetch: (path: string, options?: any) => Promise<any>
    useSession: () => any
    listAccounts: any
    accountInfo: any
    multiSession: any
    listSessions: any
    useListPasskeys: any
    apiKey: any
    useActiveOrganization: any
    useListOrganizations: any
    organization: any
    updateUser: any
    unlinkAccount: any
    passkey: any
    revokeSession: any
    oneTap: any
    signIn: any
    signOut: any
    twoFactor: any
    requestPasswordReset: any;
    changePassword: any;
    deleteUser: any;
    emailOtp: any;
    resetPassword: any;
    signUp: any;
}
