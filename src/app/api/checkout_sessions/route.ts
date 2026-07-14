import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any,
}) : null;

export async function POST(req: Request) {
  try {
    const { destination } = await req.json();
    
    // If no Stripe keys are provided, bypass Stripe and simulate success
    if (!stripe) {
      console.log("No Stripe keys found. Returning mock success URL.");
      return NextResponse.json({ url: "/en/success?mock=true" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Voyage AI: ${destination} Booking`,
              description: "Premium AI Itinerary Booking & Concierge Fee",
            },
            unit_amount: 1000 * 100, // ₹1,000 INR booking fee
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/en/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
