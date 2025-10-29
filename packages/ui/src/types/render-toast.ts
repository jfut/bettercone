/**
 * render-toast
 * Toast notification rendering function
 */

export interface RenderToast {
    (options: { variant?: "default" | "success" | "error" | "info" | "warning"; message: string }): void;
}

