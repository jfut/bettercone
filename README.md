# 🍦 BetterCone

**The AI-ready foundation for B2B SaaS**

Stop asking AI to rebuild auth, billing, and teams from scratch. Start with a solid foundation and let AI build your unique features.

---

## 🤖 Built for the AI Era

In 2025, you can use v0, Cursor, Lovable, or Bolt to build interfaces. But complex systems like **auth**, **billing**, and **multi-tenancy**? AI still struggles.

**BetterCone gives you:**
- ✅ The complex stuff (auth, billing, teams) **already done right**
- ✅ TypeScript everywhere = **AI understands it perfectly**
- ✅ Convex backend = **No SQL, just TypeScript** (AI loves this)
- ✅ Well-documented patterns = **AI can extend, not rebuild**
- ✅ Proven architecture = **Focus AI on your unique features**

**Think of it as:** Your AI copilot's perfect starting point.

---

## 💡 Why BetterCone?

### ❌ Without BetterCone (Starting from scratch)
```
You: "Build me a SaaS with auth and billing"
AI: *Generates inconsistent auth code*
AI: *Hardcodes Stripe logic*
AI: *No team management*
AI: *Security vulnerabilities*
Result: 100+ hours fixing AI code + rebuilding foundation
```

### ✅ With BetterCone (Start solid, build unique)
```
You: "I have BetterCone. Add a project management dashboard"
AI: *Extends existing patterns*
AI: *Uses Convex schema*
AI: *Respects auth & teams*
AI: *Builds on proven foundation*
Result: Ship in days, not months
```

---

## 🎯 What You Get

**The Foundation (Done Right)**
- ✅ **Complete Authentication** - Email/password, OAuth (GitHub, Google), 2FA, passkeys
- ✅ **Stripe Billing** - Subscriptions, usage tracking, customer portal, webhooks  
- ✅ **Team Management** - Multi-tenant orgs with role-based access control
- ✅ **Email Service** - 5 transactional email templates (Resend + React Email)
- ✅ **API Infrastructure** - API keys, rate limiting, usage tracking
- ✅ **Modern UI** - 50+ shadcn/ui components, dark mode, responsive
- ✅ **Type-Safe** - TypeScript everywhere, Convex magic
- ✅ **Production Ready** - Error handling, security, best practices

**Your AI Builds:**
- 🎨 Your unique features
- � Your custom dashboards  
- 🔧 Your specific workflows
- 💼 Your business logic

---

## 🛠 The Perfect Stack for AI Development

| Technology | Why AI Loves It |
|-----------|----------------|
| **TypeScript** | AI understands types perfectly - no guessing |
| **Convex** | No SQL! Just TypeScript functions. AI excels here. |
| **Next.js 15** | Well-documented, AI has tons of training data |
| **Better Auth** | Clear patterns, AI can extend auth flows easily |
| **shadcn/ui** | Copy-paste components, AI knows the patterns |
| **Tailwind CSS** | Utility classes, AI generates perfect styling |

**Result:** AI generates code that actually works with your foundation.

---

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up Convex:**
   ```bash
   cd packages/convex
   pnpm convex dev
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Set up GitHub OAuth (optional but recommended):**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A Convex account (free at [convex.dev](https://convex.dev))
- A Stripe account (for billing features)
- A Resend account (for email features)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/yourusername/bettercone.git
   cd bettercone
   pnpm install
   ```

2. **Set up Convex backend:**
   ```bash
   cd packages/convex
   pnpm convex dev
   ```
   This will open your browser to create/select a Convex project.

3. **Configure environment variables:**
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```
   
   Fill in your `.env.local` with:
   - Convex deployment URL (from step 2)
   - Stripe API keys
   - Better Auth secret (generate with `openssl rand -base64 32`)
   - Resend API key (optional, for emails)
   - GitHub OAuth credentials (optional)

4. **Start the development server:**
   ```bash
   cd ../..  # Back to root
   pnpm dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Convex Dashboard: https://dashboard.convex.dev

## What's Included

### 🔐 Authentication System
- Email/password authentication with verification
- Social OAuth (GitHub, Google ready to add more)
- Two-factor authentication (TOTP)
- Passkey support (WebAuthn)
- Session management with device tracking
- Password reset flow with email

### 💳 Stripe Integration
- Three-tier pricing (Free, Pro, Team)
- Subscription management
- Usage-based billing ready
- Customer portal
- Webhook handling
- Invoice management

### 👥 Team Management
- Multi-tenant organizations
- Role-based access control (Owner, Admin, Member)
- Team invitations via email
- Member management
- Organization settings

### 📧 Email Service
- Welcome emails
- Password reset emails
- Team invitation emails
- Subscription change notifications
- Payment failure alerts
- Beautiful React Email templates

### 🚀 API Infrastructure
- API key generation and management
- Rate limiting per plan
- Usage tracking
- Secure key hashing
- Plan-based quotas

### 🎨 UI Components
- Full shadcn/ui component library
- Responsive design
- Dark mode support
- Accessible components
- Tailwind CSS styling

---

## 🤖 AI-Powered Development

**BetterCone is the first B2B SaaS starter optimized for AI coding tools.**

### 📋 What Makes It AI-Ready?

1. **llms.txt** - Instant context for Claude, ChatGPT, Cursor
   - Complete project overview in one file
   - Architecture patterns and code examples
   - What's built vs what to extend
   - Common mistakes to avoid

2. **.cursorrules** - Cursor AI follows BetterCone patterns automatically
   - DON'T suggest NextAuth (we use Better Auth)
   - DON'T suggest Prisma (we use Convex)
   - DO use organization-scoped queries
   - DO check permissions before mutations

3. **300+ Prompts Library** (`docs/AI_PROMPTS.md`)
   - Copy-paste prompts that actually work
   - CRUD features in 10 minutes
   - Complex features with step-by-step guidance
   - UI, testing, and optimization prompts

4. **Feature Templates** (`.ai/feature-templates.md`)
   - Ready-to-use code scaffolds
   - Copy, replace `FEATURE_NAME`, ship
   - Backend + Frontend + Schema patterns
   - Includes permissions and multi-tenancy

5. **AI Context Helpers** (`.ai/context.md`)
   - Quick reference for AI assistants
   - File locations and patterns
   - Permission levels and conventions
   - Development workflow

### 🚀 Development Speed

| Task | Without BetterCone | With BetterCone |
|------|-------------------|----------------|
| New CRUD feature | 2-4 hours | **10-15 minutes** |
| Complex feature | 1-2 days | **2-4 hours** |
| Bug fixing | 30-60 minutes | **5-10 minutes** |
| Documentation | Often skipped | **Auto-generated** |

**Result: 5-10x faster development with AI tools! 🚀**

### 🛠 Works With Your Favorite AI Tool

- **Cursor**: Reads `.cursorrules` automatically
- **Claude/ChatGPT**: Start with `llms.txt` context
- **v0.dev**: Use prompts library with shadcn/ui
- **Lovable/Bolt**: Reference templates and patterns
- **GitHub Copilot**: Uses `.github/copilot-instructions.md`

### 📝 Example: Add Feature in 10 Minutes

```typescript
// 1. Tell AI what you want
"Add a 'projects' feature to BetterCone with:
- Name, description, status fields
- CRUD operations with permission checks
- Organization-scoped
- Use shadcn/ui components"

// 2. AI reads llms.txt and .cursorrules
// 3. AI generates following BetterCone patterns:
//    ✅ Schema with organizationId
//    ✅ Backend with permission checks
//    ✅ Frontend with useOrganization() hook
//    ✅ shadcn/ui components

// 4. You review and ship!
```

### 📚 AI Resources

**Configuration Files** (in project root):
- `llms.txt` - AI discovery file (200+ lines)
- `.cursorrules` - Cursor configuration (300+ lines)
- `.github/copilot-instructions.md` - Copilot config (200+ lines)

**Documentation** (in `.ai/` folder):
- `AI_QUICK_START.md` - 60-second setup guide
- `AI_DEVELOPMENT_GUIDE.md` - Complete guide (15+ pages)
- `AI_PROMPTS.md` - 300+ prompts library (700+ lines)
- `feature-templates.md` - Code templates (400+ lines)
- `context.md` - Quick reference (300+ lines)

**Total: 2,900+ lines of AI-specific documentation!**

👉 **Start here:** [.ai/AI_QUICK_START.md](./.ai/AI_QUICK_START.md)

---

## Project Structure

```
bettercone/
├── apps/
│   └── web/                     # Next.js application
│       ├── src/
│       │   ├── app/            # App router pages
│       │   │   ├── api/auth/   # Better Auth API routes
│       │   │   ├── auth/       # Auth pages (sign-in, sign-up)
│       │   │   └── demo/       # Feature demos
│       │   ├── components/     # React components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── pricing/    # Pricing cards
│       │   │   └── billing/    # Billing components
│       │   ├── emails/         # React Email templates
│       │   ├── lib/            # Utilities
│       │   │   ├── auth-client.ts
│       │   │   └── email.ts    # Email service
│       │   └── hooks/          # Custom React hooks
│       └── public/             # Static assets
├── packages/
│   ├── convex/                 # Convex backend
│   │   └── convex/
│   │       ├── auth.ts         # Better Auth integration
│   │       ├── schema.ts       # Database schema
│   │       ├── subscriptionPlans.ts  # Billing config
│   │       └── betterAuth/     # Auth adapter
│   ├── eslint-config/          # Shared ESLint config
│   ├── tailwind-config/        # Shared Tailwind config
│   └── typescript-config/      # Shared TS config
└── docs/                       # Documentation
    ├── DEPLOYMENT.md
    ├── EMAIL_SERVICE.md
    ├── ENVIRONMENT_VARIABLES.md
    └── PROJECT_STRUCTURE.md
```

## Configuration

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Create three products/prices for Free, Pro, and Team plans
4. Update `packages/convex/convex/subscriptionPlans.ts` with your price IDs
5. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

See `docs/DEPLOYMENT.md` for detailed Stripe configuration.

### Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Add to `.env.local`: `RESEND_API_KEY=re_xxxxx`

See `docs/EMAIL_SERVICE.md` for email template customization.

### OAuth Providers

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env.local`

#### Add More Providers
BetterCone supports 20+ OAuth providers. See Better Auth docs to add Google, Microsoft, etc.

## Documentation

- 📖 [Project Structure](docs/PROJECT_STRUCTURE.md) - Architecture overview
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to Vercel, Netlify, etc.
- 📧 [Email Service](docs/EMAIL_SERVICE.md) - Email templates and integration
- 🔑 [Environment Variables](docs/ENVIRONMENT_VARIABLES.md) - Complete env var reference
- 📊 [Path to 100%](PATH_TO_100.md) - Roadmap and feature completeness

## Demo Features

Visit `/demo` to explore:

- **/demo/account** - User profile management, avatar upload
- **/demo/security** - 2FA, passkeys, session management  
- **/demo/organization** - Create/manage teams, invite members
- **/demo/billing** - Subscription plans, payment methods
- **/demo/user** - Account settings, preferences
- **/demo/hooks** - Better Auth React hooks examples
- **/demo/combined** - Complete auth flow showcase

## Customization

### Branding
- Update `apps/web/src/app/layout.tsx` for site metadata
- Replace logos in `apps/web/public/`
- Customize theme in `tailwind.config.ts`

### Pricing Plans
Edit `packages/convex/convex/subscriptionPlans.ts`:
```typescript
export const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    limits: { apiCalls: 10000 }
  },
  // Add more plans...
];
```

### Email Templates
All templates in `apps/web/src/emails/`:
- `welcome-email.tsx`
- `password-reset-email.tsx`
- `team-invitation-email.tsx`
- `subscription-change-email.tsx`
- `payment-failed-email.tsx`

Preview with: `pnpm email`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Convex auto-deploys when you push to production.

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## Tech Stack Details

- **Next.js 15** - React framework with App Router, Server Components
- **Better Auth** - Authentication library with 20+ providers
- **Convex** - Real-time backend with TypeScript SDK
- **Stripe** - Payment processing and subscriptions
- **Resend** - Email delivery with React Email
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **TypeScript** - Type-safe development
- **Turborepo** - Monorepo build system

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📧 Email: support@bettercone.dev
- 💬 Discord: [Join our community](#)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/bettercone/issues)
- 📚 Docs: [Full Documentation](#)

## Credits

Built with:
- [Better Auth](https://www.better-auth.com/) by [@iamkhalil42](https://twitter.com/iamkhalil42)
- [Better Auth UI](https://github.com/daveyplate/better-auth-ui) by [@daveyplate](https://github.com/daveyplate)
- [Convex](https://convex.dev)
- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)

---

**Made with 🍦 by BetterCone**

*The sweetest way to ship B2B SaaS*

- `/` - Home page with demo navigation and Better Auth UI showcase
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/auth/forgot-password` - Password reset page
- `/auth/sign-out` - Sign out page
- `/demo/account` - Account management demo
- `/demo/advanced` - Advanced authentication features demo
- `/demo/combined` - Combined auth flows demo
- `/demo/hooks` - Authentication hooks demo
- `/demo/organization` - Organization management demo
- `/demo/redirect-signup` - Redirect signup flow demo
- `/demo/security` - Security features demo
- `/demo/user` - User profile management demo

## Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (serverless backend)
- **Authentication**: Better Auth with Better Auth UI
- **UI Components**: shadcn/ui + Better Auth UI
- **Development**: Turborepo, pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start Convex backend
cd packages/convex && pnpm convex dev

# Build for production
pnpm build
```

## Deployment

1. **Deploy Convex:**
   ```bash
   cd packages/convex
   pnpm convex deploy
   ```

2. **Deploy Next.js app:**
   ```bash
   cd apps/web
   pnpm build
   pnpm start
   ```

## Contributing

This is a demo application showcasing Better Auth UI. Feel free to explore the code, use it as a reference for implementing Better Auth UI in your projects, or contribute improvements!

## Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth UI Documentation](https://better-auth-ui.com)
- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)
