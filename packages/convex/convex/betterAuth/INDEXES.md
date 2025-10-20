# Better Auth Schema Indexes

## Important Note

The Better Auth CLI generates the base schema but **does not automatically create composite indexes**. According to the [Better Auth performance optimization documentation](https://www.better-auth.com/docs/guides/optimizing-for-performance#recommended-fields-to-index), certain composite indexes are required for optimal performance.

The Better Auth team intends to add indexing support to their schema generation tool in the future.

## Required Manual Indexes

After running `npx @better-auth/cli generate`, you must manually add these composite indexes to `schema.ts`:

### Member Table
Add composite index for `[organizationId, userId]`:
```typescript
.index("organizationId_userId", ["organizationId", "userId"])
```

### Subscription Table  
Add indexes for query performance:
```typescript
.index("referenceId", ["referenceId"])
.index("status", ["status"])
.index("stripeCustomerId", ["stripeCustomerId"])
.index("stripeSubscriptionId", ["stripeSubscriptionId"])
```

## Why Manual Editing is Acceptable Here

While the schema.ts file is auto-generated and normally shouldn't be edited manually, **adding performance indexes after CLI generation is a documented limitation** and acceptable practice until Better Auth implements automatic index generation.

## Regeneration Process

When you regenerate the schema with:
```bash
npx @better-auth/cli generate --config packages/convex/convex/betterAuth/auth.ts --output packages/convex/convex/betterAuth/schema.ts -y
```

You will need to **re-add these indexes** after each regeneration.

## Recommended Fields to Index (from Better Auth docs)

| Table         | Fields                     |
| ------------- | -------------------------- |
| users         | `email`                    |
| accounts      | `userId`                   |
| sessions      | `userId`, `token`          |
| verifications | `identifier`               |
| invitations   | `email`, `organizationId`  |
| members       | `userId`, `organizationId` |
| organizations | `slug`                     |
| subscription  | `referenceId`, `status`    |
