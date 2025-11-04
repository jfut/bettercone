"use client";

import { AuthUIProvider } from "@bettercone/ui";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

function ToasterProvider() {
  const { theme } = useTheme();
  
  return <Toaster theme={theme as "light" | "dark" | "system"} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthUIProvider authClient={authClient}>
        {children}
        <ToasterProvider />
      </AuthUIProvider>
    </ThemeProvider>
  );
}
