"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StripedPattern } from "@/components/ui/striped-pattern";
import { Copy, Check, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/vncsleal/bettercone')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install @bettercone/ui');
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <StripedPattern 
        className="text-muted-foreground/20 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" 
        width={20}
        height={20}
      />
      
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center space-y-8 relative z-20">
        {/* Badge */}
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="text-xs">
            v0.3.4
          </Badge>
          {stars !== null && (
            <Button variant="outline" size="sm" asChild>
              <Link 
                href="https://github.com/vncsleal/bettercone" 
                target="_blank"
                className="gap-2"
              >
                <Star className="h-3 w-3 fill-current" />
                <span className="font-mono text-xs">{stars.toLocaleString()}</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            @bettercone/ui
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready components for Better Auth
          </p>
        </div>

        {/* Install Command */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <code className="font-mono text-sm">npm install @bettercone/ui</code>
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" asChild>
            <Link href="/example">
              Browse Components
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://docs.bettercone.com" target="_blank">
              Documentation
            </Link>
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground pt-8">
          Built with Better Auth · TypeScript · MIT License
        </p>
      </div>
    </div>
  );
}
