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
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Building plugins for the Better Auth ecosystem
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
