/**
 * gravatar-options
 * Gravatar integration configuration
 */

export interface GravatarOptions {
    enabled?: boolean;
    defaultImage?: "404" | "mp" | "identicon" | "monsterid" | "wavatar" | "retro" | "robohash";
    jpg?: boolean;
    size?: number;
    d?: string;
    forceDefault?: boolean;
}
