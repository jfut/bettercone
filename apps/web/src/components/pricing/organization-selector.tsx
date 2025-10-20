/**
 * Organization Selector Component
 * Select organization for team plan subscriptions
 * Following better-auth-ui patterns
 */

"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Organization } from "./types";

export interface OrganizationSelectorLocalization {
  label: string;
  description: string;
  placeholder: string;
}

const defaultLocalization: OrganizationSelectorLocalization = {
  label: "Select Organization:",
  description: "Team plan will be billed to the selected organization",
  placeholder: "Choose organization..."
};

export interface OrganizationSelectorProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onOrgChange: (orgId: string) => void;
  className?: string;
  classNames?: {
    container?: string;
    label?: string;
    select?: string;
    description?: string;
  };
  localization?: Partial<OrganizationSelectorLocalization>;
}

export function OrganizationSelector({
  organizations,
  selectedOrgId,
  onOrgChange,
  className,
  classNames,
  localization
}: OrganizationSelectorProps) {
  const loc = { ...defaultLocalization, ...localization };

  if (organizations.length === 0) return null;

  return (
    <div className={cn("w-full space-y-2", classNames?.container, className)}>
      <label className={cn("text-sm font-medium", classNames?.label)}>
        {loc.label}
      </label>
      <Select value={selectedOrgId || ""} onValueChange={onOrgChange}>
        <SelectTrigger className={classNames?.select}>
          <SelectValue placeholder={loc.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className={cn("text-xs text-muted-foreground", classNames?.description)}>
        {loc.description}
      </p>
    </div>
  );
}

export function OrganizationSelectorSkeleton({
  className,
  classNames
}: Pick<OrganizationSelectorProps, "className" | "classNames">) {
  return (
    <div className={cn("w-full space-y-2", classNames?.container, className)}>
      <Skeleton className={cn("h-4 w-32", classNames?.label)} />
      <Skeleton className={cn("h-10 w-full", classNames?.select)} />
      <Skeleton className={cn("h-3 w-full", classNames?.description)} />
    </div>
  );
}
