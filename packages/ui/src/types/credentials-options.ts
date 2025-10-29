/**
 * credentials-options
 * Email/password authentication configuration
 */

export interface CredentialsOptions {
    enabled?: boolean;
    requireEmailVerification?: boolean;
    forgotPassword?: boolean;
    confirmPassword?: boolean;
    passwordValidation?: any;
    rememberMe?: boolean;
    username?: boolean;
}
