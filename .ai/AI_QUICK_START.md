# 🤖 Quick Start for AI Development

**New to BetterCone? Using AI tools? Start here!**

## ⚡ 60-Second Setup

### 1. Clone & Install (2 minutes)

```bash
git clone https://github.com/vncsleal/bettercone.git
cd bettercone
pnpm install
```

### 2. Start Convex Backend (1 minute)

```bash
cd packages/convex
pnpm convex dev
```

This opens browser → create/select Convex project

### 3. Configure Environment (1 minute)

```bash
cd ../../apps/web
cp .env.example .env.local
```

Add to `.env.local`:
- `CONVEX_DEPLOYMENT` (from step 2)
- `NEXT_PUBLIC_CONVEX_URL` (from step 2)
- `BETTER_AUTH_SECRET` (generate: `openssl rand -base64 32`)
- `BETTER_AUTH_URL=http://localhost:3000`

### 4. Start Frontend (30 seconds)

```bash
cd ../..  # Back to root
pnpm dev
```

Open http://localhost:3000 🎉

---

## 🤖 Using AI Tools

### With Cursor

**Cursor reads `.cursorrules` automatically!**

Just start coding and Cursor will:
- ✅ Suggest Convex queries (not SQL)
- ✅ Use Better Auth (not NextAuth)
- ✅ Add organization scoping
- ✅ Check permissions
- ✅ Use shadcn/ui components

**Try this:**
```
Cmd+L (open Cursor chat)
Type: "Add a 'projects' feature with CRUD operations"
Cursor: [generates following BetterCone patterns]
```

### With Claude / ChatGPT

**Start every session with context:**

```
I'm using BetterCone. Here's the llms.txt file:

[Paste contents of llms.txt]

Now, add [YOUR FEATURE]
```

Or shorter version:

```
I'm using BetterCone:
- Next.js 15 + Convex backend (TypeScript, no SQL)
- Better Auth (don't add NextAuth)
- Stripe billing (already integrated)
- Multi-tenant organizations
- shadcn/ui components

Add [YOUR FEATURE] following existing patterns.
```

### With v0.dev

**Reference existing components:**

```
Create a dashboard page using shadcn/ui components.

Layout similar to BetterCone's demo/organization page:
- Card components for stats
- Table for data
- Dialog for create/edit
- Button components

Use Tailwind CSS for styling.
```

### With Lovable / Bolt

**Use feature templates:**

```
Create a "tasks" feature using this CRUD pattern:

[Paste from .ai/feature-templates.md]

Customize:
- Replace FEATURE_NAME with "tasks"
- Add fields: title, description, status, dueDate
- Add assignedTo field (userId)
```

---

## 📚 AI Resources in BetterCone

### Core Files

| File | What AI Reads | Use When |
|------|--------------|----------|
| `llms.txt` | Complete project context | Starting new chat with Claude/ChatGPT |
| `.cursorrules` | Cursor AI configuration | Using Cursor (automatic) |
| `.ai/context.md` | Quick reference | Need fast lookup of patterns |
| `.ai/feature-templates.md` | Code scaffolds | Adding new CRUD feature |
| `docs/AI_PROMPTS.md` | 300+ prompts | Need specific functionality |

### When to Use What

**Adding Basic CRUD Feature**
1. Open `.ai/feature-templates.md`
2. Copy CRUD template
3. Find/replace `FEATURE_NAME` with yours
4. Customize fields

**Adding Complex Feature**
1. Open `docs/AI_PROMPTS.md`
2. Find relevant section (e.g., "Project Management")
3. Copy prompt
4. Paste to AI tool
5. Customize to your needs

**Understanding Architecture**
1. Open `llms.txt`
2. Read "Architecture Overview"
3. Check "Key Patterns to Follow"
4. Review file structure

**Quick Pattern Lookup**
1. Open `.ai/context.md`
2. Find section (auth, permissions, etc.)
3. Copy pattern
4. Adapt to your code

---

## 🎯 Example: Add Feature in 10 Minutes

Let's add a "clients" feature with full CRUD!

### Step 1: Schema (2 min)

Tell AI:
```
Add to packages/convex/convex/schema.ts:

clients table with:
- organizationId
- name (string)
- email (string)
- phone (optional string)
- status (string: "active" | "inactive")
- createdAt, updatedAt, createdBy

Add index by_organization
```

### Step 2: Backend (3 min)

Tell AI:
```
Create packages/convex/convex/clients.ts

Add 5 functions following BetterCone patterns:
- list (query, filter by organizationId)
- get (query, check permissions)
- create (mutation, admin/owner only)
- update (mutation, admin/owner only)
- remove (mutation, owner only)

Use getUserId from "./betterAuth/getUserId"
Check organizationMembers for permissions
```

### Step 3: Frontend (4 min)

Tell AI:
```
Create apps/web/src/app/demo/clients/page.tsx

Features:
- List clients in table (shadcn Table component)
- Add client button opens Dialog
- Form with react-hook-form + zod
- Edit and delete actions
- Empty state with friendly message
- Loading state with Skeleton

Use:
- useQuery(api.clients.list)
- useMutation(api.clients.create, update, remove)
- useOrganization() hook
- shadcn/ui components only
```

### Step 4: Navigation (1 min)

Tell AI:
```
Add navigation link in apps/web/src/components/demo-layout.tsx

Add after "Organization" link:
- Icon: Users (from lucide-react)
- Label: "Clients"
- href: "/demo/clients"
```

### Step 5: Test (as you go)

After each step:
1. Save files
2. Check browser (Convex auto-syncs)
3. Test functionality
4. Fix any issues

**Total time: ~10 minutes!** ⚡

---

## 💡 Pro Tips

### 1. Reference Existing Code

```
Follow the pattern from packages/convex/convex/organizations.ts
```

AI will look at that file and match the style.

### 2. Be Specific

❌ "Add user management"  
✅ "Add user management with list, create, edit, delete. Admin/owner only. Use shadcn Table and Dialog."

### 3. One Thing at a Time

Instead of "Add projects with tasks and comments":
1. Add projects first
2. Add tasks
3. Add comments
4. Link them together

### 4. Use Context Prefix

In Cursor:
```
@context.md @schema.ts Add a new table...
```

This gives AI the full context.

### 5. Verify Output

Always check:
- [ ] Uses `organizationId` for multi-tenancy
- [ ] Checks permissions before mutations
- [ ] Has indexes for query patterns
- [ ] Uses shadcn/ui components
- [ ] Handles loading/error states

---

## 🚨 Common Mistakes (AI Makes These!)

### ❌ WRONG

```typescript
// DON'T: Adding NextAuth
import { getServerSession } from "next-auth"

// DON'T: Adding Prisma
const prisma = new PrismaClient()

// DON'T: SQL queries
await db.query("SELECT * FROM users")

// DON'T: Hardcoding organization
const items = await ctx.db.query("items").collect()

// DON'T: Skipping permission checks
return await ctx.db.insert("items", args)
```

### ✅ CORRECT

```typescript
// DO: Use Better Auth
import { useSession } from "@/lib/auth-client"

// DO: Use Convex
import { query } from "./_generated/server"

// DO: TypeScript queries
return await ctx.db.query("items").collect()

// DO: Scope by organization
const items = await ctx.db
  .query("items")
  .withIndex("by_organization", (q) => 
    q.eq("organizationId", args.organizationId)
  )
  .collect()

// DO: Check permissions
const member = await ctx.db
  .query("organizationMembers")
  .withIndex("by_organization_user", (q) =>
    q.eq("organizationId", args.organizationId)
     .eq("userId", userId)
  )
  .first()

if (!member || member.role !== "admin") {
  throw new Error("No permission")
}
```

---

## 🎓 Learning Resources

### Essential Reading (5 minutes each)

1. **llms.txt** - Complete project overview
2. **.ai/context.md** - Quick patterns reference
3. **docs/AI_DEVELOPMENT_GUIDE.md** - Full guide (15 pages)

### When You Need Help

1. **Architecture question?** → Read `llms.txt`
2. **How to implement X?** → Check `docs/AI_PROMPTS.md`
3. **Code example?** → Check `.ai/feature-templates.md`
4. **Quick pattern?** → Check `.ai/context.md`

### External Docs

- **Convex:** https://docs.convex.dev
- **Better Auth:** https://www.better-auth.com
- **shadcn/ui:** https://ui.shadcn.com
- **Next.js:** https://nextjs.org/docs

---

## 🎉 You're Ready!

**What you now have:**
- ✅ Running BetterCone locally
- ✅ AI tools configured
- ✅ Know where to find resources
- ✅ Can add features in minutes

**Next steps:**
1. Try adding simple feature (e.g., "notes")
2. Use prompts from library
3. Reference existing code
4. Ship! 🚀

---

## 🆘 Troubleshooting

### AI suggests wrong technology

**Problem:** AI suggests NextAuth or Prisma  
**Solution:** Start prompt with "I'm using BetterCone with Convex and Better Auth. DON'T add NextAuth or Prisma."

### Code doesn't compile

**Problem:** Type errors after AI generates code  
**Solution:** 
1. Check Convex is running: `cd packages/convex && pnpm convex dev`
2. Restart VS Code/Cursor
3. Run `pnpm type-check`

### Query returns no data

**Problem:** Data not showing up  
**Solution:**
1. Check you're passing `organizationId`
2. Verify index exists in schema
3. Check user is member of organization

### Permission denied errors

**Problem:** "Not authorized" errors  
**Solution:**
1. Verify `getUserId` is called
2. Check `organizationMembers` query
3. Verify user has correct role

---

**Happy coding with AI! 🤖✨**

Questions? Check `docs/AI_DEVELOPMENT_GUIDE.md` or open an issue!
