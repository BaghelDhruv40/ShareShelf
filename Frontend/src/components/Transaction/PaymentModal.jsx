import React, { useState, useEffect } from "react";
import { X, Lock, CheckCircle, ChevronRight, CreditCard } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function PaymentModal({
	setShowPaymentModal,
	transactionType,
	paymentStep,
	selectedResource,
	setPaymentStep,
}) {
	const stripe = useStripe();
	const elements = useElements();

	const [paymentMethod, setPaymentMethod] = useState("card");
	const [processing, setProcessing] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [rentalDays, setRentalDays] = useState(
		selectedResource.rentPeriod.value
	);
	const [selectedFormat, setSelectedFormat] = useState("");
	const [initDownloading, setInitDownloading] = useState(false);
	const [paymentError, setPaymentError] = useState(null);
	const [txnId, setTxnId] = useState(null);
	const [upiId, setUpiId] = useState("");

	const [billingDetails, setBillingDetails] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		pincode: "",
	});

	const calculateTotal = () => {
		if (transactionType === "rent") {
			const basePrice =
				(selectedResource.rentPrice / selectedResource.rentPeriod.max) *
				rentalDays;
			const platformFee = basePrice * 0.05;
			const total = basePrice + platformFee;
			return { basePrice, platformFee, total };
		} else {
			const basePrice = selectedResource.sellPrice;
			const platformFee = basePrice * 0.03;
			const total = basePrice + platformFee;
			return { basePrice, platformFee, total };
		}
	};

	const pricing = calculateTotal();

	// ---- Helper: call backend to create PaymentIntent ----
	const createPaymentIntent = async () => {
		try {
			const res = await fetch(
				"http://localhost:8001/api/payment/create-payment-intent",
				{
					method: "POST",
					credentials: "include", // if you use cookies for auth
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						amount: Math.round(pricing.total * 100), // convert ₹ to paise
						currency: "inr",
						paymentMethodType: paymentMethod,
						metadata: {
							resourceId: selectedResource._id || selectedResource.id,
							transactionType,
							rentalDays: transactionType === "rent" ? rentalDays : undefined,
						},
					}),
				}
			);

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(`Create PaymentIntent failed: ${errText}`);
			}

			const data = await res.json();
			return data.clientSecret;
		} catch (err) {
			console.error("createPaymentIntent error:", err);
			throw err;
		}
	};

	// ---- Main payment handler (replaces your mock handleProcessPayment) ----
	// const handleProcessPayment = async () => {
	// 	setPaymentError(null);

	// 	// Sanity check
	// 	if (paymentMethod === "card" && (!stripe || !elements)) {
	// 		setPaymentError(
	// 			"Stripe has not loaded yet. Please try again in a moment."
	// 		);
	// 		return;
	// 	}

	// 	setProcessing(true);

	// 	try {
	// 		// 1) Ask backend to create PaymentIntent and return clientSecret
	// 		const clientSecret = await createPaymentIntent();

	// 		// 2) Confirm payment using Stripe
	// 		let confirmResult;
	// 		if (paymentMethod === "card") {
	// 			const cardElement = elements.getElement(CardElement);
	// 			if (!cardElement) throw new Error("Card element not found");

	// 			confirmResult = await stripe.confirmCardPayment(clientSecret, {
	// 				payment_method: {
	// 					card: cardElement,
	// 					billing_details: {
	// 						name: billingDetails.name || "Anonymous",
	// 						email: billingDetails.email || undefined,
	// 						phone: billingDetails.phone || undefined,
	// 						address: {
	// 							line1: billingDetails.address || undefined,
	// 							city: billingDetails.city || undefined,
	// 							state: billingDetails.state || undefined,
	// 							postal_code: billingDetails.pincode || undefined,
	// 						},
	// 					},
	// 				},
	// 			});
	// 		} else if (paymentMethod === "upi" || paymentMethod === "wallet") {
	// 			// For other methods, we're using Stripe's automatic_payment_methods (backend) or alternative flows.
	// 			// You may need to open a different flow (or use a redirect). For now, try confirmCardPayment fallback.
	// 			confirmResult = await stripe.confirmCardPayment(clientSecret, {
	// 				// If you support UPI/Wallet via Stripe, adjust accordingly.
	// 			});
	// 		}

	// 		if (confirmResult?.error) {
	// 			// Payment failed (e.g., card declined, authentication needed and failed, etc.)
	// 			console.error("Stripe confirm error:", confirmResult.error);
	// 			setPaymentError(confirmResult.error.message || "Payment failed");
	// 			setProcessing(false);
	// 			return;
	// 		}

	// 		const paymentIntent = confirmResult.paymentIntent;
	// 		if (paymentIntent && paymentIntent.status === "succeeded") {
	// 			// Payment succeeded — update UI and save transaction id
	// 			setTxnId(paymentIntent.id);
	// 			setPaymentSuccess(true);
	// 			setPaymentStep(3);

	// 			// Optionally: inform your backend to mark order as paid (though webhook is the canonical source)
	// 			// await fetch("/api/payment/confirm", { method: "POST", body: JSON.stringify({ paymentIntentId: paymentIntent.id }) });
	// 		} else {
	// 			// Handle other statuses (requires_action, processing, etc.)
	// 			console.warn("Unexpected paymentIntent status:", paymentIntent?.status);
	// 			setPaymentError(`Payment status: ${paymentIntent?.status}`);
	// 		}
	// 	} catch (err) {
	// 		console.error("Payment processing error:", err);
	// 		setPaymentError(err.message || "Payment processing failed");
	// 	} finally {
	// 		setProcessing(false);
	// 	}
	// };
	const handleProcessPayment = async () => {
		setPaymentError(null);

		// Sanity check
		if (!stripe) {
			setPaymentError(
				"Stripe has not loaded yet. Please try again in a moment."
			);
			return;
		}

		setProcessing(true);

		try {
			// 1) Ask backend to create PaymentIntent and return clientSecret
			const clientSecret = await createPaymentIntent();

			// 2) Confirm payment using Stripe based on payment method
			let confirmResult;

			if (paymentMethod === "card") {
				const cardElement = elements.getElement(CardElement);
				if (!cardElement) throw new Error("Card element not found");

				confirmResult = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: cardElement,
						billing_details: {
							name: billingDetails.name || "Anonymous",
							email: billingDetails.email || undefined,
							phone: billingDetails.phone || undefined,
							address: {
								line1: billingDetails.address || undefined,
								city: billingDetails.city || undefined,
								state: billingDetails.state || undefined,
								postal_code: billingDetails.pincode || undefined,
							},
						},
					},
				});
			} else if (paymentMethod === "upi") {
				// Validate UPI ID
				if (!upiId.trim()) {
					setPaymentError("Please enter a valid UPI ID");
					setProcessing(false);
					return;
				}

				confirmResult = await stripe.confirmPayment({
					clientSecret,
					confirmParams: {
						payment_method_data: {
							type: "upi",
							billing_details: {
								name: billingDetails.name || "Anonymous",
								email: billingDetails.email || undefined,
								phone: billingDetails.phone || undefined,
							},
						},
						return_url: window.location.origin + "/payment-success",
					},
					redirect: "if_required",
				});
			} else if (paymentMethod === "wallet") {
				// Validate wallet selection
				if (!selectedWallet) {
					setPaymentError("Please select a wallet");
					setProcessing(false);
					return;
				}

				// Map wallet names to Stripe wallet types
				const walletTypeMap = {
					Paytm: "paytm",
					PhonePe: "phonepe",
					"Google Pay": "google_pay",
					"Amazon Pay": "amazon_pay",
				};

				confirmResult = await stripe.confirmPayment({
					clientSecret,
					confirmParams: {
						payment_method_data: {
							type: "wallet",
							wallet: {
								type: walletTypeMap[selectedWallet],
							},
							billing_details: {
								name: billingDetails.name || "Anonymous",
								email: billingDetails.email || undefined,
								phone: billingDetails.phone || undefined,
							},
						},
						return_url: window.location.origin + "/payment-success",
					},
					redirect: "if_required",
				});
			}

			if (confirmResult?.error) {
				// Payment failed (e.g., card declined, authentication needed and failed, etc.)
				console.error("Stripe confirm error:", confirmResult.error);
				setPaymentError(confirmResult.error.message || "Payment failed");
				setProcessing(false);
				return;
			}

			const paymentIntent = confirmResult.paymentIntent;
			if (paymentIntent && paymentIntent.status === "succeeded") {
				// Payment succeeded — update UI and save transaction id
				setTxnId(paymentIntent.id);
				setPaymentSuccess(true);
				setPaymentStep(3);

				// Optionally: inform your backend to mark order as paid (though webhook is the canonical source)
				// await fetch("/api/payment/confirm", { method: "POST", body: JSON.stringify({ paymentIntentId: paymentIntent.id }) });
			} else if (paymentIntent && paymentIntent.status === "requires_action") {
				// Handle redirect for UPI/Wallet if needed
				setPaymentError(
					"Payment requires additional action. Please complete the payment in your app."
				);
			} else {
				// Handle other statuses (processing, etc.)
				console.warn("Unexpected paymentIntent status:", paymentIntent?.status);
				setPaymentError(`Payment status: ${paymentIntent?.status}`);
			}
		} catch (err) {
			console.error("Payment processing error:", err);
			setPaymentError(err.message || "Payment processing failed");
		} finally {
			setProcessing(false);
		}
	};

	// ---- Download helper (unchanged) ----
	const handleDownload = async (fileId) => {
		try {
			setInitDownloading(true);
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_SERVER}/resources/download/${fileId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok)
				throw new Error(`Download failed: ${response.statusText}`);
			const blob = await response.blob();
			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = "downloaded_file";
			if (contentDisposition && contentDisposition.includes("filename=")) {
				filename = contentDisposition
					.split("filename=")[1]
					.replace(/['"]/g, "");
			}
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Download failed:", error);
			alert("Something went wrong while downloading the file.");
		} finally {
			setInitDownloading(false);
		}
	};

	// ---- Small UX: if user changes rentalDays, recalc on the fly (already done via pricing) ----

	return (
		<>
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-3xl">
						<div>
							<h2 className="text-2xl font-bold text-gray-800">
								{transactionType === "rent" ? "Rent Resource" : "Buy Resource"}
							</h2>
							<p className="text-sm text-gray-600">{selectedResource.title}</p>
						</div>
						<button
							onClick={() => setShowPaymentModal(false)}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
							<X className="h-6 w-6 text-gray-600" />
						</button>
					</div>

					{/* Progress */}
					<div className="px-6 py-4 bg-gray-50">
						<div className="flex items-center justify-center gap-4">
							<div
								className={`flex items-center gap-2 ${
									paymentStep >= 1 ? "text-blue-600" : "text-gray-400"
								}`}>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
										paymentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
									}`}>
									1
								</div>
								<span className="text-sm font-medium hidden sm:inline">
									Details
								</span>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
							<div
								className={`flex items-center gap-2 ${
									paymentStep >= 2 ? "text-blue-600" : "text-gray-400"
								}`}>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
										paymentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
									}`}>
									2
								</div>
								<span className="text-sm font-medium hidden sm:inline">
									Payment
								</span>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
							<div
								className={`flex items-center gap-2 ${
									paymentStep >= 3 ? "text-green-600" : "text-gray-400"
								}`}>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
										paymentStep >= 3 ? "bg-green-500 text-white" : "bg-gray-200"
									}`}>
									3
								</div>
								<span className="text-sm font-medium hidden sm:inline">
									Confirm
								</span>
							</div>
						</div>
					</div>

					<div className="p-6">
						{/* Step 1: Details */}
						{paymentStep === 1 && (
							<div className="space-y-6">
								{transactionType === "rent" ? (
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-3">
											Rental Period (Max: {selectedResource.rentPeriod.max}{" "}
											days)
										</label>
										<div className="flex items-center gap-4">
											<input
												type="range"
												min={selectedResource.rentPeriod.min}
												max={selectedResource.rentPeriod.max}
												value={rentalDays}
												onChange={(e) => setRentalDays(Number(e.target.value))}
												className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
											/>
											<div className="w-20 px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-xl text-center">
												{rentalDays}d
											</div>
										</div>
									</div>
								) : (
									<div className="grid grid-cols-2 gap-3 mb-6">
										<button
											onClick={() => setSelectedFormat("physical")}
											className={`p-4 border-2 rounded-xl transition-all duration-300 ${
												selectedFormat === "physical"
													? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
													: "border-gray-300 hover:border-gray-400"
											}`}>
											<p className="text-sm font-medium text-gray-700">
												📦 Physical
											</p>
										</button>
										<button
											onClick={() => setSelectedFormat("digital")}
											className={`p-4 border-2 rounded-xl transition-all duration-300 ${
												selectedFormat === "digital"
													? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
													: "border-gray-300 hover:border-gray-400"
											}`}>
											<p className="text-sm font-medium text-gray-700">
												💾 Digital
											</p>
										</button>
									</div>
								)}

								<div>
									<h3 className="font-semibold text-gray-800 mb-3">
										Billing Details
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input
											type="text"
											placeholder="Full name"
											value={billingDetails.name}
											onChange={(e) =>
												setBillingDetails((p) => ({
													...p,
													name: e.target.value,
												}))
											}
											className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
										/>
										<input
											type="email"
											placeholder="Email"
											value={billingDetails.email}
											onChange={(e) =>
												setBillingDetails((p) => ({
													...p,
													email: e.target.value,
												}))
											}
											className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
										/>
									</div>
									<input
										type="tel"
										placeholder="Phone"
										value={billingDetails.phone}
										onChange={(e) =>
											setBillingDetails((p) => ({
												...p,
												phone: e.target.value,
											}))
										}
										className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none mt-4"
									/>
									<input
										type="text"
										placeholder="Address"
										value={billingDetails.address}
										onChange={(e) =>
											setBillingDetails((p) => ({
												...p,
												address: e.target.value,
											}))
										}
										className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none mt-4"
									/>
									<div className="grid grid-cols-3 gap-4 mt-4">
										<input
											type="text"
											placeholder="City"
											value={billingDetails.city}
											onChange={(e) =>
												setBillingDetails((p) => ({
													...p,
													city: e.target.value,
												}))
											}
											className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
										/>
										<input
											type="text"
											placeholder="State"
											value={billingDetails.state}
											onChange={(e) =>
												setBillingDetails((p) => ({
													...p,
													state: e.target.value,
												}))
											}
											className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
										/>
										<input
											type="text"
											placeholder="PIN"
											value={billingDetails.pincode}
											onChange={(e) =>
												setBillingDetails((p) => ({
													...p,
													pincode: e.target.value,
												}))
											}
											className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
										/>
									</div>
								</div>

								<div className="p-4 bg-gray-50 rounded-xl">
									<h3 className="font-semibold text-gray-800 mb-3">
										Order Summary
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between text-gray-600">
											<span>
												{transactionType === "rent"
													? `Rental (${rentalDays} days)`
													: "Purchase Price"}
											</span>
											<span>₹{pricing.basePrice.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-gray-600">
											<span>
												Platform Fee{" "}
												{transactionType === "rent" ? "(5%)" : "(3%)"}
											</span>
											<span>₹{pricing.platformFee.toFixed(2)}</span>
										</div>
										<div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-lg">
											<span>Total</span>
											<span className="text-blue-600">
												₹{pricing.total.toFixed(2)}
											</span>
										</div>
									</div>
								</div>

								<button
									onClick={() => setPaymentStep(2)}
									className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
									Continue to Payment
								</button>
							</div>
						)}

						{/* Step 2: Payment */}
						{paymentStep === 2 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										Payment Method
									</label>
									<div className="grid grid-cols-3 gap-3 mb-6">
										<button
											onClick={() => setPaymentMethod("card")}
											className={`p-4 border-2 rounded-xl transition-all duration-300 ${
												paymentMethod === "card"
													? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
													: "border-gray-300 hover:border-gray-400"
											}`}>
											<CreditCard className="h-6 w-6 mx-auto mb-2 text-gray-700" />
											<p className="text-sm font-medium text-gray-700">Card</p>
										</button>
										<button
											onClick={() => setPaymentMethod("upi")}
											className={`p-4 border-2 rounded-xl transition-all duration-300 ${
												paymentMethod === "upi"
													? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
													: "border-gray-300 hover:border-gray-400"
											}`}>
											<div className="text-2xl mb-2">📱</div>
											<p className="text-sm font-medium text-gray-700">UPI</p>
										</button>
										<button
											onClick={() => setPaymentMethod("wallet")}
											className={`p-4 border-2 rounded-xl transition-all duration-300 ${
												paymentMethod === "wallet"
													? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
													: "border-gray-300 hover:border-gray-400"
											}`}>
											<div className="text-2xl mb-2">👛</div>
											<p className="text-sm font-medium text-gray-700">
												Wallet
											</p>
										</button>
									</div>
								</div>

								{/* Card UI uses Stripe's CardElement */}
								{paymentMethod === "card" && (
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Card Details
											</label>
											<div className="p-4 border border-gray-300 rounded-xl">
												<CardElement options={{ hidePostalCode: true }} />
											</div>
										</div>
										<p className="text-sm text-gray-500">
											We use Stripe to securely process card payments. Card
											details never touch our servers.
										</p>
									</div>
								)}

								{/* UPI / Wallet placeholders (you may integrate separate flows later) */}
								{paymentMethod === "upi" && (
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												UPI ID
											</label>
											<input
												type="text"
												placeholder="yourname@upi"
												value={upiId}
												onChange={(e) => setUpiId(e.target.value)}
												className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											/>
										</div>
										<div className="p-4 bg-blue-50 rounded-xl text-center">
											<p className="text-sm text-gray-600 mb-2">
												Or scan QR code
											</p>
											<div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-xl mx-auto flex items-center justify-center">
												<p className="text-gray-400 text-xs">QR Code</p>
											</div>
										</div>
									</div>
								)}

								{paymentMethod === "wallet" && (
									<div className="space-y-3">
										{["Paytm", "PhonePe", "Google Pay", "Amazon Pay"].map(
											(wallet) => (
												<button
													key={wallet}
													className="w-full p-4 border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left font-medium text-gray-700">
													{wallet}
												</button>
											)
										)}
									</div>
								)}

								<div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
									<Lock className="h-5 w-5 text-green-600" />
									<p className="text-sm text-gray-700">
										Your payment information is secure and encrypted
									</p>
								</div>

								{paymentError && (
									<div className="text-sm text-red-600">{paymentError}</div>
								)}

								<div className="flex gap-3">
									<button
										onClick={() => setPaymentStep(1)}
										className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300">
										Back
									</button>
									<button
										onClick={handleProcessPayment}
										disabled={processing}
										className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
										{processing ? (
											<span className="flex items-center justify-center gap-2">
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												Processing...
											</span>
										) : (
											`Pay ₹${pricing.total.toFixed(2)}`
										)}
									</button>
								</div>
							</div>
						)}

						{/* Step 3: Success */}
						{paymentStep === 3 && paymentSuccess && (
							<div className="text-center py-8">
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<CheckCircle className="h-12 w-12 text-green-600" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-3">
									Payment Successful!
								</h3>
								<p className="text-gray-600 mb-6">
									Your {transactionType === "rent" ? "rental" : "purchase"} has
									been confirmed
								</p>
								<div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
									<h4 className="font-semibold text-gray-800 mb-3">
										Transaction Details
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600">Transaction ID</span>
											<span className="font-mono font-semibold">
												{txnId || `TXN${Date.now()}`}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Resource</span>
											<span className="font-semibold">
												{selectedResource.title}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Amount Paid</span>
											<span className="font-semibold text-green-600">
												₹{pricing.total.toFixed(2)}
											</span>
										</div>
										{transactionType === "rent" && (
											<div className="flex justify-between">
												<span className="text-gray-600">Rental Period</span>
												<span className="font-semibold">{rentalDays} days</span>
											</div>
										)}
									</div>
								</div>

								<div className="space-y-3">
									{selectedFormat === "digital" && (
										<button
											onClick={() => handleDownload(selectedResource.id)}
											className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
											{initDownloading ? "Initiating Download..." : "Download"}
										</button>
									)}
									<button
										onClick={() => {
											setShowPaymentModal(false);
											alert("Redirecting to your orders...");
										}}
										className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
										View My Orders
									</button>
									<button
										onClick={() => {
											setShowPaymentModal(false);
											alert("Continuing to browse resources...");
										}}
										className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300">
										Continue Browsing
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
