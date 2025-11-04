"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { BookOpen, Github, Package } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-sm font-medium transition-opacity hover:opacity-80"
          >
            @bettercone/ui
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/example"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname.startsWith('/example')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Components</span>
            </Link>
            <Link
              href="https://docs.bettercone.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
            <Link
              href="https://github.com/vncsleal/bettercone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
