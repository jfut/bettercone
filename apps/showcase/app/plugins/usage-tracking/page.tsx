"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function UsageTrackingPluginPage() {
  const [copiedServer, setCopiedServer] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setter(false), 2000);
  };

  const installCommand = "pnpm add @bettercone/better-auth-plugin-usage-tracking";
  
  const serverCode = `import { betterAuth } from "better-auth";
import { usageTracking } from "@bettercone/better-auth-plugin-usage-tracking";

export const auth = betterAuth({
  plugins: [
    usageTracking({
      resetMode: "lazy",
      resetPeriod: "monthly",
      defaultApiLimit: 1000,
    }),
  ],
});`;

  const clientCode = `import { createAuthClient } from "better-auth/client";
import { usageTrackingClient } from "@bettercone/better-auth-plugin-usage-tracking/client";

export const authClient = createAuthClient({
  plugins: [usageTrackingClient()],
});`;

  return (
    <main className="container max-w-4xl py-12 mx-auto px-4">
      <div className="space-y-8">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/plugins">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to plugins
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Usage Tracking Plugin</h1>
          <Badge variant="secondary">v0.1.0</Badge>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="https://docs.bettercone.com/docs/plugins/usage-tracking" target="_blank">
              Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://www.npmjs.com/package/@bettercone/better-auth-plugin-usage-tracking" target="_blank">
              npm
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/vncsleal/bettercone/tree/main/packages/better-auth-plugins/usage-tracking" target="_blank">
              GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Automatic API tracking per organization</li>
              <li>• Usage history for analytics</li>
              <li>• Flexible reset modes (lazy/scheduled/manual)</li>
              <li>• Smart callbacks for notifications</li>
              <li>• Feature gates by plan</li>
              <li>• Full TypeScript support</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Installation</h2>
          
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-muted px-4 py-2 font-mono text-sm">
              {installCommand}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(installCommand, setCopiedInstall)}
            >
              {copiedInstall ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="server">
          <TabsList>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          
          <TabsContent value="server" className="space-y-2">
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto text-sm">
                <code>{serverCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(serverCode, setCopiedServer)}
              >
                {copiedServer ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="space-y-2">
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto text-sm">
                <code>{clientCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(clientCode, setCopiedClient)}
              >
                {copiedClient ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Migration</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block rounded-md bg-muted px-4 py-2 font-mono text-sm">
              npx @better-auth/cli@latest generate
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Modes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium text-sm">Lazy (Default)</div>
              <div className="text-sm text-muted-foreground">Resets when usage is checked</div>
            </div>
            <div>
              <div className="font-medium text-sm">Scheduled</div>
              <div className="text-sm text-muted-foreground">Cron jobs for automated resets</div>
            </div>
            <div>
              <div className="font-medium text-sm">Manual</div>
              <div className="text-sm text-muted-foreground">Admin-controlled only</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
