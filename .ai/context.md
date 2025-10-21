# BetterCone Context for AI Tools

This file provides essential context for AI coding assistants. Reference this when working on BetterCone.

## 🏗️ Architecture Overview

### Tech Stack
- **Backend:** Convex (serverless TypeScript functions)
- **Frontend:** Next.js 15 (App Router, React Server Components)
- **Auth:** Better Auth 1.3.27
- **Database:** Convex (TypeScript schema, no SQL)
- **Billing:** Stripe
- **UI:** shadcn/ui + Tailwind CSS
- **Email:** Resend + React Email

### Key Concepts

1. **Multi-tenancy:** All data scoped by `organizationId`
2. **Type Safety:** TypeScript everywhere, Convex generates types
3. **Real-time:** Convex queries auto-update on changes
4. **No SQL:** All database operations are TypeScript functions
5. **Server Components:** Default in Next.js, use `"use client"` only when needed

## 📁 Critical File Locations

### Backend (Convex)
```
packages/convex/convex/
├── schema.ts                    # Database schema - SINGLE SOURCE OF TRUTH
├── auth.ts                      # Better Auth integration - DON'T MODIFY
├── subscriptionPlans.ts         # Billing tiers configuration
├── apiKeys.ts                   # API key management
├── organizations.ts             # Organization CRUD
├── organizationMembers.ts       # Team management
├── subscriptions.ts             # Stripe subscription logic
├── rateLimit.ts                 # Rate limiting
├── betterAuth/                  # Auth adapter - DON'T MODIFY
│   ├── adapter.ts
│   ├── auth.ts
│   └── getUserId.ts
└── _generated/                  # Auto-generated types - DON'T MODIFY
```

### Frontend (Next.js)
```
apps/web/src/
├── app/
│   ├── layout.tsx               # Root layout with providers
│   ├── providers.tsx            # Convex + Auth providers
│   ├── api/auth/[...all]/route.ts  # Better Auth API - DON'T MODIFY
│   ├── demo/                    # Feature pages (add yours here)
│   │   ├── user/
│   │   ├── organization/
│   │   ├── billing/
│   │   └── security/
│   └── auth/                    # Auth flows - DON'T MODIFY
├── components/
│   ├── ui/                      # shadcn/ui components - USE THESE
│   ├── header.tsx
│   ├── demo-layout.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── auth-client.ts           # Auth client - DON'T MODIFY
│   ├── ConvexClientProvider.tsx # Convex setup - DON'T MODIFY
│   └── utils.ts
└── emails/                      # React Email templates
    ├── welcome-email.tsx
    └── team-invitation-email.tsx
```

## 🔑 Key Patterns

### 1. Authentication

```typescript
// Client-side - Get current session (Better Auth hook)
import { useSession } from "@/lib/auth-client";

const { data: session, isPending, error } = useSession();
if (isPending) return <div>Loading...</div>;
if (!session) return <div>Not authenticated</div>;

// Access user data
console.log(session.user.name, session.user.email);

// Server-side (Convex) - Get user ID
import { getUserId } from "./betterAuth/getUserId";

const userId = await getUserId(ctx);
if (!userId) throw new Error("Unauthorized");

// Server-side (Next.js API/RSC) - Get session
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});
```

### 2. Organization Context

```typescript
// IMPORTANT: There is NO useOrganization hook in Better Auth!
// Organization context is handled internally by Better Auth UI components

// Option 1: Use Better Auth UI components (recommended)
import { OrganizationSwitcher } from '@daveyplate/better-auth-ui';
// Component handles organization context automatically

// Option 2: Use Better Auth hooks directly
import { authClient } from "@/lib/auth-client";
const { data: activeOrg } = authClient.useActiveOrganization();
const { data: organizations } = authClient.useListOrganizations();

// Pass organization ID to queries
const data = useQuery(
  api.yourFeature.list,
  activeOrg?.id 
    ? { organizationId: activeOrg.id }
    : "skip"  // Don't run query if no org selected
);
```

### 3. Permission Checks

```typescript
// In Convex mutations - always check role
const member = await ctx.db
  .query("organizationMembers")
  .withIndex("by_organization_user", (q) =>
    q.eq("organizationId", args.organizationId)
     .eq("userId", userId)
  )
  .first();

if (!member) throw new Error("Not a member");

// Role-based permissions
if (member.role !== "owner" && member.role !== "admin") {
  throw new Error("Only admins and owners can perform this action");
}
```

### 4. Convex Query Pattern

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  // Define args with validation
  args: { 
    organizationId: v.id("organizations"),
  },
  // Implement handler
  handler: async (ctx, args) => {
    // 1. Auth check
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // 2. Permission check
    // ... verify membership
    
    // 3. Query data with index
    return await ctx.db
      .query("yourTable")
      .withIndex("by_organization", (q) => 
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});
```

### 5. Convex Mutation Pattern

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { 
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Auth check
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // 2. Permission check (admin/owner only for creates)
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", args.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member");
    if (member.role !== "owner" && member.role !== "admin") {
      throw new Error("Only admins and owners can create");
    }
    
    // 3. Insert data
    return await ctx.db.insert("yourTable", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
      createdBy: userId,
      updatedAt: Date.now(),
    });
  },
});
```

## 🚫 Common Mistakes to Avoid

### DON'T Do These

1. ❌ Add NextAuth - we use Better Auth
2. ❌ Add Prisma/Drizzle - we use Convex
3. ❌ Write SQL queries - use Convex TypeScript
4. ❌ Use `useOrganization()` hook - **IT DOESN'T EXIST!** Use `authClient.useActiveOrganization()` or Better Auth UI components
5. ❌ Skip permission checks - always verify roles
6. ❌ Forget indexes - add to schema for query patterns
7. ❌ Add new UI library - use shadcn/ui
8. ❌ Rebuild auth/billing - extend existing
9. ❌ Manually manage organization context - use Better Auth UI components (they handle it internally)

### DO These

1. ✅ Use `useSession()` from `@/lib/auth-client` for authentication
2. ✅ Scope all queries by `organizationId`
3. ✅ Check permissions before mutations
4. ✅ Add indexes for query patterns
5. ✅ Use shadcn/ui components
6. ✅ Follow existing code patterns
7. ✅ Use TypeScript strictly
8. ✅ Handle loading/error states
9. ✅ Use Better Auth UI components (`<OrganizationSwitcher />`, `<SettingsCards />`, `<UserButton />`)
10. ✅ Let Better Auth UI components handle organization context automatically

## 🎨 UI Component Usage

### shadcn/ui Components
```typescript
// Always import from @/components/ui/
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
```

### Better Auth UI Components (Pre-built Auth Features)
```typescript
// Import from '@daveyplate/better-auth-ui'
import { 
  OrganizationSwitcher,  // Switch between organizations and personal account
  UserButton,            // User menu with avatar, settings, sign out
  SettingsCards,         // Complete settings UI (account, security, organizations)
  SignedIn,              // Render children only if authenticated
  SignedOut,             // Render children only if NOT authenticated
  RedirectToSignIn,      // Redirect to sign-in if not authenticated
  AuthLoading            // Show loading state during auth check
} from '@daveyplate/better-auth-ui';

// Example: Protected page with organization switcher
function Dashboard() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <OrganizationSwitcher />
        <h1>Dashboard</h1>
      </SignedIn>
    </>
  );
}

// Example: User profile button
function Header() {
  return (
    <nav>
      <SignedOut>
        <Button>Sign In</Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
```

### Custom Billing Components (BetterCone)
```typescript
// These handle organization context internally - no props needed!
import { BillingDashboard } from '@/components/billing/billing-dashboard';
import { PricingDashboard } from '@/components/billing/pricing-dashboard';

// BillingDashboard - NO props needed, auto-detects current organization
<BillingDashboard />

// PricingDashboard - accepts optional config
<PricingDashboard 
  successUrl="/billing"
  cancelUrl="/pricing"
  defaultInterval="monthly"
  showFooter={false}
/>
```

## 📊 Schema Conventions

```typescript
// Standard fields for all tables
yourTable: defineTable({
  // Required: Organization scoping
  organizationId: v.id("organizations"),
  
  // Your fields
  name: v.string(),
  description: v.optional(v.string()),
  
  // Standard timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
  
  // Optional: Track creator
  createdBy: v.id("users"),
})
// Required: Index for organization queries
.index("by_organization", ["organizationId"])
// Optional: Additional indexes
.index("by_created_by", ["createdBy"])
```

## 🔐 Permission Levels

- **Owner:** Full control, can delete organization
- **Admin:** Can manage members, create/edit/delete resources
- **Member:** Can view resources, limited editing

## 🌐 Environment Variables

Required for development:

```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## 🧪 Development Workflow

1. **Start Convex:** `cd packages/convex && pnpm convex dev`
2. **Start Next.js:** `pnpm dev`
3. **Make changes:** Edit files
4. **Convex syncs automatically** - types regenerate
5. **Test in browser:** http://localhost:3000

## 📖 Documentation References

- **AI Development Guide:** `docs/AI_DEVELOPMENT_GUIDE.md`
- **AI Prompts Library:** `docs/AI_PROMPTS.md`
- **Feature Templates:** `.ai/feature-templates.md`
- **Project Structure:** `docs/PROJECT_STRUCTURE.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **Full Context:** `llms.txt`

## 🎯 When Adding New Features

1. **Define schema** in `packages/convex/convex/schema.ts`
2. **Create backend** file `packages/convex/convex/yourFeature.ts`
3. **Create page** in `apps/web/src/app/demo/your-feature/page.tsx`
4. **Add navigation** link in `apps/web/src/components/demo-layout.tsx`
5. **Test thoroughly** - auth, permissions, edge cases

## 💡 Quick Tips

- **Convex Dashboard:** https://dashboard.convex.dev
- **Run Convex function:** Use dashboard to test backend functions
- **Preview emails:** `cd apps/web && pnpm email`
- **Type errors?** Restart Convex dev server to regenerate types
- **Missing imports?** Check if running from correct directory (monorepo)

## 🆘 Getting Help

- GitHub Issues: https://github.com/vncsleal/bettercone/issues
- GitHub Discussions: https://github.com/vncsleal/bettercone/discussions
- Convex Docs: https://docs.convex.dev
- Better Auth Docs: https://www.better-auth.com
- shadcn/ui Docs: https://ui.shadcn.com

---

**Remember:** BetterCone provides the foundation (auth, billing, teams). Your job is to build your unique features on top!
