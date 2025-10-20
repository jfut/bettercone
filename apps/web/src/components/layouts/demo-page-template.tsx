/**
 * DemoPageTemplate Component
 * Simple centered layout for demo pages
 * Following better-auth-ui component patterns
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DemoPageTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
  classNames?: {
    base?: string;
    container?: string;
    header?: string;
    title?: string;
    description?: string;
    content?: string;
  };
}

export function DemoPageTemplate({
  title,
  description,
  children,
  maxWidth = "max-w-4xl",
  className,
  classNames,
}: DemoPageTemplateProps) {
  return (
    <div className={cn("container mx-auto py-8", className, classNames?.base)}>
      <div className={cn(maxWidth, "mx-auto space-y-8", classNames?.container)}>
        <div className={cn("text-center", classNames?.header)}>
          <h1 className={cn("text-3xl font-bold", classNames?.title)}>
            {title}
          </h1>
          <p className={cn("text-muted-foreground mt-2", classNames?.description)}>
            {description}
          </p>
        </div>
        <div className={classNames?.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
