/**
 * Subscription Change Email Template
 * Sent when a subscription plan is upgraded, downgraded, or cancelled
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

interface SubscriptionChangeEmailProps {
  name: string;
  email: string;
  organizationName?: string;
  changeType: "upgraded" | "downgraded" | "cancelled" | "renewed";
  oldPlan: string;
  newPlan: string;
  effectiveDate: string;
  amount?: string;
  interval?: "monthly" | "yearly";
}

export const SubscriptionChangeEmail = ({
  name,
  email,
  organizationName,
  changeType,
  oldPlan,
  newPlan,
  effectiveDate,
  amount,
  interval,
}: SubscriptionChangeEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const getHeading = () => {
    switch (changeType) {
      case "upgraded":
        return "🎉 Subscription Upgraded!";
      case "downgraded":
        return "📉 Subscription Downgraded";
      case "cancelled":
        return "😢 Subscription Cancelled";
      case "renewed":
        return "✅ Subscription Renewed";
      default:
        return "Subscription Updated";
    }
  };

  const getMessage = () => {
    const orgContext = organizationName ? ` for ${organizationName}` : "";
    
    switch (changeType) {
      case "upgraded":
        return `Great news! Your subscription${orgContext} has been upgraded from ${oldPlan} to ${newPlan}.`;
      case "downgraded":
        return `Your subscription${orgContext} has been downgraded from ${oldPlan} to ${newPlan}.`;
      case "cancelled":
        return `Your subscription${orgContext} has been cancelled. You'll continue to have access to ${oldPlan} features until ${effectiveDate}.`;
      case "renewed":
        return `Your ${newPlan} subscription${orgContext} has been successfully renewed.`;
      default:
        return `Your subscription${orgContext} has been updated.`;
    }
  };

  return (
    <Html>
      <Head />
      <Preview>
        Your subscription has been {changeType}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{getHeading()}</Heading>
          
          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            {getMessage()}
          </Text>

          {changeType !== "cancelled" && (
            <Section style={detailsBox}>
              <Text style={detailsTitle}>Subscription Details</Text>
              <Hr style={detailsHr} />
              
              {changeType !== "renewed" && (
                <Text style={detailsText}>
                  <strong>Previous Plan:</strong> {oldPlan}
                </Text>
              )}
              
              <Text style={detailsText}>
                <strong>Current Plan:</strong> {newPlan}
              </Text>
              
              {amount && (
                <Text style={detailsText}>
                  <strong>Amount:</strong> ${amount}/{interval}
                </Text>
              )}
              
              <Text style={detailsText}>
                <strong>Effective Date:</strong> {effectiveDate}
              </Text>
            </Section>
          )}

          {changeType === "cancelled" && (
            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Your access to {oldPlan} features will end on {effectiveDate}. After that, you'll be downgraded to the Free plan.
              </Text>
            </Section>
          )}

          {changeType === "upgraded" && (
            <>
              <Text style={text}>
                <strong>What's new in {newPlan}:</strong>
              </Text>
              
              <ul style={list}>
                <li style={listItem}>Increased API rate limits</li>
                <li style={listItem}>Priority customer support</li>
                <li style={listItem}>Advanced analytics & reporting</li>
                <li style={listItem}>Enhanced security features</li>
              </ul>
            </>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/demo/billing`}>
              View Billing Details
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Questions about your subscription?{" "}
            <Link href={`${baseUrl}/support`} style={link}>
              Contact Support
            </Link>
            {" "}or{" "}
            <Link href={`${baseUrl}/demo/billing`} style={link}>
              manage your subscription
            </Link>
            .
          </Text>

          {changeType === "cancelled" && (
            <Text style={footer}>
              Changed your mind?{" "}
              <Link href={`${baseUrl}/demo/billing`} style={link}>
                Reactivate your subscription
              </Link>
              {" "}at any time.
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionChangeEmail;

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

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 48px",
};

const detailsTitle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const detailsHr = {
  borderColor: "#e6ebf1",
  margin: "12px 0",
};

const detailsText = {
  color: "#444",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const warningBox = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  borderRadius: "4px",
  padding: "16px",
  margin: "24px 48px",
};

const warningText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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
  marginTop: "12px",
};

const link = {
  color: "#000",
  textDecoration: "underline",
};
