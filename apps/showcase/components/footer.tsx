import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-mono">@bettercone/ui</span>
            <span>·</span>
            <span>MIT License</span>
            <span>·</span>
            <span>© {currentYear}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/example"
              className="hover:text-foreground transition-colors"
            >
              Components
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="https://github.com/vncsleal/bettercone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
