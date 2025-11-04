import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy - @bettercone/ui",
  description: "Cookie Policy for @bettercone/ui",
};

export default function CookiePolicy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 bg-muted/50 rounded-lg border">
          <p className="leading-relaxed">
            This showcase site uses minimal cookies for theme preferences only. 
            No authentication cookies are stored as all data is mocked for demonstration purposes.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Cookies We Use</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Theme Preference</strong> — Stores your dark/light mode selection
                <br />
                <span className="text-sm">Duration: 1 year</span>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Production Usage</h2>
            <p className="leading-relaxed text-muted-foreground">
              When you implement @bettercone/ui components in your application with{" "}
              <Link href="https://better-auth.com" target="_blank" className="text-primary hover:underline">
                Better Auth
              </Link>
              , authentication cookies will be set to maintain user sessions. These typically include:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>Session tokens for maintaining login state</li>
              <li>CSRF protection tokens</li>
              <li>OAuth state parameters (if using social login)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Managing Cookies</h2>
            <p className="leading-relaxed text-muted-foreground">
              You can control cookies through your browser settings. Note that blocking cookies may 
              affect functionality, particularly for authentication features in production implementations.
            </p>
          </section>
        </div>

        {/* Contact */}
        <div className="pt-8 border-t space-y-4">
          <h2 className="text-xl font-semibold">Questions?</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <Link 
                href="https://github.com/vncsleal/bettercone" 
                target="_blank"
                className="text-primary hover:underline"
              >
                GitHub Repository
              </Link>
            </p>
            <p>
              <Link 
                href="https://docs.bettercone.com" 
                target="_blank"
                className="text-primary hover:underline"
              >
                Documentation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
