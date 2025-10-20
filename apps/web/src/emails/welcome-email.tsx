/**
 * Welcome Email Template
 * Sent when a new user signs up
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

interface WelcomeEmailProps {
  name?: string;
  email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => {
  const displayName = name || email.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform! Get started with your new account.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Our Platform! 🎉</Heading>
          
          <Text style={text}>
            Hi {displayName},
          </Text>
          
          <Text style={text}>
            Thanks for signing up! We're excited to have you on board. Your account has been created successfully.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo`}>
              Get Started
            </Button>
          </Section>

          <Text style={text}>
            Here's what you can do next:
          </Text>

          <ul style={list}>
            <li style={listItem}>Complete your profile</li>
            <li style={listItem}>Explore our features</li>
            <li style={listItem}>Create your first organization</li>
            <li style={listItem}>Invite team members</li>
          </ul>

          <Hr style={hr} />

          <Text style={footer}>
            Need help? Reply to this email or visit our{" "}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support`} style={link}>
              support center
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const list = {
  padding: "0 48px",
  margin: "16px 0",
};

const listItem = {
  marginBottom: "8px",
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
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
