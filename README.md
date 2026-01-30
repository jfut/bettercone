# @bettercone/ui

The complete React component library for Better Auth applications.

[![npm version](https://img.shields.io/npm/v/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![npm downloads](https://img.shields.io/npm/dm/@bettercone/ui.svg)](https://www.npmjs.com/package/@bettercone/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Production-ready components for modern authentication workflows. Built for Better Auth with support for React 18 and 19.

## Quick Start

Install and set up in one command:

```bash
npx @bettercone/ui init
```

This command installs @bettercone/ui, Better Auth, shadcn/ui, and configures your project automatically.

## Features

- Framework-agnostic design (Next.js, Vite, Remix, any React framework)
- Backend-agnostic architecture (Convex, Prisma, Supabase, Drizzle)
- Complete authentication workflows with Better Auth
- Billing and subscription management with Stripe
- Team and organization management
- Enterprise SSO and security features
- Mobile-first responsive design
- Full TypeScript support
- Customizable with Tailwind CSS
- Comprehensive documentation and examples

## Installation

### Automated Setup (Recommended)

```bash
npx @bettercone/ui init
```

### Manual Installation

```bash
npm install @bettercone/ui better-auth
# or
pnpm add @bettercone/ui better-auth
# or
yarn add @bettercone/ui better-auth
```

## Usage

Import and use components in your React application:

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

## Documentation

- [Full Documentation](https://docs.bettercone.com)
- [Component Showcase](https://bettercone.com)
- [npm Package](https://www.npmjs.com/package/@bettercone/ui)

## Tech Stack

- **Framework**: Next.js 15 with React 18/19
- **Auth**: Better Auth
- **Payments**: Stripe
- **UI**: Shadcn/UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **Build**: Turborepo monorepo
- **Documentation**: Fumadocs

## Development

```bash
# Clone repository
git clone https://github.com/vncsleal/bettercone.git
cd bettercone

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

## Contributing

Contributions are welcome. Please read our contributing guidelines and code of conduct.

## Acknowledgments

This project reuses and adapts components from [better-auth-ui](https://github.com/better-auth-ui/better-auth-ui). Special thanks to the author for the inspiration and foundation.