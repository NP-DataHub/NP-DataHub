import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body; // Ensure this is being sent from the client

      // Replace with your actual Stripe Price ID
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: "price_12345", // Replace with your Stripe price ID
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          userId, // Optional: Pass additional metadata
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
