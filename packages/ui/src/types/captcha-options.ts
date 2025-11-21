/**
 * captcha-options
 * CAPTCHA configuration
 */

export interface CaptchaOptions {
    enabled?: boolean;
    provider?: "google-recaptcha-v2-checkbox" | "google-recaptcha-v2-invisible" | "google-recaptcha-v3" | "hcaptcha" | "cloudflare-turnstile";
    siteKey?: string;
    endpoints?: string[];
    enterprise?: boolean;
    recaptchaNet?: boolean;
}
