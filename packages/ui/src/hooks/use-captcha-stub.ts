/**
 * use-captcha-stub
 * Stub implementation for disabled captcha functionality
 * Returns empty implementations to satisfy type requirements
 */

export function useCaptchaStub() {
    const getCaptchaHeaders = async (_action: string): Promise<Record<string, string> | undefined> => {
        return undefined
    }

    const resetCaptcha = (): void => {
        // No-op for disabled captcha
    }

    return {
        getCaptchaHeaders,
        resetCaptcha
    }
}
