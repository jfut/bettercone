/**
 * link
 * Link component type for navigation
 */

import type { ReactNode } from "react";

export interface Link {
    (props: { href: string; className?: string; children: ReactNode }): ReactNode;
}
