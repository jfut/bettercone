import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - @bettercone/ui",
  description: "Privacy Policy for @bettercone/ui",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 bg-muted/50 rounded-lg border">
          <p className="leading-relaxed">
            This is a showcase site demonstrating @bettercone/ui components. No real user data is collected or stored. 
            All authentication examples use mock data for demonstration purposes only.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Open Source Software</h2>
            <p className="leading-relaxed text-muted-foreground">
              @bettercone/ui is open-source software released under the MIT License. When you use these components 
              in your own applications, you are responsible for implementing appropriate privacy practices and 
              compliance with applicable data protection laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Responsibility</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you implement @bettercone/ui in your application, you must create your own privacy policy 
              that reflects your actual data collection and processing practices. This includes compliance with 
              GDPR, CCPA, and other applicable regulations in your jurisdiction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Better Auth Integration</h2>
            <p className="leading-relaxed text-muted-foreground">
              Our components are built on{" "}
              <Link href="https://better-auth.com" target="_blank" className="text-primary hover:underline">
                Better Auth
              </Link>
              . When implementing authentication in production, review Better Auth&apos;s documentation 
              for security best practices and data handling guidelines.
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
