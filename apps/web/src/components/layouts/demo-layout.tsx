/**
 * DemoLayout Component
 * Shared layout for demo pages with consistent structure
 * Following better-auth-ui component patterns
 */

"use client";

import { cn } from "@/lib/utils";

export interface DemoLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
  requiresPlugin?: boolean;
  pluginName?: string;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    titleRow?: string;
    title?: string;
    badge?: string;
    description?: string;
    pluginWarning?: string;
    content?: string;
  };
}

export function DemoLayout({
  children,
  title,
  description,
  category,
  requiresPlugin = false,
  pluginName,
  className,
  classNames,
}: DemoLayoutProps) {
  return (
    <div className={cn("container max-w-5xl mx-auto py-12 px-6", className, classNames?.base)}>
      <div className={cn("mb-12", classNames?.header)}>
        <div className={cn("flex items-center gap-3 mb-4", classNames?.titleRow)}>
          <h1 className={cn("text-4xl font-bold", classNames?.title)}>
            {title}
          </h1>
          <span 
            className={cn(
              "text-xs px-3 py-1.5 border rounded-lg text-muted-foreground bg-muted",
              classNames?.badge
            )}
          >
            {category}
          </span>
        </div>
        <p className={cn("text-lg text-muted-foreground", classNames?.description)}>
          {description}
        </p>
        
        {requiresPlugin && (
          <div 
            className={cn(
              "mt-6 p-4 border rounded-lg bg-muted",
              classNames?.pluginWarning
            )}
          >
            <p className="text-sm">
              ⚠️ Requires the{" "}
              <code className="px-2 py-1 bg-background rounded">
                {pluginName}
              </code>{" "}
              plugin
            </p>
          </div>
        )}
      </div>

      <div className={cn("space-y-8", classNames?.content)}>
        {children}
      </div>
    </div>
  );
}
