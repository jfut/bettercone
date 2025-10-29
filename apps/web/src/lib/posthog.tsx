"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog in production or if explicitly enabled
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only", // Only create profiles for identified users
        capture_pageview: false, // Disable automatic pageview capture (we'll do it manually)
        capture_pageleave: true, // Track when users leave pages
        autocapture: false, // Disable autocapture for privacy (enable manually if needed)
        disable_session_recording: true, // Disable session recording by default
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.debug(); // Enable debug mode in development
          }
        },
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Export posthog instance for direct usage
export { posthog };
