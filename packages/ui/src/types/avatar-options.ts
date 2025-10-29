/**
 * avatar-options
 * Avatar display configuration
 */

export interface AvatarOptions {
    enabled?: boolean;
    upload?: boolean;
    delete?: boolean;
    extension?: string;
    size?: number;
    Image?: React.ComponentType<any>;
}
