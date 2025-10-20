import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authClient } from "@/lib/auth-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

/**
 * Create Stripe Customer Portal Session
 * 
 * This endpoint creates a Stripe Customer Portal session where users can:
 * - Update payment methods
 * - View invoices
 * - Cancel subscription
 * - Update billing information
 * 
 * The portal is fully managed by Stripe with your branding.
 * 
 * Usage:
 * POST /api/billing/create-portal
 * Body: { returnUrl?: "/custom-return-path" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const returnUrl = body?.returnUrl || "/demo/billing/current-plan";

    // Get current user session
    const session = await authClient.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const customerId = session.user.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer found. Please subscribe to a plan first." },
        { status: 400 }
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.SITE_URL || "http://localhost:3000"}${returnUrl}`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
