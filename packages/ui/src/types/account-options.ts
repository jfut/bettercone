/**
 * account-options
 * Configuration options for account management features
 */

export interface AccountOptions {
    enabled?: boolean;
    basePath?: string;
    fields?: any;
    viewPaths?: any;
}

export interface AccountOptionsContext {
    enabled?: boolean;
    basePath?: string;
    fields?: any;
    viewPaths?: any;
}
