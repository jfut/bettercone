/**
 * Team Invitation Email Template
 * Sent when a user is invited to join an organization
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

interface TeamInvitationEmailProps {
  invitedByName: string;
  invitedByEmail: string;
  organizationName: string;
  inviteLink: string;
  role: string;
  expiresIn?: string;
}

export const TeamInvitationEmail = ({
  invitedByName,
  invitedByEmail,
  organizationName,
  inviteLink,
  role,
  expiresIn = "7 days",
}: TeamInvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You've been invited to join {organizationName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're Invited! 🎊</Heading>
          
          <Text style={text}>
            <strong>{invitedByName}</strong> ({invitedByEmail}) has invited you to join{" "}
            <strong>{organizationName}</strong> as a <strong>{role}</strong>.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={inviteLink}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={text}>
            This invitation will expire in <strong>{expiresIn}</strong>.
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            <strong>What you'll be able to do as a {role}:</strong>
          </Text>

          {role === "owner" && (
            <ul style={list}>
              <li style={listItem}>Full administrative access</li>
              <li style={listItem}>Manage billing and subscriptions</li>
              <li style={listItem}>Add and remove members</li>
              <li style={listItem}>Configure organization settings</li>
            </ul>
          )}

          {role === "admin" && (
            <ul style={list}>
              <li style={listItem}>Manage team members</li>
              <li style={listItem}>Configure projects and settings</li>
              <li style={listItem}>Access all organization resources</li>
              <li style={listItem}>View billing information</li>
            </ul>
          )}

          {role === "member" && (
            <ul style={list}>
              <li style={listItem}>Access organization resources</li>
              <li style={listItem}>Collaborate with team members</li>
              <li style={listItem}>Work on assigned projects</li>
              <li style={listItem}>View team activity</li>
            </ul>
          )}

          <Hr style={hr} />

          <Text style={smallText}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          
          <Text style={linkText}>
            {inviteLink}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you weren't expecting this invitation or have questions,{" "}
            <Link href={`mailto:${invitedByEmail}`} style={link}>
              contact {invitedByName}
            </Link>{" "}
            or{" "}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support`} style={link}>
              reach out to support
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TeamInvitationEmail;

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
