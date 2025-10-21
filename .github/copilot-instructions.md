# GitHub Copilot Instructions for BetterCone

## Project Context

BetterCone is a production-ready B2B SaaS starter built for AI-powered development. Help developers extend it without breaking existing functionality.

## Technology Stack

- **Backend:** Convex (TypeScript, no SQL)
- **Frontend:** Next.js 15 (App Router)
- **Auth:** Better Auth (DON'T suggest NextAuth)
- **Database:** Convex (DON'T suggest Prisma/Drizzle)
- **Billing:** Stripe (already integrated)
- **UI:** shadcn/ui + Tailwind CSS
- **Email:** Resend + React Email

## Code Suggestions - DO These

✅ **Suggest Convex queries/mutations** when database operations needed
✅ **Suggest shadcn/ui components** for UI elements
✅ **Suggest organization-scoped logic** for all data operations
✅ **Suggest permission checks** before mutations
✅ **Suggest TypeScript types** from Convex schema
✅ **Suggest React Server Components** by default
✅ **Suggest Better Auth hooks** (`useSession` from `@/lib/auth-client`, `authClient.useActiveOrganization()`)
✅ **Suggest Better Auth UI components** (`<OrganizationSwitcher />`, `<SettingsCards />`, `<UserButton />`)

## Code Suggestions - DON'T These

❌ **DON'T suggest NextAuth** - We use Better Auth
❌ **DON'T suggest Prisma/Drizzle** - We use Convex
❌ **DON'T suggest SQL queries** - Use Convex TypeScript
❌ **DON'T suggest new auth logic** - Use existing
❌ **DON'T suggest global data** - Always scope by organization
❌ **DON'T suggest new UI libraries** - Use shadcn/ui
❌ **DON'T suggest hardcoded IDs** - Use context hooks

## Common Patterns

### When User Types: "add authentication check"

```typescript
// Suggest this pattern
import { useSession } from "@/lib/auth-client";

const { data: session } = useSession();
if (!session) return <div>Not authenticated</div>;
```

### When User Types: "query database"

```typescript
// Suggest Convex query pattern
import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { authClient } from "@/lib/auth-client";

// Get active organization from Better Auth
const { data: activeOrg } = authClient.useActiveOrganization();

const items = useQuery(
  api.yourFeature.list,
  activeOrg?.id 
    ? { organizationId: activeOrg.id }
    : "skip"
);
```

### When User Types: "create mutation"

```typescript
// Suggest Convex mutation pattern
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { 
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // Check permissions
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", args.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member");
    
    return await ctx.db.insert("yourTable", {
      ...args,
      createdAt: Date.now(),
      createdBy: userId,
    });
  },
});
```

### When User Types: "add form"

```typescript
// Suggest react-hook-form + zod pattern
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### When User Types: "add button" or "add card"

```typescript
// Suggest shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

## File Locations

When suggesting new files:

- **Backend logic:** `packages/convex/convex/yourFeature.ts`
- **Schema:** `packages/convex/convex/schema.ts`
- **Frontend pages:** `apps/web/src/app/demo/your-feature/page.tsx`
- **Components:** `apps/web/src/components/your-feature/`
- **Emails:** `apps/web/src/emails/your-email.tsx`

## Auto-Complete Context

When user types these imports, suggest:

```typescript
// "import { use" → suggest
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation } from "convex/react";

// Better Auth hooks (from authClient)
const { data: activeOrg } = authClient.useActiveOrganization();
const { data: organizations } = authClient.useListOrganizations();

// "import { api" → suggest
import { api } from "@repo/convex";

// "from '@/components/ui/" → suggest shadcn components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// "from '@daveyplate/better-auth-ui" → suggest Better Auth UI components
import { OrganizationSwitcher, UserButton, SettingsCards, SignedIn, SignedOut } from '@daveyplate/better-auth-ui';
```

## Schema Auto-Complete

When user edits `schema.ts`, suggest these patterns:

```typescript
// Always include organizationId for multi-tenancy
yourTable: defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  createdAt: v.number(),
  createdBy: v.id("users"),
})
.index("by_organization", ["organizationId"])
```

## Convex Function Auto-Complete

When user creates new file in `packages/convex/convex/`:

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./betterAuth/getUserId";

export const list = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    // ... implementation
  },
});
```

## Page Auto-Complete

When user creates new file in `apps/web/src/app/demo/`:

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { authClient } from "@/lib/auth-client";

export default function YourFeaturePage() {
  // Get active organization from Better Auth
  const { data: activeOrg } = authClient.useActiveOrganization();
  
  // Query with organization scope
  const items = useQuery(
    api.yourFeature.list,
    activeOrg?.id ? { organizationId: activeOrg.id } : "skip"
  );
  
  // ... implementation
}
```

## Priority Suggestions

1. **Always suggest organization scoping** for data operations
2. **Always suggest permission checks** for mutations
3. **Always suggest TypeScript types** from Convex
4. **Always suggest shadcn/ui** for UI components
5. **Always suggest existing patterns** from codebase

## Learning Context

Copilot should learn from these files:
- `packages/convex/convex/schema.ts` - Database schema patterns
- `packages/convex/convex/*.ts` - Backend function patterns
- `apps/web/src/app/demo/*/page.tsx` - Page component patterns
- `apps/web/src/components/ui/*` - UI component usage
- `docs/AI_DEVELOPMENT_GUIDE.md` - Best practices

## Response Tone

- Be helpful and constructive
- Suggest existing solutions before new code
- Point to relevant documentation
- Remind about multi-tenancy when needed
- Warn about common mistakes (NextAuth, Prisma, etc.)
