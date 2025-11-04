import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '@bettercone/ui Documentation',
    template: '%s | @bettercone/ui',
  },
  description: 'Production-ready UI components for Better Auth. Complete authentication, security, organizations, billing, and team management components.',
  keywords: [
    '@bettercone/ui',
    'Better Auth',
    'React Components',
    'Next.js',
    'TypeScript',
    'UI Library',
    'Component Library',
    'Authentication UI',
    'Billing Components',
    'Organization Management',
    'Teams',
    'Documentation',
  ],
  authors: [
    {
      name: 'Vinicius Leal',
      url: 'https://github.com/vncsleal',
    },
  ],
  creator: 'Vinicius Leal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.bettercone.com',
    title: '@bettercone/ui Documentation',
    description: 'Production-ready UI components for Better Auth. 34 components for authentication, security, organizations, billing, and teams.',
    siteName: '@bettercone/ui Docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: '@bettercone/ui Documentation',
    description: 'Production-ready UI components for Better Auth. 34 components for authentication, security, organizations, billing, and teams.',
    creator: '@vncsleal',
  },
  metadataBase: new URL('https://docs.bettercone.com'),
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
