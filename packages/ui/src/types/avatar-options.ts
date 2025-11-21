/**
 * avatar-options
 * Avatar display configuration
 */

export interface AvatarOptions {
    enabled?: boolean;
    upload?: (file: File) => Promise<string>;
    delete?: boolean;
    extension?: string;
    size?: number;
    Image?: React.ComponentType<any>;
}
