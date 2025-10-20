# Feature Templates for AI Development

Quick-start templates for common features. Copy and modify for your needs.

## 📋 Basic CRUD Feature Template

### File: `packages/convex/convex/FEATURE_NAME.ts`

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./betterAuth/getUserId";

// List all items for organization
export const list = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // Verify membership
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", args.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member of this organization");
    
    return await ctx.db
      .query("FEATURE_NAME")
      .withIndex("by_organization", (q) => 
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});

// Get single item
export const get = query({
  args: { id: v.id("FEATURE_NAME") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    
    // Verify membership
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", item.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not authorized");
    
    return item;
  },
});

// Create new item (admin/owner only)
export const create = mutation({
  args: { 
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // Check permissions (admin or owner)
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", args.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member");
    if (member.role !== "owner" && member.role !== "admin") {
      throw new Error("Only admins and owners can create items");
    }
    
    return await ctx.db.insert("FEATURE_NAME", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
      createdBy: userId,
      updatedAt: Date.now(),
    });
  },
});

// Update item (admin/owner only)
export const update = mutation({
  args: { 
    id: v.id("FEATURE_NAME"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    
    // Check permissions
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", item.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member");
    if (member.role !== "owner" && member.role !== "admin") {
      throw new Error("Only admins and owners can update items");
    }
    
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      updatedAt: Date.now(),
    });
  },
});

// Delete item (owner only)
export const remove = mutation({
  args: { id: v.id("FEATURE_NAME") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    
    // Check permissions (owner only)
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", item.organizationId)
         .eq("userId", userId)
      )
      .first();
    
    if (!member) throw new Error("Not a member");
    if (member.role !== "owner") {
      throw new Error("Only owners can delete items");
    }
    
    await ctx.db.delete(args.id);
  },
});
```

### File: `apps/web/src/app/demo/FEATURE_NAME/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/convex";
import { useOrganization } from "@/hooks/use-organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function FeatureNamePage() {
  const { currentOrganization } = useOrganization();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Queries
  const items = useQuery(
    api.FEATURE_NAME.list,
    currentOrganization?.id 
      ? { organizationId: currentOrganization.id }
      : "skip"
  );
  
  // Mutations
  const createItem = useMutation(api.FEATURE_NAME.create);
  const removeItem = useMutation(api.FEATURE_NAME.remove);
  
  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;
    
    try {
      await createItem({
        organizationId: currentOrganization.id,
        name,
        description,
      });
      
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      
      setName("");
      setDescription("");
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create item",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await removeItem({ id: id as any });
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item",
        variant: "destructive",
      });
    }
  };
  
  // Loading state
  if (!currentOrganization) {
    return <div>Please select an organization</div>;
  }
  
  if (items === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Name</h1>
          <p className="text-muted-foreground">Manage your items</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No items yet</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              {item.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Schema Addition (add to `packages/convex/convex/schema.ts`)

```typescript
FEATURE_NAME: defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  description: v.optional(v.string()),
  createdAt: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
.index("by_organization", ["organizationId"])
.index("by_created_by", ["createdBy"]),
```

## 🎯 Advanced Templates

### With File Upload

See `docs/AI_PROMPTS.md` - File Uploads section

### With Search

See `docs/AI_PROMPTS.md` - Advanced Search section

### With Relations

```typescript
// In schema.ts - parent-child relationship
parents: defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  // ... other fields
})
.index("by_organization", ["organizationId"]),

children: defineTable({
  organizationId: v.id("organizations"),
  parentId: v.id("parents"),
  name: v.string(),
  // ... other fields
})
.index("by_organization", ["organizationId"])
.index("by_parent", ["parentId"]),

// In FEATURE.ts - query children
export const listChildren = query({
  args: { parentId: v.id("parents") },
  handler: async (ctx, args) => {
    // ... auth checks
    return await ctx.db
      .query("children")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});
```

## 📝 Usage Instructions

1. **Copy template files**
2. **Replace `FEATURE_NAME` with your feature name** (e.g., `projects`, `tasks`, `documents`)
3. **Add schema to `schema.ts`**
4. **Customize fields** based on your requirements
5. **Run `pnpm convex dev`** to sync schema
6. **Test CRUD operations**
7. **Add navigation link** in `demo-layout.tsx`

## 🎨 UI Variations

### Table Layout

Replace grid with shadcn Table component:

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.description}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Kanban Board

```typescript
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Group items by status
const columns = {
  todo: items.filter(item => item.status === "todo"),
  inProgress: items.filter(item => item.status === "inProgress"),
  done: items.filter(item => item.status === "done"),
};

// Render columns...
```

## 💡 Pro Tips

1. **Start simple** - Use basic CRUD template, then add complexity
2. **Test permissions** - Verify role checks work correctly
3. **Add indexes** - For every query pattern
4. **Handle errors** - Always wrap mutations in try-catch
5. **Loading states** - Show skeletons while data loads
6. **Empty states** - Make them helpful and actionable

## 📚 More Examples

See existing features in codebase:
- `packages/convex/convex/apiKeys.ts` - API key management
- `apps/web/src/app/demo/organization/page.tsx` - Complex UI
- `apps/web/src/app/demo/billing/page.tsx` - Stripe integration
