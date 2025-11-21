import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="container max-w-3xl mx-auto text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            @bettercone/ui
          </h1>
          <p className="text-lg md:text-xl text-fd-muted-foreground max-w-2xl mx-auto">
            Production-ready components for Better Auth
          </p>
        </div>

        {/* Install Command */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-3 bg-fd-muted rounded-lg">
            <code className="font-mono text-sm">npx @bettercone/ui init</code>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/docs/getting-started/installation"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://bettercone.com"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md border border-fd-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-fd-muted/50"
          >
            View Components
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-fd-muted-foreground pt-8">
          Built with Better Auth · TypeScript · MIT License
        </p>
      </div>
    </main>
  );
}
