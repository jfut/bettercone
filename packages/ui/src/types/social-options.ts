/**
 * social-options
 * Social authentication provider configuration
 */

export interface SocialOptions {
    enabled?: boolean;
    providers?: Array<{
        id: string;
        name: string;
        enabled?: boolean;
    }>;
    signIn?: any;
}
