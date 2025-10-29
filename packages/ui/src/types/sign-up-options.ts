/**
 * sign-up-options
 * User registration configuration
 */

export interface SignUpOptions {
    enabled?: boolean;
    requireEmailVerification?: boolean;
    additionalFields?: string[];
    fields?: any;
}
