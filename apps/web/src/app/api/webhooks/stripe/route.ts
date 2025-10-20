import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives and processes Stripe webhook events.
 * Better Auth's Stripe plugin automatically handles subscription updates in the database.
 * 
 * We handle additional business logic here:
 * - Send emails on payment success/failure
 * - Update usage counters
 * - Log events for analytics
 * - Handle dunning for failed payments
 * 
 * Setup:
 * 1. Local testing: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * 2. Production: Add webhook endpoint in Stripe dashboard
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found in headers");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const error = err as Error;
      console.error("Webhook signature verification failed:", error.message);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.updated":
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`[Webhook] Subscription created: ${subscription.id}`);
  
  // Better Auth automatically updates the database
  // Add any additional business logic here
  
  // TODO: Send welcome email with subscription details
  // TODO: Update usage counters for the new plan
  // TODO: Log event for analytics
  
  const customerId = subscription.customer as string;
  const plan = subscription.items.data[0]?.price.lookup_key || "unknown";
  
  console.log(`Customer ${customerId} subscribed to ${plan}`);
}

/**
 * Handle subscription updates (plan changes, renewals, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`[Webhook] Subscription updated: ${subscription.id}`);
  
  // Better Auth automatically updates the database
  // Add any additional business logic here
  
  const customerId = subscription.customer as string;
  const plan = subscription.items.data[0]?.price.lookup_key || "unknown";
  const status = subscription.status;
  
  console.log(`Customer ${customerId} subscription is now ${status} on ${plan}`);
  
  // TODO: Send email on plan upgrade/downgrade
  // TODO: Update rate limits based on new plan
  // TODO: Log plan change event
}

/**
 * Handle subscription deletion (cancellation)
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`[Webhook] Subscription deleted: ${subscription.id}`);
  
  const customerId = subscription.customer as string;
  
  console.log(`Customer ${customerId} subscription canceled`);
  
  // TODO: Send cancellation confirmation email
  // TODO: Schedule data retention/deletion
  // TODO: Revert to free plan limits
  // TODO: Log cancellation reason if available
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`[Webhook] Payment succeeded: ${invoice.id}`);
  
  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars
  const currency = invoice.currency.toUpperCase();
  
  console.log(`Customer ${customerId} paid ${currency} ${amountPaid}`);
  
  // TODO: Send receipt email
  // TODO: Reset usage counters for new billing period
  // TODO: Remove any payment failure warnings
  // TODO: Log successful payment for analytics
}

/**
 * Handle failed payment (dunning)
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.error(`[Webhook] Payment failed: ${invoice.id}`);
  
  const customerId = invoice.customer as string;
  const amountDue = invoice.amount_due / 100;
  const currency = invoice.currency.toUpperCase();
  const attemptCount = invoice.attempt_count;
  
  console.error(
    `Customer ${customerId} payment failed (attempt ${attemptCount}): ${currency} ${amountDue}`
  );
  
  // TODO: Send dunning email based on attempt count
  // TODO: Apply grace period (3-7 days typical)
  // TODO: After grace period, downgrade to free plan or suspend account
  // TODO: Log payment failure for analytics
  
  // Example dunning logic:
  if (attemptCount === 1) {
    // First failure: friendly reminder
    console.log("Sending first payment failure reminder email");
  } else if (attemptCount === 2) {
    // Second failure: more urgent reminder
    console.log("Sending urgent payment failure email");
  } else if (attemptCount >= 3) {
    // Third failure: final warning before suspension
    console.log("Sending final warning email before account suspension");
  }
}

/**
 * Handle customer updates
 */
async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log(`[Webhook] Customer updated: ${customer.id}`);
  
  // Better Auth may update customer info automatically
  // Add any additional business logic here
  
  console.log(`Customer ${customer.id} information updated`);
  
  // TODO: Sync customer details if needed
}

/**
 * Handle completed checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Webhook] Checkout completed: ${session.id}`);
  
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  console.log(`Customer ${customerId} completed checkout for subscription ${subscriptionId}`);
  
  // TODO: Send subscription activation email
  // TODO: Log conversion for analytics
  // TODO: Update onboarding status
}
