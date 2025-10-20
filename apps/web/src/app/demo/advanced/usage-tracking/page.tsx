/**
 * Usage Tracking Page
 * Refactored to use modular usage components with real-time Convex integration
 * Reduced from 141 lines to 21 lines (85% reduction)
 */

"use client";

import { DemoPageTemplate } from "@/components/layouts";
import { UsageDashboard } from "@/components/usage";

export default function UsageTrackingPage() {
  return (
    <DemoPageTemplate
      title="Usage Tracking & Analytics"
      description="Monitor your usage, track limits, and optimize your subscription with real-time updates"
      maxWidth="max-w-4xl"
    >
      <UsageDashboard />
    </DemoPageTemplate>
  );
}
