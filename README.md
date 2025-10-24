# BetterCone

A production-ready B2B SaaS starter template built with Better Auth, Convex, and Next.js.

## What's Included

- 🔐 **Authentication**: Better Auth with email/password, OAuth (Google, GitHub), passkeys
- 💳 **Billing**: Stripe subscriptions, webhooks, customer portal
- 👥 **Multi-tenancy**: Organizations with role-based access control
- 📊 **Database**: Convex for real-time, type-safe data
- 🎨 **UI Components**: Shadcn/UI with Radix primitives
- 📧 **Emails**: Transactional emails via Resend
- 🌐 **Internationalization**: Multi-language support ready
- 🔒 **Security**: Rate limiting, CSRF protection, secure sessions

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/vncsleal/bettercone.git
cd bettercone
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Configure the required variables:

- **Convex**: Run `pnpm convex dev` and copy the deployment URL
- **Better Auth**: Set `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`)
- **OAuth**: Add Google/GitHub client IDs and secrets
- **Stripe**: Add your Stripe secret key and webhook secret
- **Resend**: Add your Resend API key for emails

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 4. Deploy Convex

```bash
cd packages/db
pnpm convex deploy
```

## Project Structure

```
bettercone/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── auth/             # Better Auth configuration
│   ├── db/               # Convex database and functions
│   ├── emails/           # Email templates with React Email
│   ├── i18n/             # Internationalization
│   ├── stripe/           # Stripe integration
│   └── ui/               # Shared UI components
└── scripts/              # Utility scripts
```

## Configuration

### Stripe Products

1. Create products in Stripe Dashboard
2. Update `packages/stripe/src/config.ts` with your product IDs
3. Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`

### OAuth Providers

Configure callback URLs in your OAuth apps:
- **Google**: `https://yourdomain.com/api/auth/callback/google`
- **GitHub**: `https://yourdomain.com/api/auth/callback/github`

### Customization

- **Branding**: Edit `apps/web/src/config/site.ts`
- **Theming**: Modify `apps/web/src/app/globals.css`
- **Components**: Extend components in `packages/ui/`
- **Database**: Add Convex schemas in `packages/db/convex/schema.ts`

## Documentation

Full documentation available at: [docs.bettercone.dev](https://docs.bettercone.dev)

- [Authentication Guide](https://docs.bettercone.dev/docs/guides/authentication)
- [Billing & Stripe](https://docs.bettercone.dev/docs/guides/stripe)
- [Teams & Organizations](https://docs.bettercone.dev/docs/guides/teams)
- [Deployment](https://docs.bettercone.dev/docs/guides/deployment)
- [Customization](https://docs.bettercone.dev/docs/guides/customization)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Database**: [Convex](https://convex.dev/)
- **Auth**: [Better Auth](https://better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **UI**: [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Monorepo**: [Turborepo](https://turbo.build/)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📚 [Documentation](https://docs.bettercone.dev)
- 🐛 [Report Issues](https://github.com/vncsleal/bettercone/issues)
- 💬 [Discussions](https://github.com/vncsleal/bettercone/discussions)

---

Built with 🍦 by [iamvini.co](https://iamvini.co)
