/**
 * auth-mutators
 * Authentication mutation functions
 */

export interface AuthMutators {
    signIn?: (params: any) => Promise<any>;
    signUp?: (params: any) => Promise<any>;
    signOut?: (params: any) => Promise<any>;
    forgotPassword?: (params: any) => Promise<any>;
    resetPassword?: (params: any) => Promise<any>;
    verifyEmail?: (params: any) => Promise<any>;
    [key: string]: ((params: any) => Promise<any>) | undefined;
}
