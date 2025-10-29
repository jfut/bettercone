/**
 * organization-options
 * Organization/team management configuration
 */

export interface OrganizationOptions {
    enabled?: boolean;
    pathMode?: "id" | "slug";
    slug?: string;
    logo?: any;
    basePath?: string;
    customRoles?: any[];
    viewPaths?: any;
}

export interface OrganizationOptionsContext {
    enabled?: boolean;
    pathMode?: "id" | "slug";
    slug?: string;
    logo?: any;
    basePath?: string;
    customRoles?: any[];
    viewPaths?: any;
    personalPath?: string;
    apiKey?: boolean;
}
