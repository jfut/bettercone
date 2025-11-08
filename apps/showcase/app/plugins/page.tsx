import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, ArrowLeft } from "lucide-react";

export default function PluginsPage() {
  return (
    <main className="container max-w-4xl py-12 mx-auto px-4">
      <div className="space-y-8">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Plugins</h1>
          <p className="text-muted-foreground">
            Extend Better Auth with powerful features
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle>Usage Tracking</CardTitle>
                    <Badge variant="secondary">v0.1.0</Badge>
                  </div>
                  <CardDescription>
                    Track API usage, enforce limits, and manage features at the organization level
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                <Button size="sm" asChild>
                  <Link href="/plugins/usage-tracking">
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="https://docs.bettercone.com/docs/plugins/usage-tracking" target="_blank">
                    Docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="https://www.npmjs.com/package/@bettercone/better-auth-plugin-usage-tracking" target="_blank">
                    npm
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <CardTitle>More Coming Soon</CardTitle>
              <CardDescription>
                Building additional plugins for the Better Auth ecosystem
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Suggest a Plugin</CardTitle>
              <CardDescription>
                Have an idea for a plugin? Let us know what you&apos;d like to see
              </CardDescription>
              <div className="pt-4">
                <Button variant="outline" asChild>
                  <Link href="https://github.com/vncsleal/bettercone/issues/new?labels=plugin-request&template=plugin-request.md" target="_blank">
                    Suggest on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
