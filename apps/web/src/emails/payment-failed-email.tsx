/**
 * Payment Failed Email Template
 * Sent when a subscription payment fails
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

interface PaymentFailedEmailProps {
  name: string;
  email: string;
  organizationName?: string;
  plan: string;
  amount: string;
  interval: "monthly" | "yearly";
  retryDate?: string;
  daysUntilDowngrade?: number;
}

export const PaymentFailedEmail = ({
  name,
  email,
  organizationName,
  plan,
  amount,
  interval,
  retryDate,
  daysUntilDowngrade = 7,
}: PaymentFailedEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const orgContext = organizationName ? ` for ${organizationName}` : "";

  return (
    <Html>
      <Head />
      <Preview>
        Action required: Payment failed for your {plan} subscription
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>⚠️ Payment Failed</Heading>
          
          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            We were unable to process the payment for your <strong>{plan}</strong> subscription{orgContext}.
          </Text>

          <Section style={alertBox}>
            <Text style={alertText}>
              <strong>⏰ Action Required</strong>
            </Text>
            <Text style={alertText}>
              Please update your payment method within the next <strong>{daysUntilDowngrade} days</strong> to avoid service interruption.
            </Text>
          </Section>

          <Section style={detailsBox}>
            <Text style={detailsTitle}>Payment Details</Text>
            <Hr style={detailsHr} />
            
            <Text style={detailsText}>
              <strong>Plan:</strong> {plan}
            </Text>
            
            <Text style={detailsText}>
              <strong>Amount:</strong> ${amount}/{interval}
            </Text>
            
            {retryDate && (
              <Text style={detailsText}>
                <strong>Next Retry:</strong> {retryDate}
              </Text>
            )}
            
            <Text style={detailsText}>
              <strong>Days Until Downgrade:</strong> {daysUntilDowngrade}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/demo/billing`}>
              Update Payment Method
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>Common reasons for payment failure:</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>Insufficient funds in your account</li>
            <li style={listItem}>Expired credit card</li>
            <li style={listItem}>Card reported lost or stolen</li>
            <li style={listItem}>Billing address mismatch</li>
            <li style={listItem}>Card declined by your bank</li>
          </ul>

          <Hr style={hr} />

          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>

          <Text style={text}>
            {retryDate ? (
              <>
                We'll automatically retry your payment on <strong>{retryDate}</strong>. 
                If the payment fails again, your subscription will be downgraded to the Free plan after {daysUntilDowngrade} days.
              </>
            ) : (
              <>
                If you don't update your payment method within {daysUntilDowngrade} days, 
                your subscription will be downgraded to the Free plan and you'll lose access to {plan} features.
              </>
            )}
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              ⚠️ Don't lose your data or access! Update your payment method now to keep your {plan} features.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Need help?{" "}
            <Link href={`${baseUrl}/support`} style={link}>
              Contact Support
            </Link>
            {" "}or{" "}
            <Link href={`${baseUrl}/demo/billing`} style={link}>
              view your billing settings
            </Link>
            .
          </Text>

          <Text style={footer}>
            If you believe this is a mistake or have questions about this charge,{" "}
            <Link href={`${baseUrl}/support`} style={link}>
              please contact us
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentFailedEmail;

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
  color: "#dc2626",
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
  backgroundColor: "#dc2626",
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

const alertBox = {
  backgroundColor: "#fef2f2",
  borderLeft: "4px solid #dc2626",
  borderRadius: "4px",
  padding: "16px",
  margin: "24px 48px",
};

const alertText = {
  color: "#991b1b",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
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
