import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/ConvexClientProvider";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/lib/posthog";
import { PageViewTracker } from "@/lib/posthog-pageview";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Auth + Convex Starter",
  description: "Next.js starter with Better Auth and Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <Providers>
              <ConvexClientProvider>
                <PageViewTracker />
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 pt-20">
                    {children}
                  </main>
                </div>
                <Toaster />
              </ConvexClientProvider>
            </Providers>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
