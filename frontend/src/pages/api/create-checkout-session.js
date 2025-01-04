import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body; // Passed from the client when user clicks "Subscribe"

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID, // Your Price ID
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 7, // Specify the number of free trial days
          metadata: {
            userId,
          },
        },
        payment_method_collection: "if_required",
        success_url: `${req.headers.origin}/toolbox`,
        cancel_url: `${req.headers.origin}/dashboard`,
        metadata: {
          userId, // Pass userId as metadata to access later in the webhook
        },
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
