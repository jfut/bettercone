# 🤖 AI Development Guide

**How to use BetterCone with AI coding tools (v0, Cursor, Lovable, Bolt, etc.)**

---

## 🎯 Why BetterCone + AI is Powerful

### The Problem with AI-Only Development

When you ask AI to build a SaaS from scratch:
- ❌ Inconsistent authentication patterns
- ❌ Reinvents billing logic (often wrong)
- ❌ No multi-tenancy patterns
- ❌ Security vulnerabilities
- ❌ Each feature in different styles
- ❌ No established architecture

### The BetterCone + AI Solution

When you build on BetterCone:
- ✅ AI extends proven patterns
- ✅ Auth/billing already perfect
- ✅ Multi-tenancy built-in
- ✅ Security best practices
- ✅ Consistent codebase
- ✅ Clear architecture to follow

---

## 🚀 Getting Started with AI Tools

### Step 1: Clone BetterCone

```bash
git clone https://github.com/vncsleal/bettercone.git my-saas
cd my-saas
pnpm install
```

### Step 2: Understand the Structure

**Tell your AI about the foundation:**

```
I'm building on BetterCone, a B2B SaaS starter with:
- Convex backend (TypeScript, no SQL)
- Better Auth for authentication
- Stripe for billing
- Next.js 15 App Router
- shadcn/ui components

Key files:
- packages/convex/convex/schema.ts - Database schema
- packages/convex/convex/ - Backend functions
- apps/web/src/app/ - Frontend pages
- apps/web/src/components/ - React components
```

### Step 3: Build Your Features

Now AI can focus on YOUR unique features!

---

## 💡 Example Prompts That Work Great

### ✅ Adding New Features

**Good Prompt:**
```
I have BetterCone set up with Convex and Better Auth.

Add a "projects" feature:
- New table in Convex schema (linked to organizations)
- Create/edit/delete project pages
- Show projects list for current organization
- Respect organization permissions (owner/admin can edit)
- Use shadcn/ui components for UI

Follow the existing patterns in the codebase.
```

**Why it works:** AI extends existing patterns instead of creating new ones.

### ✅ Adding Custom Workflows

**Good Prompt:**
```
In my BetterCone app, add a task management system:

1. Convex schema:
   - tasks table (linked to projects and users)
   - Fields: title, description, status, priority, assignee

2. UI components:
   - Task list with filters (status, assignee)
   - Task detail modal
   - Quick-add task button
   - Use existing shadcn/ui components

3. Permissions:
   - Organization members can view tasks
   - Task creator + admins can edit
   - Follow existing role-based patterns

Reference: apps/web/src/app/demo/organization for permission patterns
```

**Why it works:** Specific references to existing patterns, clear structure.

### ✅ Customizing Billing

**Good Prompt:**
```
I'm using BetterCone's Stripe integration.

Modify the pricing to:
- Starter: $0 (5 projects)
- Growth: $49/mo (50 projects)  
- Business: $199/mo (unlimited)

Update:
1. packages/convex/convex/subscriptionPlans.ts
2. apps/web/src/components/pricing/plans.ts
3. Keep existing Stripe webhook logic
4. Add project limit checks

Use existing patterns for plan limits.
```

**Why it works:** Works with existing infrastructure, clear files to modify.

---

## 🎨 AI Tool-Specific Tips

### Cursor / Copilot

**Best Practice:** Use `@workspace` to reference BetterCone patterns

```
@workspace How do I add a new table to Convex schema?
@workspace Show me the pattern for protected organization pages
@workspace How is role-based access implemented?
```

**Pro Tip:** Cursor learns your codebase. The more you work, the better it gets.

### v0.dev

**Best Practice:** Generate UI components that match shadcn/ui

```
Create a dashboard card component that:
- Uses shadcn/ui Card component
- Matches BetterCone's design system
- Shows project stats
- Has dark mode support
```

**Pro Tip:** Copy existing shadcn/ui components from BetterCone as reference.

### Lovable / Bolt

**Best Practice:** Build features as isolated components first

```
Build a "project kanban board" component:
- Use existing BetterCone types
- Import from @/components/ui
- Connect to Convex later
- Follow existing patterns
```

**Pro Tip:** Test components in `/demo` pages before production.

### Claude / ChatGPT (Code Generation)

**Best Practice:** Provide full context about BetterCone

```
I'm using BetterCone (https://github.com/vncsleal/bettercone).

It has:
- Convex backend (TypeScript functions)
- Better Auth (authentication handled)
- Organizations (multi-tenant)
- Stripe (billing handled)

I want to add [feature]. Follow these patterns:
1. [paste relevant code example from BetterCone]
2. [explain the pattern]

Generate code that extends this pattern.
```

**Pro Tip:** Paste actual code from BetterCone as examples.

---

## 📚 Key Patterns AI Should Follow

### 1. Convex Queries/Mutations

**Pattern to follow:** `packages/convex/convex/*.ts`

```typescript
// AI should generate code like this:
export const createProject = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check authentication (existing pattern)
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // Check organization membership (existing pattern)
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", userId)
      )
      .first();
      
    if (!member) throw new Error("Not a member");
    
    // Create project
    return await ctx.db.insert("projects", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
      createdBy: userId,
    });
  },
});
```

**Tell AI:** "Follow the Convex patterns in packages/convex/convex/"

### 2. Organization-Scoped Pages

**Pattern to follow:** `apps/web/src/app/demo/organization/`

```typescript
// AI should follow this structure:
export default function ProjectsPage() {
  // 1. Get current organization (existing pattern)
  const { currentOrganization } = useOrganization();
  
  // 2. Fetch organization data (Convex query)
  const projects = useQuery(
    api.projects.listByOrganization,
    currentOrganization?.id 
      ? { organizationId: currentOrganization.id }
      : "skip"
  );
  
  // 3. Use existing UI components
  return (
    <div>
      <h1>{currentOrganization?.name} - Projects</h1>
      {projects?.map(project => (
        <Card key={project._id}>
          {/* shadcn/ui components */}
        </Card>
      ))}
    </div>
  );
}
```

**Tell AI:** "Follow the organization patterns in apps/web/src/app/demo/organization/"

### 3. Permission Checks

**Pattern to follow:** Existing role-based logic

```typescript
// AI should use existing permission patterns:
const canEdit = 
  member.role === "owner" || 
  member.role === "admin";

if (!canEdit) {
  return <div>No permission</div>;
}
```

**Tell AI:** "Use the same permission patterns as organization member management"

---

## 🎯 Best Practices for AI Development

### 1. Start with Schema

Always have AI define the Convex schema first:

```typescript
// Tell AI: "First, add to packages/convex/convex/schema.ts"
projects: defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  description: v.optional(v.string()),
  status: v.union(v.literal("active"), v.literal("archived")),
  createdAt: v.number(),
  createdBy: v.id("users"),
})
.index("by_organization", ["organizationId"])
```

**Why:** Schema-first ensures type safety everywhere.

### 2. Reference Existing Code

Always point AI to similar features:

```
"Create a projects list page similar to:
apps/web/src/app/demo/organization/page.tsx

But for projects instead of organizations."
```

**Why:** AI understands by example better than abstract instructions.

### 3. Build Incrementally

Don't ask AI to build everything at once:

```
Step 1: "Add projects table to schema"
Step 2: "Add Convex query to list projects"
Step 3: "Create projects list page component"
Step 4: "Add create project form"
```

**Why:** Easier to debug, better results.

### 4. Test as You Go

Use the `/demo` pages to test:

```
"Create a demo page at apps/web/src/app/demo/projects/
that shows the new projects feature"
```

**Why:** Isolate testing from production code.

---

## 🚨 Common AI Pitfalls (and How to Avoid)

### ❌ AI wants to add NextAuth
**Fix:** "We use Better Auth, it's already configured. Don't add NextAuth."

### ❌ AI suggests Prisma/Drizzle
**Fix:** "We use Convex, not SQL. Add to packages/convex/convex/schema.ts"

### ❌ AI creates new auth logic
**Fix:** "Auth is handled by Better Auth. Just use the session context."

### ❌ AI hardcodes organization ID
**Fix:** "Use the useOrganization() hook from our context, not hardcoded IDs."

### ❌ AI creates new component library
**Fix:** "Use shadcn/ui components from @/components/ui/, already installed."

### ❌ AI rebuilds billing
**Fix:** "Stripe is integrated. Just check subscription.plan for limits."

---

## 💡 Advanced AI Techniques

### Technique 1: Context Files

Create `.cursorrules` or `.ai-context` in your repo:

```
# BetterCone Context

## Stack
- Convex backend (TypeScript, no SQL)
- Better Auth (authentication handled)
- Next.js 15 App Router
- shadcn/ui components
- Stripe (billing handled)

## Patterns to Follow
- Always use Convex queries/mutations
- Check authentication with getUserId(ctx)
- Check organization membership
- Use shadcn/ui components
- Follow existing folder structure

## Never Do
- Don't add new auth systems
- Don't add SQL/Prisma
- Don't create new UI libraries
- Don't hardcode organization IDs
```

### Technique 2: Feature Templates

Create templates for AI to follow:

```typescript
// template: new-feature.ts
// AI: Follow this pattern for new features

// 1. Schema (packages/convex/convex/schema.ts)
yourFeature: defineTable({
  organizationId: v.id("organizations"),
  // ... your fields
}).index("by_organization", ["organizationId"])

// 2. Query (packages/convex/convex/yourFeature.ts)
export const list = query({...})
export const get = query({...})
export const create = mutation({...})
export const update = mutation({...})
export const remove = mutation({...})

// 3. Page (apps/web/src/app/demo/your-feature/page.tsx)
export default function YourFeaturePage() {
  const { currentOrganization } = useOrganization();
  const items = useQuery(api.yourFeature.list, {...});
  // ... use shadcn/ui components
}
```

### Technique 3: Documentation Prompts

Have AI read your docs:

```
"Read docs/PROJECT_STRUCTURE.md and docs/EMAIL_SERVICE.md
then add email notifications for new projects."
```

---

## 🎓 Learning Resources

### Understand the Foundation

Before using AI extensively, understand:

1. **Convex basics** - [convex.dev/docs](https://docs.convex.dev)
   - How queries/mutations work
   - How indexes work
   - How to define schema

2. **Better Auth patterns** - [better-auth.com](https://www.better-auth.com)
   - How session works
   - How to check authentication
   - How to add OAuth providers

3. **Organization patterns** - `apps/web/src/app/demo/organization/`
   - How multi-tenancy works
   - How roles work
   - How to scope data

### AI-Friendly Documentation

BetterCone has extensive docs AI can reference:
- `docs/PROJECT_STRUCTURE.md` - Architecture
- `docs/EMAIL_SERVICE.md` - Email patterns
- `docs/ENVIRONMENT_VARIABLES.md` - Config
- `QUICK_REFERENCE.md` - Common tasks

**Pro Tip:** Tell AI to read these before generating code.

---

## 🚀 Example: Building a Complete Feature with AI

Let's build a "Project Management" feature step-by-step with AI.

### Prompt 1: Schema

```
I'm using BetterCone with Convex.

Add a projects table to packages/convex/convex/schema.ts:
- organizationId (linked to organizations)
- name (string)
- description (optional string)
- status (enum: "active" | "completed" | "archived")
- createdAt (number - timestamp)
- createdBy (user ID)
- updatedAt (number - timestamp)

Add index by_organization on organizationId.
Follow the existing table patterns in the schema.
```

### Prompt 2: Backend Functions

```
Create packages/convex/convex/projects.ts with:

1. listByOrganization query:
   - Takes organizationId
   - Returns all projects for that org
   - Include creator user info
   - Follow the existing query patterns

2. createProject mutation:
   - Check user auth (like other mutations)
   - Check user is org member
   - Create project
   - Return project ID

3. updateProject mutation:
   - Check permissions (owner/admin only)
   - Update project fields
   - Update updatedAt timestamp

Follow existing Convex patterns in this directory.
```

### Prompt 3: Frontend Page

```
Create apps/web/src/app/demo/projects/page.tsx:

- Use useOrganization() hook for current org
- Use useQuery to get projects from api.projects.listByOrganization
- Show projects in a grid using shadcn/ui Card components
- Add "New Project" button
- Show project name, description, status badge
- Make it responsive
- Add dark mode support

Follow the patterns in apps/web/src/app/demo/organization/page.tsx
```

### Prompt 4: Create Form

```
Create apps/web/src/components/projects/create-project-dialog.tsx:

- Use shadcn/ui Dialog component
- Form with react-hook-form + zod validation
- Fields: name (required), description (optional)
- On submit: call useMutation(api.projects.createProject)
- Show loading state
- Show success toast
- Close dialog on success

Follow the form patterns in apps/web/src/components/
```

### Prompt 5: Polish

```
Add these improvements to the projects feature:

1. Empty state when no projects (use shadcn/ui)
2. Loading skeleton while fetching
3. Error boundary for errors
4. Filter by status (tabs)
5. Search by name

Follow existing patterns for loading/error states.
```

---

## 🎉 Result

In 30 minutes with AI:
- ✅ Complete project management feature
- ✅ Respects auth & organizations
- ✅ Follows BetterCone patterns
- ✅ Production-ready code
- ✅ Consistent with existing codebase

**Without BetterCone:** AI would spend hours on auth, organizations, billing, etc.
**With BetterCone:** AI focuses on YOUR unique feature.

---

## 💬 Community

Share your AI + BetterCone experiences:
- GitHub Discussions: [Coming soon]
- Discord: [Coming soon]
- Twitter: #BetterCone

---

**Made with 🍦 and 🤖**

*BetterCone: The AI-ready foundation for B2B SaaS*
