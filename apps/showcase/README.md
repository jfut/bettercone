# @bettercone/ui ShowcaseThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A minimal, beautiful showcase of all [@bettercone/ui](https://www.npmjs.com/package/@bettercone/ui) components with Better Auth integration.## Getting Started



## FeaturesFirst, run the development server:



- 🎨 **103 Production-Ready Components** - Complete Better Auth UI components```bash

- 🔐 **Full Authentication** - Email/password, OAuth providers, 2FA, passkeysnpm run dev

- 📱 **Responsive Design** - Beautiful on all devices# or

- 🚀 **Vercel Ready** - Optimized for deploymentyarn dev

# or

## Getting Startedpnpm dev

# or

### 1. Install Dependenciesbun dev

```

```bash

pnpm installOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### 2. Set Up Database (Vercel Postgres)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Create a Vercel Postgres database:

- Go to [Vercel Dashboard](https://vercel.com/dashboard)## Learn More

- Create a new Postgres database

- Copy the connection stringTo learn more about Next.js, take a look at the following resources:



### 3. Configure Environment Variables- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Copy `.env.example` to `.env.local`:

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

```bash

cp .env.example .env.local## Deploy on Vercel

```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Fill in the values:

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your-vercel-postgres-connection-string
GITHUB_CLIENT_ID=your-github-client-id (optional)
GITHUB_CLIENT_SECRET=your-github-secret (optional)
```

### 4. Initialize Database

```bash
npx better-auth migrate
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bettercone-ui)

### Manual Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add a Vercel Postgres database
4. Set environment variables
5. Deploy!

### Environment Variables for Production

Set these in Vercel dashboard:

- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Your production URL (e.g., `https://yourapp.vercel.app`)
- `NEXT_PUBLIC_APP_URL` - Same as BETTER_AUTH_URL
- `DATABASE_URL` - Auto-set when using Vercel Postgres
- `GITHUB_CLIENT_ID` - Optional for OAuth
- `GITHUB_CLIENT_SECRET` - Optional for OAuth

## Components

Browse all 103 components at `/example`:

- **Authentication** (10 components)
- **User & Account** (6 components)
- **Password & Security** (5 components)
- **Passkeys & Auth Methods** (6 components)
- **Phone Authentication** (3 components)
- **Sessions** (2 components)
- **Organizations** (9 components)
- **Members & Invitations** (5 components)
- **API Keys** (3 components)
- **Billing & Pricing** (5 components)
- **Team & Usage** (7 components)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Auth**: Better Auth
- **Database**: Vercel Postgres (Neon)
- **UI**: @bettercone/ui + shadcn/ui
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Learn More

- [@bettercone/ui on NPM](https://www.npmjs.com/package/@bettercone/ui)
- [Better Auth Documentation](https://better-auth.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT
