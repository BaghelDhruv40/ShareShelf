import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
	try {
		const { amount, currency, metadata } = req.body;

		const paymentIntent = await stripe.paymentIntents.create({
			amount, // in the smallest currency unit (e.g., paise for INR)
			currency, // 'inr'
			metadata, // e.g. { userId, resourceId, transactionType }
			automatic_payment_methods: { enabled: true },
		});

		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Payment initialization failed" });
	}
};
