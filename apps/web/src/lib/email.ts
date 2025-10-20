/**
 * Email Service
 * Wraps Resend API for sending transactional emails
 */

import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { TeamInvitationEmail } from "@/emails/team-invitation-email";
import { SubscriptionChangeEmail } from "@/emails/subscription-change-email";
import { PaymentFailedEmail } from "@/emails/payment-failed-email";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (configure in your Resend dashboard)
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_NAME = "Your App"; // Update with your app name

// Email sending configuration
const EMAIL_CONFIG = {
  from: DEFAULT_FROM,
  replyTo: process.env.SUPPORT_EMAIL || DEFAULT_FROM,
};

// Type definitions
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  name?: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `Welcome to ${APP_NAME}! 🎉`,
      react: WelcomeEmail({ name, email: to }),
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: error.message };
    }

    console.log("Welcome email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  name?: string,
  expiresIn?: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: "Reset Your Password",
      react: PasswordResetEmail({ name, email: to, resetLink, expiresIn }),
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      return { success: false, error: error.message };
    }

    console.log("Password reset email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(
  to: string,
  invitedByName: string,
  invitedByEmail: string,
  organizationName: string,
  inviteLink: string,
  role: string,
  expiresIn?: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `You're invited to join ${organizationName}`,
      react: TeamInvitationEmail({
        invitedByName,
        invitedByEmail,
        organizationName,
        inviteLink,
        role,
        expiresIn,
      }),
    });

    if (error) {
      console.error("Failed to send team invitation email:", error);
      return { success: false, error: error.message };
    }

    console.log("Team invitation email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending team invitation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send subscription change notification
 */
export async function sendSubscriptionChangeEmail(
  to: string,
  params: {
    name: string;
    organizationName?: string;
    changeType: "upgraded" | "downgraded" | "cancelled" | "renewed";
    oldPlan: string;
    newPlan: string;
    effectiveDate: string;
    amount?: string;
    interval?: "monthly" | "yearly";
  }
): Promise<EmailResponse> {
  try {
    const subjectMap = {
      upgraded: "Subscription Upgraded! 🎉",
      downgraded: "Subscription Updated",
      cancelled: "Subscription Cancelled",
      renewed: "Subscription Renewed",
    };

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: subjectMap[params.changeType],
      react: SubscriptionChangeEmail({
        email: to,
        ...params,
      }),
    });

    if (error) {
      console.error("Failed to send subscription change email:", error);
      return { success: false, error: error.message };
    }

    console.log("Subscription change email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending subscription change email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(
  to: string,
  params: {
    name: string;
    organizationName?: string;
    plan: string;
    amount: string;
    interval: "monthly" | "yearly";
    retryDate?: string;
    daysUntilDowngrade?: number;
  }
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: "⚠️ Payment Failed - Action Required",
      react: PaymentFailedEmail({
        email: to,
        ...params,
      }),
    });

    if (error) {
      console.error("Failed to send payment failed email:", error);
      return { success: false, error: error.message };
    }

    console.log("Payment failed email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending payment failed email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generic email sending function for custom use cases
 */
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  from?: string;
  replyTo?: string;
}): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: params.from || EMAIL_CONFIG.from,
      replyTo: params.replyTo || EMAIL_CONFIG.replyTo,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      react: params.react,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
