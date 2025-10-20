/**
 * Password Reset Email Template
 * Sent when a user requests a password reset
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name?: string;
  email: string;
  resetLink: string;
  expiresIn?: string;
}

export const PasswordResetEmail = ({
  name,
  email,
  resetLink,
  expiresIn = "1 hour",
}: PasswordResetEmailProps) => {
  const displayName = name || email.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>Reset your password - Secure link inside</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password 🔒</Heading>
          
          <Text style={text}>
            Hi {displayName},
          </Text>
          
          <Text style={text}>
            We received a request to reset your password. Click the button below to create a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in <strong>{expiresIn}</strong>. If you didn't request this, you can safely ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={smallText}>
            For security reasons, this link can only be used once. If you need to reset your password again, you'll need to request a new link.
          </Text>

          <Text style={smallText}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          
          <Text style={linkText}>
            {resetLink}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn't request this password reset, please{" "}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support`} style={link}>
              contact support
            </Link>{" "}
            immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 48px",
  textAlign: "center" as const,
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const smallText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "22px",
  padding: "0 48px",
};

const buttonContainer = {
  padding: "27px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
};

const linkText = {
  color: "#666",
  fontSize: "12px",
  lineHeight: "20px",
  padding: "0 48px",
  wordBreak: "break-all" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 48px",
};

const link = {
  color: "#000",
  textDecoration: "underline",
};
