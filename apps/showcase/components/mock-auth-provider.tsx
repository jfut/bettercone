"use client";

import { AuthUIProvider } from "@bettercone/ui";
import { mockAuthClient } from "@/lib/mock-auth-provider";
import { ReactNode } from "react";

/**
 * Mock auth provider for component previews
 * Uses mock data instead of real database connection
 */
export function MockAuthUIProvider({ children }: { children: ReactNode }) {
  return (
    <AuthUIProvider authClient={mockAuthClient as unknown as Parameters<typeof AuthUIProvider>[0]['authClient']}>
      {children}
    </AuthUIProvider>
  );
}
