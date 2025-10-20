# Usage Tracking Components

Modular usage tracking components with real-time Convex integration for monitoring API calls, storage, and feature access.

## Components

### `UsageDashboard`
Complete usage tracking dashboard with real-time Convex queries.

```tsx
import { UsageDashboard } from "@/components/usage";

export default function UsageTrackingPage() {
  return <UsageDashboard />;
}
```

**Features:**
- ✅ Real-time usage data from Convex
- ✅ Organization-aware (uses active organization if available)
- ✅ Auto-loading states with skeletons
- ✅ Upgrade CTAs when limits are reached

### `ApiUsageCard`
API call usage tracking with warnings and upgrade prompts.

```tsx
<ApiUsageCard
  current={8500}
  limit={10000}
  warningThreshold={80}
  onUpgrade={() => router.push("/pricing")}
/>
```

**Features:**
- ✅ Progress bar with color coding
- ✅ Warning at 80% usage (customizable)
- ✅ Critical alert at 90% usage
- ✅ Upgrade CTA button

### `StorageUsageCard`
Storage consumption tracking with human-readable formatting.

```tsx
<StorageUsageCard
  currentBytes={2.3 * 1024 * 1024 * 1024} // 2.3 GB
  limitBytes={5 * 1024 * 1024 * 1024}     // 5 GB
  onUpgrade={() => router.push("/pricing")}
/>
```

**Features:**
- ✅ Automatic byte to GB/MB/KB conversion
- ✅ Available storage display
- ✅ Warning thresholds
- ✅ Responsive design

### `FeatureAccessCard`
Feature availability based on subscription plan.

```tsx
<FeatureAccessCard
  features={{
    advancedAnalytics: true,
    apiAccess: true,
    customIntegrations: false,
    prioritySupport: false,
    planId: "pro",
    updatedAt: Date.now()
  }}
  onUpgrade={() => router.push("/pricing")}
/>
```

**Features:**
- ✅ Visual distinction between enabled/locked features
- ✅ Feature descriptions
- ✅ Plan badge display
- ✅ Upgrade CTA for locked features

## Convex Integration

### Schema

The usage tracking system uses three Convex tables:

#### `usage` table
```typescript
{
  userId: string;
  organizationId?: string;
  apiCalls: number;
  apiLimit: number;
  storageBytes: number;
  storageLimit: number;
  period: string; // "2024-10"
  periodStart: number;
  periodEnd: number;
  lastUpdated: number;
}
```

#### `apiCallLogs` table
```typescript
{
  userId: string;
  organizationId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}
```

#### `featureAccess` table
```typescript
{
  userId?: string;
  organizationId?: string;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
  planId: string;
  updatedAt: number;
}
```

### Queries

**Get current usage:**
```typescript
const usage = useQuery(api.usage.getCurrentUsage, {
  userId: session.user.id,
  organizationId: activeOrg?.id
});
```

**Get feature access:**
```typescript
const features = useQuery(api.usage.getFeatureAccess, {
  userId: session.user.id,
  organizationId: activeOrg?.id
});
```

**Get API call logs:**
```typescript
const logs = useQuery(api.usage.getApiCallLogs, {
  userId: session.user.id,
  limit: 100
});
```

### Mutations

**Increment API calls:**
```typescript
await incrementApiCalls({
  userId: session.user.id,
  count: 1
});
```

**Log API call:**
```typescript
await logApiCall({
  userId: session.user.id,
  endpoint: "/api/users",
  method: "GET",
  statusCode: 200,
  responseTime: 125
});
```

**Update storage:**
```typescript
await updateStorageUsage({
  userId: session.user.id,
  bytes: 2.3 * 1024 * 1024 * 1024 // 2.3 GB
});
```

**Update features (on subscription change):**
```typescript
await updateFeatureAccess({
  userId: session.user.id,
  planId: "pro",
  advancedAnalytics: true,
  apiAccess: true,
  customIntegrations: true,
  prioritySupport: true
});
```

## Real-time Updates

Usage data updates in real-time thanks to Convex's reactive queries:

1. **API calls** - Increments automatically when tracked
2. **Storage** - Updates when files are uploaded/deleted
3. **Features** - Changes when subscription is upgraded/downgraded

## File Structure

```
components/usage/
├── index.ts                      # Clean exports
├── types.ts                      # TypeScript types
├── usage-dashboard.tsx           # Main composed view
├── api-usage-card.tsx            # API call tracking
├── storage-usage-card.tsx        # Storage tracking
├── feature-access-card.tsx       # Feature availability
└── README.md                     # Documentation

packages/convex/convex/
├── schema.ts                     # Updated with usage tables
└── usage.ts                      # Queries and mutations
```

## Migration

**Before (141 lines):**
```tsx
// All logic inline with mock data
export default function UsageTrackingPage() {
  const [usageData, setUsageData] = useState(mockUsageData);
  // ... 130+ lines of inline logic
}
```

**After (21 lines - 85% reduction):**
```tsx
import { UsageDashboard } from "@/components/usage";

export default function UsageTrackingPage() {
  return (
    <DemoPageTemplate>
      <UsageDashboard />
    </DemoPageTemplate>
  );
}
```

## Setup

1. **Run Convex dev** to generate types:
```bash
cd packages/convex
npx convex dev
```

2. **Seed initial data** (optional):
```typescript
// In Convex dashboard or seed script
await ctx.db.insert("usage", {
  userId: "user_123",
  apiCalls: 0,
  apiLimit: 10000,
  storageBytes: 0,
  storageLimit: 5 * 1024 * 1024 * 1024,
  period: "2024-10",
  periodStart: Date.now(),
  periodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
  lastUpdated: Date.now()
});
```

## Benefits

✅ **Real-time** - Convex reactive queries update automatically
✅ **Organization-aware** - Supports both user and organization usage
✅ **Modular** - Each card is independently reusable
✅ **Type-safe** - Full TypeScript support
✅ **Testable** - Easy to unit test components
✅ **Maintainable** - Changes isolated to specific components
✅ **Scalable** - Periodic tracking prevents data bloat
