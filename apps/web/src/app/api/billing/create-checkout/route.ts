import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authClient } from "@/lib/auth-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

/**
 * Create Stripe Checkout Session
 * 
 * This endpoint creates a Stripe Checkout session for:
 * - New subscriptions
 * - Plan upgrades
 * - Plan downgrades
 * 
 * The Better Auth Stripe plugin handles the rest automatically.
 * 
 * Usage:
 * POST /api/billing/create-checkout
 * Body: { priceId: "price_xxx", organizationId?: "org_xxx" }
 */
export async function POST(request: NextRequest) {
  try {
    const { priceId, organizationId, mode = "subscription" } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get current user session
    const session = await authClient.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create Stripe customer ID
    let customerId = session.user.stripeCustomerId;

    if (!customerId) {
      // Create Stripe customer if not exists
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
          organizationId: organizationId || "",
        },
      });
      customerId = customer.id;
      
      // Better Auth will sync this customer ID automatically
      console.log(`Created Stripe customer: ${customerId}`);
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL || "http://localhost:3000"}/demo/billing/current-plan?success=true`,
      cancel_url: `${process.env.SITE_URL || "http://localhost:3000"}/demo/pricing`,
      metadata: {
        userId: session.user.id,
        organizationId: organizationId || "",
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: "required",
      // Subscription-specific options
      ...(mode === "subscription" && {
        subscription_data: {
          metadata: {
            userId: session.user.id,
            organizationId: organizationId || "",
          },
          // Reference ID for Better Auth
          ...(organizationId && {
            metadata: {
              referenceId: organizationId,
            },
          }),
        },
      }),
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
