/**
 * captcha-options
 * CAPTCHA configuration
 */

export interface CaptchaOptions {
    enabled?: boolean;
    provider?: "google-recaptcha-v2" | "google-recaptcha-v3" | "hcaptcha" | "turnstile";
    siteKey?: string;
    endpoints?: string[];
    enterprise?: boolean;
    recaptchaNet?: boolean;
}
