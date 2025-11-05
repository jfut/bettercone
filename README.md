# @bettercone/ui

The complete React component library for Better Auth applications.

[![npm version](https://img.shields.io/npm/v/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![npm downloads](https://img.shields.io/npm/dm/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)

**Production-ready components for modern authentication workflows:**

```bash
npm install @bettercone/ui better-auth
```

**Features:**
- ⚛️ Framework-agnostic (Next.js, Vite, Remix, any React framework)  
- 🔌 Backend-agnostic (Convex, Prisma, Supabase, Drizzle)
- 🎨 Production-ready components for auth, billing, and teams
- 🔒 Fully typed with TypeScript
- 🎨 Customizable with Tailwind CSS and CSS variables
- 📱 Mobile-first responsive design

**Links:**
- 🌐 [Component Showcase](https://bettercone.com)
- 📚 [Full Documentation](https://docs.bettercone.com)
- 📦 [npm Package](https://www.npmjs.com/package/@bettercone/ui)

## Quick Start

1. **Install the package:**
   ```bash
   npm install @bettercone/ui better-auth
   ```

2. **Set up Better Auth** (if you haven't already):
   ```bash
   npm install better-auth
   ```

3. **Import and use components:**
   ```tsx
   import { SignInForm } from "@bettercone/ui"
   
   export default function AuthPage() {
     return (
       <div className="max-w-md mx-auto">
         <SignInForm />
       </div>
     )
   }
   ```

## Component Library

All components are designed to work seamlessly with Better Auth:

**Authentication Components:**
- `<SignInForm />` - Complete sign-in form with email/password and OAuth
- `<SignUpForm />` - Registration form with validation
- `<TwoFactorCard />` - Two-factor authentication setup
- `<PasskeyManager />` - Modern passkey authentication
- `<ForgotPasswordForm />` - Password reset workflow
- `<UserButton />` - Dropdown menu with user actions
- `<SiweSignInButton />` - Sign in with Ethereum (SIWE)
- `<WalletConnectionCard />` - Web3 wallet management

**Billing & Subscription Components:**
- `<PricingCard />` - Professional pricing display with auto-checkout
- `<SubscriptionCard />` - Subscription management interface
- `<PaymentMethodCard />` - Payment method management
- `<InvoiceHistoryCard />` - Customer invoice history
- `<BillingDashboard />` - Complete billing dashboard

**Team Management Components:**
- `<TeamDashboard />` - Complete team management dashboard
- `<TeamBillingCard />` - Organization subscription management
- `<SeatAllocationCard />` - Team seat limits and usage
- `<OrganizationSwitcher />` - Switch between organizations
- `<MemberList />` - Team member management

## Repository Structure

This monorepo contains:

```
bettercone/
├── apps/
│   └── showcase/         # Component showcase (bettercone.com)
├── packages/
│   └── ui/               # @bettercone/ui source code
└── docs/                 # Documentation source
```

## Development

To contribute or customize the library:

```bash
# Clone the repository
git clone https://github.com/vncsleal/bettercone.git
cd bettercone

# Install dependencies
pnpm install

# Start development
pnpm dev
```

This will start:
- Component showcase at `http://localhost:3000`
- Documentation at `http://localhost:3001`

## Framework Integration

### Next.js

```tsx
// app/auth/page.tsx
import { SignInForm } from "@bettercone/ui"

export default function AuthPage() {
  return <SignInForm />
}
```

### Vite/React

```tsx
// src/components/Auth.tsx
import { SignUpForm } from "@bettercone/ui"

export function Auth() {
  return <SignUpForm />
}
```

### Remix

```tsx
// app/routes/auth.tsx
import { SignInForm } from "@bettercone/ui"

export default function AuthRoute() {
  return <SignInForm />
}
```

## Customization

All components support full customization via CSS variables and Tailwind CSS:

```css
/* globals.css */
:root {
  --primary: 210 40% 50%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

## Documentation

Complete documentation and examples:

- 📚 [Full Documentation](https://docs.bettercone.com)
- 🌐 [Component Showcase](https://bettercone.com)
- 📦 [npm Package](https://www.npmjs.com/package/@bettercone/ui)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Auth**: [Better Auth](https://better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI**: [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Documentation**: [Fumadocs](https://fumadocs.dev)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📚 [Documentation](https://docs.bettercone.com)
- 🐛 [Report Issues](https://github.com/vncsleal/bettercone/issues)
- 💬 [Discussions](https://github.com/vncsleal/bettercone/discussions)

---

Built with 🍦 by [iamvini.co](https://iamvini.co)
