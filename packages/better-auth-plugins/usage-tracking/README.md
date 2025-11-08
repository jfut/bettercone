# Better Auth Usage Tracking Plugin

Track API usage, enforce limits, and manage feature access at the organization level.

[![npm version](https://img.shields.io/npm/v/@bettercone/better-auth-plugin-usage-tracking.svg)](https://www.npmjs.com/package/@bettercone/better-auth-plugin-usage-tracking)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Automatic API Tracking** - Tracks all Better Auth API calls per organization
- 📊 **Usage History** - Complete historical data for analytics and charts
- 🔄 **Flexible Reset Modes** - Lazy (on-demand), Scheduled (cron), Manual (admin)
- 🚨 **Smart Callbacks** - Get notified at 80% usage and limit exceeded
- 💰 **Plan & Features Tracking** - Track plan IDs and feature access per organization
- 📈 **Usage Analytics** - Built-in time-series data tracking with history table
- 🔒 **Secure** - Session auth for users, API key for scheduled resets
- 📦 **Type-Safe** - Full TypeScript support with declarations
- ⚡ **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
# npm
npm install @bettercone/better-auth-plugin-usage-tracking

# pnpm
pnpm add @bettercone/better-auth-plugin-usage-tracking

# yarn
yarn add @bettercone/better-auth-plugin-usage-tracking
```

## Quick Start

### 1. Server Setup

Add the plugin to your Better Auth configuration:

```typescript
// server/auth.ts
import { betterAuth } from "better-auth";
import { usageTracking } from "@bettercone/better-auth-plugin-usage-tracking";

export const auth = betterAuth({
  database: /* your database config */,
  plugins: [
    usageTracking({
      resetMode: "lazy",
      resetPeriod: "monthly",
      defaultApiLimit: 1000,
      onLimitExceeded: async (context) => {
        // Send notification
        console.log(`Org ${context.organizationId} exceeded limit!`);
      },
    }),
  ],
});
```

### 2. Client Setup

Add the client plugin to your auth client:

```typescript
// client/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { usageTrackingClient } from "@bettercone/better-auth-plugin-usage-tracking/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [usageTrackingClient()],
});
```

### 3. Database Migration

Run Better Auth CLI to generate and apply migrations:

```bash
npx @better-auth/cli@latest generate
npx @better-auth/cli@latest migrate
```

This adds the following to your database:
- `organization.apiCallCount` - Current usage count
- `organization.apiCallLimit` - Maximum allowed calls
- `organization.apiCallResetDate` - Next reset date
- `organization.features` - Feature access JSON
- `organization.planId` - Subscription plan identifier
- `organization.resetMode` - Reset strategy
- `organization.resetPeriod` - Reset frequency
- `usageHistory` table - Historical usage data

### 4. Use in Components

```tsx
import { authClient } from "./auth-client";
import { ApiUsageCard, FeatureAccessCard, UsageDashboard } from "@bettercone/ui";

function Dashboard() {
  return (
    <AuthUIProvider authClient={authClient}>
      {/* Tier 1: Auto-fetch from context */}
      <ApiUsageCard />
      <FeatureAccessCard feature="advanced_analytics" />
      
      {/* Complete dashboard */}
      <UsageDashboard />
    </AuthUIProvider>
  );
}

// Tier 2: Custom client
<ApiUsageCard authClient={customAuthClient} />

// Tier 3: Manual data
<ApiUsageCard current={500} limit={1000} />
```

## Configuration

### Plugin Options

```typescript
interface UsageTrackingOptions {
  /**
   * Reset mode for usage counters
   * - "lazy": Resets when first API call is made after reset date
   * - "scheduled": Resets via cron job at scheduled time
   * - "manual": Admin must manually reset via API
   * @default "lazy"
   */
  resetMode?: "lazy" | "scheduled" | "manual";

  /**
   * Reset period for usage counters
   * @default "monthly"
   */
  resetPeriod?: "daily" | "weekly" | "monthly" | "yearly";

  /**
   * Default API call limit for new organizations
   * @default 1000
   */
  defaultApiLimit?: number;

  /**
   * Callback when organization exceeds usage limit
   */
  onLimitExceeded?: (context: LimitContext) => Promise<void>;

  /**
   * Callback when organization reaches 80% usage threshold
   */
  onUsageWarning?: (context: WarningContext) => Promise<void>;

  /**
   * API key for scheduled cron jobs (required if resetMode is "scheduled")
   */
  apiKey?: string;
}

interface LimitContext {
  organizationId: string;
  current: number;
  limit: number;
  planId: string | null;
}

interface WarningContext extends LimitContext {
  percentage: number; // 80
}
```

### Example Configurations

#### Production SaaS with Scheduled Reset

```typescript
usageTracking({
  resetMode: "scheduled",
  resetPeriod: "monthly",
  defaultApiLimit: 10000,
  apiKey: process.env.USAGE_TRACKING_API_KEY,
  onLimitExceeded: async ({ organizationId, current, limit }) => {
    await sendEmail({
      to: await getOrgAdminEmail(organizationId),
      subject: "API Limit Exceeded",
      body: `Your organization has exceeded its API limit (${current}/${limit}).`
    });
  },
  onUsageWarning: async ({ organizationId, percentage, current, limit }) => {
    await sendEmail({
      to: await getOrgAdminEmail(organizationId),
      subject: `API Usage at ${percentage}%`,
      body: `Your organization has used ${current}/${limit} API calls (${percentage}%).`
    });
  },
})
```

#### Development with Lazy Reset

```typescript
usageTracking({
  resetMode: "lazy",
  resetPeriod: "daily",
  defaultApiLimit: 1000,
  onLimitExceeded: async ({ organizationId }) => {
    console.log(`Org ${organizationId} exceeded limit`);
  },
})
```

#### Enterprise with Manual Reset

```typescript
usageTracking({
  resetMode: "manual",
  defaultApiLimit: 100000,
  onUsageWarning: async ({ organizationId, percentage }) => {
    await notifyAdmin({
      orgId: organizationId,
      message: `Organization at ${percentage}% usage`,
    });
  },
})
```

## API Reference

### Server Actions

#### `getUsage`

Get current usage for an organization:

```typescript
const usage = await auth.api.getUsage({
  headers: request.headers, // Contains session
});

// Or for a specific organization
const usage = await auth.api.getUsage({
  query: { organizationId: "org_123" },
  headers: request.headers,
});

// Returns:
{
  api: {
    current: 500,
    limit: 1000,
    resetDate: "2025-12-01T00:00:00Z"
  },
  planId: "pro",
  features: { "advanced_analytics": true, "export_data": true },
  resetMode: "lazy",
  resetPeriod: "monthly"
}
```

#### `getUsageHistory`

Get historical usage data:

```typescript
const history = await auth.api.getUsageHistory({
  query: {
    limit: 30, // Number of history entries (default: 30)
  },
  headers: request.headers,
});

// Returns:
{
  history: [
    {
      id: "hist_123",
      organizationId: "org_123",
      metricType: "api",
      value: 450,
      date: "2025-11-01T00:00:00Z",
      createdAt: "2025-11-01T00:00:00Z"
    },
    // ... more entries
  ]
}
```

#### `resetUsage` (Manual Reset)

Manually reset usage for an organization:

```typescript
await auth.api.resetUsage({
  body: {
    organizationId: "org_123",
    resetApi: true, // Reset API call count
  },
  headers: adminHeaders,
});

// Returns: { success: true }
```

#### `updateLimits` (Admin Only)

Update limits and settings for an organization:

```typescript
await auth.api.updateLimits({
  body: {
    organizationId: "org_123",
    apiLimit: 5000, // Optional: new API limit
    resetMode: "scheduled", // Optional: change reset mode
    resetPeriod: "monthly", // Optional: change reset period
  },
  headers: adminHeaders,
});

// Returns: { success: true }
```

#### `resetExpired` (Cron Jobs Only)

Reset all organizations in "scheduled" mode with expired reset dates:

```typescript
// POST to /api/auth/usage-tracking/reset-expired
await fetch("https://yourdomain.com/api/auth/usage-tracking/reset-expired", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    apiKey: process.env.USAGE_TRACKING_API_KEY,
  }),
});

// Returns:
{
  success: true,
  resetCount: 5,
  organizations: ["org_123", "org_456", ...]
}
```

### Client Actions

The client plugin provides type-safe actions via Better Auth client:

```typescript
import { authClient } from "./auth-client";

// Get usage
const usage = await authClient.usageTracking.getUsage();
const orgUsage = await authClient.usageTracking.getUsage({ 
  organizationId: "org_123" 
});

// Get usage history
const { history } = await authClient.usageTracking.getUsageHistory();
const limitedHistory = await authClient.usageTracking.getUsageHistory({ 
  limit: 90 
});

// Reset usage (admin only)
await authClient.usageTracking.resetUsage({
  organizationId: "org_123",
  resetApi: true,
});

// Update limits (admin only)
await authClient.usageTracking.updateLimits({
  organizationId: "org_123",
  apiLimit: 10000,
  resetMode: "scheduled",
  resetPeriod: "monthly",
});
```

### Reactive Atoms

The client plugin provides nanostores atoms for reactive state:

```typescript
import { useStore } from "@nanostores/react";
import { authClient } from "./auth-client";

function UsageDisplay() {
  // Access atoms
  const usage = useStore(authClient.$usageTracking.usageAtom);
  const loading = useStore(authClient.$usageTracking.loadingAtom);
  const error = useStore(authClient.$usageTracking.errorAtom);
  
  // Fetch data
  React.useEffect(() => {
    authClient.$usageTracking.fetchUsage();
  }, []);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <p>API Calls: {usage.api.current} / {usage.api.limit}</p>
      <p>Plan: {usage.planId}</p>
      <p>Resets: {new Date(usage.api.resetDate).toLocaleDateString()}</p>
    </div>
  );
}
```

### UI Components

See [@bettercone/ui](https://www.npmjs.com/package/@bettercone/ui) for pre-built components:

- `ApiUsageCard` - Display current API usage with progress bar
- `FeatureAccessCard` - Check feature availability with visual indicator
- `UsageDashboard` - Complete dashboard with all usage metrics
- `UsageHistoryChart` - Interactive chart with time range controls

## Reset Modes Explained

### Lazy Reset (Recommended for Most Apps)

Usage resets automatically on the first API call after the reset date:

```typescript
usageTracking({ resetMode: "lazy", resetPeriod: "monthly" })
```

**Pros**: Zero configuration, no cron jobs needed  
**Cons**: Reset happens on first API call (small delay)  
**Best for**: Small to medium SaaS applications

### Scheduled Reset (Production SaaS)

Usage resets at exact scheduled time via cron job:

```typescript
usageTracking({ 
  resetMode: "scheduled", 
  resetPeriod: "monthly",
  apiKey: process.env.USAGE_TRACKING_API_KEY 
})
```

Setup cron job:

```bash
# Every 1st of month at 00:00 UTC
0 0 1 * * curl -X POST https://yourdomain.com/api/auth/reset-usage \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Pros**: Precise timing, predictable behavior  
**Cons**: Requires cron job setup  
**Best for**: Production applications with strict billing cycles

### Manual Reset (Enterprise)

Admin manually resets usage via API or dashboard:

```typescript
usageTracking({ resetMode: "manual" })
```

```typescript
// Admin triggers reset
await authClient.resetUsage({ organizationId: "org_123" });
```

**Pros**: Full control, audit trail  
**Cons**: Requires manual intervention  
**Best for**: Enterprise applications with custom billing

## Usage Patterns

### Basic Monitoring with UI Components

```tsx
import { ApiUsageCard } from "@bettercone/ui";

function App() {
  return (
    <AuthUIProvider authClient={authClient}>
      <ApiUsageCard />
    </AuthUIProvider>
  );
}
```

### Feature Gating with Features Field

```tsx
import { useStore } from "@nanostores/react";
import { authClient } from "./auth-client";

function AdvancedFeature() {
  const usage = useStore(authClient.$usageTracking.usageAtom);
  const hasAccess = usage?.features?.advanced_analytics === true;
  
  React.useEffect(() => {
    authClient.$usageTracking.fetchUsage();
  }, []);
  
  if (!hasAccess) {
    return <UpgradePrompt feature="Advanced Analytics" />;
  }
  
  return <AdvancedAnalyticsDashboard />;
}
```

### Usage-Based Billing

```tsx
import { useStore } from "@nanostores/react";
import { authClient } from "./auth-client";

function BillingSettings() {
  const usage = useStore(authClient.$usageTracking.usageAtom);
  const overage = Math.max(0, (usage?.api.current || 0) - (usage?.api.limit || 0));
  const overageCost = overage * 0.01; // $0.01 per extra call
  
  React.useEffect(() => {
    authClient.$usageTracking.fetchUsage();
  }, []);
  
  if (!usage) return <Skeleton />;
  
  return (
    <div>
      <p>Included: {usage.api.limit} API calls</p>
      <p>Used: {usage.api.current}</p>
      {overage > 0 && (
        <p>Overage: {overage} calls (${overageCost.toFixed(2)})</p>
      )}
    </div>
  );
}
```

### Historical Analytics with Charts

```tsx
import { useStore } from "@nanostores/react";
import { authClient } from "./auth-client";
import { LineChart } from "@/components/charts";

function Analytics() {
  const history = useStore(authClient.$usageTracking.historyAtom);
  const loading = useStore(authClient.$usageTracking.loadingAtom);
  
  React.useEffect(() => {
    authClient.$usageTracking.fetchUsageHistory({ limit: 30 });
  }, []);
  
  if (loading) return <Skeleton />;
  
  // Transform history data for chart
  const chartData = history.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    value: entry.value
  }));
  
  return (
    <div>
      <h2>Last 30 Days</h2>
      <LineChart data={chartData} />
    </div>
  );
}
```

### Or Use Pre-built UI Components

```tsx
import { UsageHistoryChart } from "@bettercone/ui";

function Analytics() {
  return (
    <div>
      <h2>Last 30 Days</h2>
      <UsageHistoryChart 
        showTimeRangeControls 
        showChartTypeControls 
      />
    </div>
  );
}
```

## Troubleshooting

### Usage not tracking

**Problem**: API calls aren't being counted

**Solutions**:
1. Verify plugin is installed on both server and client
2. Check database migrations ran successfully
3. Ensure organization is set in session
4. Check server logs for errors

### Reset not working

**Problem**: Usage isn't resetting after reset date

**Solutions**:
- **Lazy mode**: Make an API call to trigger reset
- **Scheduled mode**: Verify cron job is running and API key is correct
- **Manual mode**: Call `resetUsage` API endpoint

### Callbacks not firing

**Problem**: `onLimitExceeded` or `onThresholdReached` not called

**Solutions**:
1. Check callback function is async and returns Promise
2. Verify organization has reached threshold/limit
3. Check server logs for callback errors
4. Ensure callbacks don't throw uncaught exceptions

### TypeScript errors

**Problem**: Type errors when using plugin

**Solutions**:
1. Ensure you're importing from correct paths:
   - Server: `@bettercone/better-auth-plugin-usage-tracking`
   - Client: `@bettercone/better-auth-plugin-usage-tracking/client`
2. Check TypeScript version >= 5.0
3. Verify `types` field in package.json points to correct .d.ts files
4. For atoms, install `@nanostores/react` and use `useStore` hook

### Atoms not updating

**Problem**: Usage data not reactive in UI

**Solutions**:
1. Install `@nanostores/react`: `npm install @nanostores/react`
2. Use `useStore` hook to subscribe to atoms
3. Call `fetchUsage()` or `fetchUsageHistory()` to load data
4. Check that Better Auth client is properly configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Vinicius Leal](https://github.com/vncsleal)

## Links

- [npm Package](https://www.npmjs.com/package/@bettercone/better-auth-plugin-usage-tracking)
- [GitHub Repository](https://github.com/vncsleal/bettercone)
- [Documentation](https://bettercone.com/docs/plugins/usage-tracking)
- [Live Demo](https://bettercone.com/plugins/usage-tracking)
- [Better Auth](https://www.better-auth.com)

## Support

- 💬 [GitHub Discussions](https://github.com/vncsleal/bettercone/discussions)
- 🐛 [GitHub Issues](https://github.com/vncsleal/bettercone/issues)
- 📧 Email: support@bettercone.com
