# Email Templates

This directory contains React Email templates for transactional emails.

## Available Templates

### 1. Welcome Email (`welcome-email.tsx`)
**Sent when**: User signs up  
**Props**: `name` (optional), `email`

### 2. Password Reset Email (`password-reset-email.tsx`)
**Sent when**: User requests password reset  
**Props**: `name`, `email`, `resetLink`, `expiresIn` (default: "1 hour")

### 3. Team Invitation Email (`team-invitation-email.tsx`)
**Sent when**: User invited to organization  
**Props**: `invitedByName`, `invitedByEmail`, `organizationName`, `inviteLink`, `role`, `expiresIn` (default: "7 days")

### 4. Subscription Change Email (`subscription-change-email.tsx`)
**Sent when**: Subscription upgraded/downgraded/cancelled/renewed  
**Props**: `name`, `email`, `organizationName`, `changeType`, `oldPlan`, `newPlan`, `effectiveDate`, `amount`, `interval`

### 5. Payment Failed Email (`payment-failed-email.tsx`)
**Sent when**: Payment fails  
**Props**: `name`, `email`, `organizationName`, `plan`, `amount`, `interval`, `retryDate`, `daysUntilDowngrade`

## Preview Templates

Run the preview server to see how emails look:

```bash
pnpm email
```

This opens http://localhost:3001 with all email templates.

## Usage

Import and use the email service functions:

```typescript
import { sendWelcomeEmail } from "@/lib/email";

await sendWelcomeEmail("user@example.com", "John Doe");
```

## Documentation

See `/docs/EMAIL_SERVICE.md` for:
- Full integration guide
- Better Auth hooks
- Stripe webhook examples
- Testing instructions
- Production checklist

## Tech Stack

- **Resend**: Email sending API
- **React Email**: Template framework
- **@react-email/components**: Pre-built UI components

## Development

All templates use:
- Inline styles for email client compatibility
- Responsive design
- Accessibility best practices
- Security warnings where appropriate
