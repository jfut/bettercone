# 🍦 BetterCone - Quick Reference Guide

**The AI-ready foundation for B2B SaaS**

---

## 🚀 Getting Started

### First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up Convex backend
cd packages/convex
pnpm convex dev  # Opens browser to create/select project

# 3. Configure environment (in new terminal)
cd apps/web
cp .env.example .env.local
# Edit .env.local with your Convex URL and secrets

# 4. Start development server
pnpm dev
```

### Daily Development

```bash
# Terminal 1: Convex backend
cd packages/convex && pnpm convex dev

# Terminal 2: Next.js frontend
pnpm dev
```

---

## 🤖 AI Development

**BetterCone is optimized for AI coding tools!**

### With Cursor
- Reads `.cursorrules` automatically
- Reference docs: `@context.md`, `@feature-templates.md`

### With Claude/ChatGPT
```
Read llms.txt from BetterCone.
I want to add [YOUR FEATURE].
```

### Quick Resources
- `.ai/AI_QUICK_START.md` - 60-second setup
- `.ai/AI_PROMPTS.md` - 300+ copy-paste prompts
- `.ai/feature-templates.md` - Code scaffolds
- `.ai/context.md` - Pattern reference

**Build features 5-10x faster with AI!** 🚀

---

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter web dev
pnpm --filter @repo/convex dev
```

### 🏗️ Build

```bash
# Build everything
pnpm build

# Build specific package
pnpm --filter web build
```

### ✅ Quality Checks

```bash
# Run all checks
pnpm lint
pnpm type-check

# Format code
pnpm format
```

### 🧹 Cleanup

```bash
# Clean all build artifacts
pnpm clean

# Deep clean (including node_modules)
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

---

## Project Structure

```
bettercone/
├── apps/
│   └── web/               # Next.js 15 app (App Router)
│       ├── src/
│       │   ├── app/      # Pages and API routes
│       │   ├── components/ # React components
│       │   ├── lib/      # Utilities (auth-client, email)
│       │   ├── emails/   # React Email templates
│       │   └── hooks/    # Custom React hooks
│       └── public/       # Static assets
├── packages/
│   ├── convex/           # Convex backend
│   │   └── convex/
│   │       ├── schema.ts          # Database schema
│   │       ├── auth.ts            # Better Auth integration
│   │       ├── subscriptionPlans.ts # Billing config
│   │       ├── organizations.ts   # Team management
│   │       └── betterAuth/        # Auth adapter
│   ├── eslint-config/    # Shared ESLint configs
│   ├── tailwind-config/  # Shared Tailwind configs
│   └── typescript-config/ # Shared TypeScript configs
├── .ai/                  # AI development docs
├── docs/                 # Project documentation
├── scripts/              # Utility scripts
├── llms.txt              # AI discovery file
├── .cursorrules          # Cursor AI config
└── .github/
    └── copilot-instructions.md  # Copilot config
```

---

## Package Naming

All internal packages use `@repo/` prefix:
- `@repo/convex`
- `@repo/eslint-config`
- `@repo/tailwind-config`
- `@repo/typescript-config`

---

## Adding Dependencies

### To a specific package
```bash
cd apps/web
pnpm add package-name

# Or from root
pnpm --filter web add package-name
```

### To root (dev dependencies only)
```bash
pnpm add -D -w package-name
```

### Add workspace dependency
```json
{
  "dependencies": {
    "@repo/convex": "workspace:*"
  }
}
```

---

## Environment Variables

### Required for web app
```bash
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
BETTER_AUTH_SECRET=
```

See `apps/web/.env.example` for full list.

---

## Turborepo Features

### Cache Information
```bash
# View cache status
pnpm turbo run build

# Force rebuild (ignore cache)
pnpm turbo run build --force

# View dependency graph
pnpm turbo run build --graph
```

### Filtering
```bash
# Run task for package and dependencies
pnpm turbo run build --filter=web...

# Run task for package only
pnpm turbo run build --filter=web
```

---

## Troubleshooting

### Build fails
```bash
pnpm clean
pnpm install
pnpm build
```

### Type errors
```bash
pnpm type-check
```

### Lint errors
```bash
pnpm lint
pnpm format
```

### Cache issues
```bash
rm -rf .turbo
pnpm turbo run build --force
```

---

## Documentation

- `README.md` - Project overview
- `CONTRIBUTING.md` - How to contribute
- `docs/PROJECT_STRUCTURE.md` - Detailed structure
- `docs/ENVIRONMENT_VARIABLES.md` - Env vars guide
- `docs/DEPLOYMENT.md` - Deployment instructions

---

## Useful Links

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [pnpm Docs](https://pnpm.io)

---

**Last Updated**: October 18, 2025
