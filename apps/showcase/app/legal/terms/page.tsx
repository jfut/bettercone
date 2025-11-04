import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - @bettercone/ui",
  description: "Terms of Service for @bettercone/ui",
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 bg-muted/50 rounded-lg border">
          <p className="leading-relaxed">
            @bettercone/ui is open-source software provided under the MIT License. 
            This site is a demonstration of the component library using mock data.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">MIT License</h2>
            <p className="leading-relaxed text-muted-foreground">
              You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies 
              of this software, subject to the following conditions:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>Include the original copyright and license notice</li>
              <li>The software is provided &quot;as is&quot; without warranty</li>
              <li>Authors are not liable for any damages</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Usage</h2>
            <p className="leading-relaxed text-muted-foreground">
              These components are designed for use with{" "}
              <Link href="https://better-auth.com" target="_blank" className="text-primary hover:underline">
                Better Auth
              </Link>
              . When implementing in production, ensure you comply with all applicable laws and regulations 
              regarding data protection and user privacy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">No Warranty</h2>
            <p className="leading-relaxed text-muted-foreground">
              This software is provided &quot;as is&quot;, without warranty of any kind, express or implied. 
              In no event shall the authors be liable for any claim, damages, or other liability arising 
              from the use of the software.
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
