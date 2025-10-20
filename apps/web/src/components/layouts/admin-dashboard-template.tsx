/**
 * AdminDashboardTemplate Component
 * Layout for admin dashboard pages with header content support
 * Following better-auth-ui component patterns
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AdminDashboardTemplateProps {
  title: string;
  description: string;
  headerContent?: ReactNode;
  children: ReactNode;
  className?: string;
  classNames?: {
    base?: string;
    container?: string;
    header?: string;
    title?: string;
    description?: string;
    headerContent?: string;
    content?: string;
  };
}

export function AdminDashboardTemplate({
  title,
  description,
  headerContent,
  children,
  className,
  classNames,
}: AdminDashboardTemplateProps) {
  return (
    <div className={cn("container mx-auto py-8", className, classNames?.base)}>
      <div className={cn("max-w-6xl mx-auto space-y-8", classNames?.container)}>
        <div className={cn("text-center", classNames?.header)}>
          <h1 className={cn("text-3xl font-bold", classNames?.title)}>
            {title}
          </h1>
          <p className={cn("text-muted-foreground mt-2", classNames?.description)}>
            {description}
          </p>
        </div>

        {headerContent && (
          <div className={cn("flex justify-center", classNames?.headerContent)}>
            {headerContent}
          </div>
        )}

        <div className={classNames?.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
