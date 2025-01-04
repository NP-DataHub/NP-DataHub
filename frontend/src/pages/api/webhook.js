import { buffer } from "micro";
import Stripe from "stripe";
import * as admin from "firebase-admin";

if (
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_WEBHOOK_SECRET ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Missing required environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const decodedPrivateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64")
.toString("utf-8")
.replace(/\\n/g, "\n");
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: decodedPrivateKey

      }),
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle raw request body
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log(`Received ${req.method} request. Only POST is allowed.`);
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event; // Declare 'event' before using it

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Verify using your webhook secret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId; // Safeguard: Optional chaining in case metadata is undefined
  
    if (!userId) {
      console.error("Error: userId is missing or undefined");
      return res.status(400).json({ error: "userId is missing or undefined" });
    }
  
    // Proceed if userId exists
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  
    try {
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        premium_user: true,
        subscription_expiration: admin.firestore.Timestamp.fromDate(expirationDate),
      });
      console.log(`Successfully updated subscription for user`);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
  

  res.status(200).json({ received: true });
}
