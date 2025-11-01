import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
	try {
		const { amount, currency, metadata, paymentMethodType } = req.body;

		if (!amount || !currency || !paymentMethodType) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			automatic_payment_methods: { enabled: true },
			metadata,
		});

		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		console.error("Error creating payment intent:", error);
		res.status(500).json({ error: error.message });
	}
});

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	async (req, res) => {
		const sig = req.headers["stripe-signature"];
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

		let event;
		try {
			event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
		} catch (err) {
			console.error("Webhook verification failed:", err.message);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}

		switch (event.type) {
			case "payment_intent.succeeded":
				console.log(" Payment succeeded:", event.data.object.id);
				break;
			case "payment_intent.payment_failed":
				console.log(" Payment failed:", event.data.object.id);
				break;
			case "payment_intent.processing":
				console.log(" Payment processing:", event.data.object.id);
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		res.json({ received: true });
	}
);

router.get("/payment-status/:paymentIntentId", async (req, res) => {
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(
			req.params.paymentIntentId
		);
		res.json({
			status: paymentIntent.status,
			amount: paymentIntent.amount,
			currency: paymentIntent.currency,
			metadata: paymentIntent.metadata,
		});
	} catch (error) {
		console.error("Error retrieving payment status:", error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
