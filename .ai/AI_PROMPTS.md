# AI Prompts Library for BetterCone

A collection of battle-tested prompts for building features with AI coding tools (Cursor, v0, Claude, ChatGPT, etc.)

## 🎯 Quick Start Prompts

### 1. Initial Context Setting

```
I'm working with BetterCone, a B2B SaaS starter with:
- Convex backend (TypeScript, no SQL)
- Next.js 15 frontend (App Router)
- Better Auth (already configured)
- Stripe billing (already integrated)
- Multi-tenant organizations (data isolation)

Read the llms.txt file for full context.

I want to add [YOUR FEATURE]. Follow existing patterns in the codebase.
```

### 2. Add Complete CRUD Feature

```
Add a "projects" feature to BetterCone:

1. Schema (packages/convex/convex/schema.ts):
   - Add projects table with: name, description, status, organizationId
   - Add indexes: by_organization, by_status
   - Include createdAt, updatedAt, createdBy

2. Backend (packages/convex/convex/projects.ts):
   - list: query all projects for organization
   - get: query single project with permission check
   - create: mutation (admin/owner only)
   - update: mutation (admin/owner only)
   - remove: mutation (owner only)

3. Frontend (apps/web/src/app/demo/projects/page.tsx):
   - List view with table (use shadcn Table)
   - Create dialog (use shadcn Dialog + Form)
   - Edit inline or dialog
   - Delete with confirmation
   - Empty state
   - Loading states

4. Components (apps/web/src/components/projects/):
   - ProjectList
   - ProjectForm
   - ProjectCard

Follow existing patterns from demo/user or demo/billing pages.
Use authClient.useActiveOrganization() hook for active organization.
Check permissions before mutations.
Use shadcn/ui components only.
```

### 3. Extend Existing Feature

```
Extend BetterCone's [FEATURE] feature:

Current state: [describe what exists]

Add: [specific functionality]

Requirements:
- Keep existing functionality unchanged
- Follow same patterns (same imports, same style)
- Add to existing files if possible
- Check permissions if data mutation
- Scope by organization if needed

Show me what files you'll modify and the changes.
```

### 4. Add Custom Billing Feature

```
Add custom billing logic to BetterCone's Stripe integration:

Requirement: [describe feature, e.g., "usage-based metering for API calls"]

Constraints:
- Don't rebuild existing subscription logic
- Extend packages/convex/convex/subscriptionPlans.ts if needed
- Add new webhook handler in apps/web/src/app/api/stripe/webhooks/route.ts if needed
- Update packages/convex/convex/subscriptions.ts for new data
- Follow existing Stripe patterns

Show implementation plan first.
```

### 5. Create Email Template

```
Create a new email template for BetterCone:

Template: [e.g., "project-invitation-email"]
Purpose: [describe when sent]

Requirements:
1. Create apps/web/src/emails/[template-name].tsx
   - Use React Email components (@react-email/components)
   - Follow pattern from team-invitation-email.tsx
   - Make it responsive and professional

2. Add send function to apps/web/src/lib/email.ts
   - TypeScript function with proper types
   - Use Resend client
   - Handle errors

3. Add preview to apps/web/emails/page.tsx
   - Show in email preview page

Use BetterCone brand colors and styling from existing templates.
```

## 🏗️ Feature-Specific Prompts

### Project Management

```
Add project management to BetterCone with:

Schema:
- projects: name, description, status (draft/active/archived), organizationId
- tasks: title, description, status (todo/in-progress/done), projectId, assignedTo
- comments: content, taskId, createdBy

Features:
- Kanban board view (drag & drop)
- Task assignments to team members
- Comments on tasks
- Project filtering/search
- Activity log

Use shadcn/ui components (Card, Badge, Select, Textarea, Dialog).
Add all necessary indexes to schema.
Check permissions (only members can view/edit).
```

### File Uploads

```
Add file upload feature to BetterCone:

Use Convex file storage (DON'T add S3 or Cloudinary).

Schema:
- files: name, type, size, storageId, organizationId, uploadedBy, uploadedAt

Backend (packages/convex/convex/files.ts):
- generateUploadUrl: mutation to get upload URL
- list: query files for organization
- remove: mutation to delete file

Frontend:
- Upload component with drag & drop
- Progress indicator
- File list with download/delete
- File type icons

Follow Convex file storage docs: https://docs.convex.dev/file-storage
```

### API Keys Management

```
Extend BetterCone's API key management:

Current: Basic API key CRUD exists in packages/convex/convex/apiKeys.ts

Add:
- API key scopes/permissions (read/write per resource)
- Last used timestamp
- Usage statistics per key
- Expiration dates
- Regenerate key functionality

Update:
- packages/convex/convex/schema.ts (apiKeys table)
- packages/convex/convex/apiKeys.ts (new functions)
- apps/web/src/app/demo/security/page.tsx (UI updates)

Show current schema first, then suggest changes.
```

### Advanced Search

```
Add search functionality to BetterCone:

Use Convex search indexes (DON'T add Algolia or Elasticsearch).

Add search to:
- Users (by name, email)
- Projects (by name, description)
- Tasks (by title, description)

Implementation:
1. Add search indexes to packages/convex/convex/schema.ts
2. Add search queries to relevant files
3. Create SearchInput component
4. Add search to relevant pages

Follow Convex search docs: https://docs.convex.dev/text-search
```

### Webhooks

```
Add outgoing webhooks to BetterCone:

Features:
- Users can register webhook URLs
- Trigger on events: user.created, project.updated, etc.
- Signature verification
- Retry logic with exponential backoff
- Webhook logs

Schema:
- webhooks: url, events[], secret, organizationId
- webhookLogs: webhookId, event, status, response, timestamp

Use Convex actions for HTTP requests.
Add webhook management UI in settings.
```

## 🎨 UI/UX Prompts

### Responsive Layout

```
Make [COMPONENT] responsive in BetterCone:

Current: [describe current layout]

Requirements:
- Mobile: Stack vertically, hide less important info
- Tablet: 2 column grid
- Desktop: Full layout

Use Tailwind responsive prefixes (sm:, md:, lg:, xl:).
Test with browser dev tools responsive mode.
Follow existing responsive patterns in demo pages.
```

### Dark Mode

```
Ensure [COMPONENT] supports dark mode in BetterCone:

BetterCone uses next-themes with shadcn/ui.

Requirements:
- Use CSS variables from globals.css
- Test in both light and dark mode
- Check contrast ratios
- Update any hardcoded colors

CSS variables available:
- --background, --foreground
- --card, --card-foreground
- --primary, --primary-foreground
- etc. (see apps/web/src/app/globals.css)
```

### Empty States

```
Add empty state to [FEATURE] in BetterCone:

When: [describe when to show, e.g., "no projects yet"]

Show:
- Friendly icon (use lucide-react icons)
- Helpful message
- Call-to-action button
- Optional illustration

Use shadcn Card component.
Follow empty state patterns from existing demo pages.
Make it encouraging, not negative.
```

### Loading States

```
Improve loading states in [COMPONENT]:

Current: [describe current behavior]

Add:
- Skeleton loaders for content (use shadcn Skeleton)
- Loading spinners for actions (use lucide-react Loader2)
- Optimistic updates for mutations
- Error boundaries for failures

Follow loading patterns from demo/organization page.
```

## 🔧 Technical Prompts

### Performance Optimization

```
Optimize [FEATURE] in BetterCone:

Profile:
- Check Convex query efficiency (indexes used?)
- Check React re-renders (unnecessary useEffect?)
- Check bundle size (heavy dependencies?)

Suggest:
- Add/update indexes if needed
- Memoize expensive computations
- Lazy load heavy components
- Paginate large lists

Show before/after comparison.
```

### Testing

```
Add tests for [FEATURE] in BetterCone:

Create:
- Unit tests for utility functions (Vitest)
- Integration tests for Convex functions
- E2E tests for critical flows (Playwright)

Test coverage:
- Happy paths
- Error cases
- Edge cases
- Permission checks

Follow testing patterns if any exist in codebase.
```

### Error Handling

```
Improve error handling in [FEATURE]:

Add:
- Try-catch blocks in mutations
- User-friendly error messages
- Error boundaries in React
- Logging for debugging
- Retry logic for transient failures

Use shadcn Toast for error notifications.
Don't expose internal errors to users.
```

### TypeScript Improvements

```
Improve TypeScript types in [FEATURE]:

Current issues: [describe any type errors or 'any' usage]

Make:
- All functions fully typed
- No 'any' types (use unknown if needed)
- Proper error types
- Infer types from Convex schema

Use Convex Doc<> type for database records.
Use zod for runtime validation.
```

## 🚀 Migration Prompts

### From Another Auth System

```
I have existing auth code using [NextAuth/Auth.js/etc].

Help me migrate to BetterCone's Better Auth:

Current code: [paste relevant code]

Convert to use:
- useSession() from @/lib/auth-client
- Better Auth patterns from existing code

Don't rebuild auth, just update usage.
```

### From SQL Database

```
I have SQL database schema: [paste schema]

Convert to Convex schema for BetterCone:

Requirements:
- Map SQL tables to Convex tables
- Map foreign keys to v.id() references
- Add organizationId for multi-tenancy
- Add proper indexes

Show migration plan and Convex schema.
```

## 📝 Documentation Prompts

### Generate API Docs

```
Generate API documentation for [FEATURE]:

For each function in packages/convex/convex/[feature].ts:
- Function signature
- Parameters with types
- Return type
- Permission requirements
- Example usage

Format as Markdown.
Add to docs/ folder.
```

### Update README

```
I added [FEATURE] to BetterCone.

Update the main README.md:
- Add to features list
- Add screenshot/demo
- Update tech stack if new dependency
- Keep existing format

Show me the diff.
```

## 💡 Pro Tips for Better Prompts

### 1. **Always Provide Context**

❌ Bad: "Add user search"
✅ Good: "Add user search to BetterCone using Convex search indexes, in the demo/user page, following existing patterns"

### 2. **Specify Files**

❌ Bad: "Update the schema"
✅ Good: "Update packages/convex/convex/schema.ts to add projects table"

### 3. **Reference Existing Code**

❌ Bad: "Create a form"
✅ Good: "Create a form following the pattern in apps/web/src/app/demo/billing/page.tsx, using react-hook-form and zod"

### 4. **Break Down Complex Tasks**

❌ Bad: "Add complete CRM system"
✅ Good: Break into smaller prompts:
  1. "Add contacts schema and CRUD"
  2. "Add deals schema and CRUD"
  3. "Add UI for contacts"
  4. "Add UI for deals"
  5. "Connect deals to contacts"

### 5. **Specify Constraints**

Always mention:
- Don't rebuild existing features
- Follow existing patterns
- Use shadcn/ui components
- Check permissions
- Scope by organization

### 6. **Ask for Plan First**

"Show me the implementation plan first" before generating code for complex features.

## 🎓 Learning from Outputs

When AI generates code:

1. **Review before applying** - Does it follow BetterCone patterns?
2. **Check imports** - Uses existing utils/hooks?
3. **Verify permissions** - Checks user roles?
4. **Test immediately** - Run and verify it works
5. **Refine prompt** - If wrong, explain what's wrong and ask again

## 📚 Additional Resources

- Full guide: `docs/AI_DEVELOPMENT_GUIDE.md`
- Project structure: `docs/PROJECT_STRUCTURE.md`
- Quick reference: `QUICK_REFERENCE.md`
- AI context: `llms.txt`

---

**Remember:** The better your prompt, the better the output. Be specific, provide context, and reference existing code!
