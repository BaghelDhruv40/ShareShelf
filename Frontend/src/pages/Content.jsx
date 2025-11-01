import { useState, useEffect } from "react";
import {
	Star,
	Heart,
	Share2,
	MapPin,
	Clock,
	Package,
	ShieldCheck,
	MessageSquare,
	Check,
	Eye,
	ArrowLeft,
	Tag,
	DollarSign,
	ShoppingCart,
	Box,
} from "lucide-react";

import PaymentModal from "../components/Transaction/PaymentModal";
import { useParams } from "react-router-dom";
import axios from "axios";
const Content = () => {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const [activeTab, setActiveTab] = useState("description");
	const [transactionType, setTransactionType] = useState(null);
	const [paymentStep, setPaymentStep] = useState(1);
	const [isFavorited, setIsFavorited] = useState(false);
	const [starRating, setStarRating] = useState(1);
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [resource, setResource] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchResource = async () => {
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_BACKEND_SERVER}/resources/${id}`
				);
				setResource({
					...data,
					images: [...data.coverImageURL, ...data.resourceImageURLs],
				});
			} catch (err) {
				console.error("Error fetching resource:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchResource();
	}, [id]);

	const handleAddToCart = () => {
		alert(
			`Added to cart: ${transactionType === "rent" ? "Rent" : "Buy"} - ${
				resource.title
			}`
		);
	};
	const handleInitiatePayment = (type) => {
		setTransactionType(type);
		setShowPaymentModal(true);
		setPaymentStep(1);
	};

	const renderStars = (rating) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`h-4 w-4 ${
					i < Math.floor(rating)
						? "text-yellow-400 fill-current"
						: "text-gray-300"
				}`}
			/>
		));
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-24">
				<div className="container mx-auto px-6">
					<div className="text-center py-20">
						<div
							className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
							style={{ borderColor: "#667eea" }}></div>
						<h2 className="text-2xl font-semibold text-gray-700">
							Loading Resources...
						</h2>
						<p className="text-gray-500 mt-2">
							Please wait while we fetch the latest resources for you
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-5">
			<div className="container mx-auto px-6 py-8">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
					<button className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1">
						<ArrowLeft className="h-4 w-4" />
						Back to resources
					</button>
					<span>/</span>
					<span>
						{resource.resourceType.charAt(0).toUpperCase() +
							resource.resourceType.slice(1).replace("_", " ")}
					</span>
					<span>/</span>
					<span className="text-gray-800">{resource.title}</span>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Images */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
							{/* Main Image */}
							<div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100">
								<img
									src={resource.images[selectedImage]}
									alt={resource.title}
									className="w-full h-96 object-contain"
								/>
								<button
									onClick={() => setIsFavorited(!isFavorited)}
									className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
										isFavorited
											? "bg-red-500 text-white"
											: "bg-white/80 text-gray-700 hover:bg-white"
									}`}>
									<Heart
										className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`}
									/>
								</button>
								<button className="absolute top-4 left-4 p-3 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-all duration-300">
									<Share2 className="h-5 w-5 text-gray-700" />
								</button>
							</div>

							{/* Thumbnail Images */}
							<div className="flex gap-3 overflow-x-auto pb-2">
								{resource.images.map((img, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
											selectedImage === index
												? "border-blue-500 ring-2 ring-blue-200"
												: "border-gray-200 hover:border-gray-300"
										}`}>
										<img
											src={img}
											alt={`View ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						</div>

						{/* Tabs Section */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							{/* Tab Headers */}
							<div className="flex gap-2 border-b border-gray-200 mb-6">
								{["description", "specifications", "reviews"].map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`px-6 py-3 font-medium transition-all duration-300 ${
											activeTab === tab
												? "text-blue-600 border-b-2 border-blue-600"
												: "text-gray-600 hover:text-gray-800"
										}`}>
										{tab.charAt(0).toUpperCase() + tab.slice(1)}
										{tab === "reviews" && ` (${resource.reviews.length})`}
									</button>
								))}
							</div>

							{/* Tab Content */}
							{activeTab === "description" && (
								<div className="prose max-w-none">
									<h3 className="text-xl font-bold text-gray-800 mb-4">
										About this resource
									</h3>
									<div className="text-gray-700 whitespace-pre-line leading-relaxed">
										{resource.description}
									</div>

									<div className="mt-6 grid grid-cols-2 gap-4">
										<div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
											<ShieldCheck className="h-8 w-8 text-blue-600" />
											<div>
												<div className="font-semibold text-gray-800">
													Quality Assured
												</div>
												<div className="text-sm text-gray-600">
													Verified condition
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
											<Package className="h-8 w-8 text-green-600" />
											<div>
												<div className="font-semibold text-gray-800">
													Fast Delivery
												</div>
												<div className="text-sm text-gray-600">
													{resource.shippingInfo.estimatedDays}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === "specifications" && (
								<div>
									<h3 className="text-xl font-bold text-gray-800 mb-4">
										Specifications
									</h3>
									<div className="space-y-3">
										{Object.entries(resource.specifications).map(
											([key, value]) => (
												<div
													key={key}
													className="flex py-3 border-b border-gray-100 last:border-b-0">
													<div className="w-1/3 text-gray-600 font-medium">
														{key}
													</div>
													<div className="w-2/3 text-gray-800">{value}</div>
												</div>
											)
										)}
									</div>
								</div>
							)}

							{activeTab === "reviews" && (
								<div>
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-xl font-bold text-gray-800">
											Customer Reviews
										</h3>
										<button
											onClick={() => setShowReviewForm(!showReviewForm)}
											className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
											Write a Review
										</button>
									</div>

									{/* Overall Rating */}
									<div className="bg-gray-50 rounded-xl p-6 mb-6">
										<div className="flex items-center gap-8">
											<div className="text-center">
												<div className="text-5xl font-bold text-gray-800 mb-2">
													{resource.rating}
												</div>
												<div className="flex items-center justify-center mb-1">
													{renderStars(resource.rating)}
												</div>
												<div className="text-sm text-gray-600">
													{resource.reviews.length} ratings
												</div>
											</div>
											<div className="flex-1">
												{[5, 4, 3, 2, 1].map((stars) => {
													const percentage = Math.random() * 100; // Mock data
													return (
														<div
															key={stars}
															className="flex items-center gap-3 mb-2">
															<span className="text-sm text-gray-600 w-8">
																{stars}★
															</span>
															<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
																<div
																	className="h-full bg-yellow-400 rounded-full"
																	style={{ width: `${percentage}%` }}
																/>
															</div>
															<span className="text-sm text-gray-600 w-12">
																{Math.round(percentage)}%
															</span>
														</div>
													);
												})}
											</div>
										</div>
									</div>

									{/* Review Form */}
									{showReviewForm && (
										<div className="bg-gray-50 rounded-xl p-6 mb-6">
											<h4 className="font-semibold text-gray-800 mb-4">
												Share your experience
											</h4>
											<div className="space-y-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Your Rating
													</label>
													<div className="flex gap-2">
														{starRating &&
															[2, 3, 4, 5, 6].map((starId) => (
																<button key={starId}>
																	<Star
																		className={
																			starRating >= starId
																				? "fill-yellow-400"
																				: "" +
																				  `h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors duration-200`
																		}
																		onClick={() => {
																			setStarRating(starId);
																		}}
																	/>
																</button>
															))}
													</div>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Your Review
													</label>
													<textarea
														rows={4}
														className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
														placeholder="Share your thoughts about this res..."
													/>
												</div>
												<div className="flex gap-3">
													<button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
														Submit Review
													</button>
													<button
														onClick={() => setShowReviewForm(false)}
														className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200">
														Cancel
													</button>
												</div>
											</div>
										</div>
									)}

									{/* Reviews List */}
									<div className="space-y-4">
										{resource.reviews.map((review) => (
											<div
												key={review.id}
												className="border border-gray-200 rounded-xl p-6">
												<div className="flex items-start gap-4">
													<img
														src={review.avatar}
														alt={review.user}
														className="w-12 h-12 rounded-full object-cover"
													/>
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<div>
																<div className="flex items-center gap-2">
																	<span className="font-semibold text-gray-800">
																		{review.user}
																	</span>
																	{review.verified && (
																		<span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
																			<Check className="h-3 w-3" />
																			Verified
																		</span>
																	)}
																</div>
																<div className="flex items-center gap-2 mt-1">
																	<div className="flex">
																		{renderStars(review.rating)}
																	</div>
																	<span className="text-sm text-gray-500">
																		{new Date(review.date).toLocaleDateString()}
																	</span>
																</div>
															</div>
														</div>
														<p className="text-gray-700 mb-3">
															{review.comment}
														</p>
														<div className="flex items-center gap-4 text-sm">
															<button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
																<span>Helpful ({review.helpful})</span>
															</button>
															<button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
																Report
															</button>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Related resources */}
						<div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
							<h3 className="text-xl font-bold text-gray-800 mb-6">
								Related resources
							</h3>
							<div className="grid grid-cols-3 gap-4">
								{resource.relatedResources.map((item) => (
									<div
										key={item.id}
										className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
										<img
											src={item.image}
											alt={item.title}
											className="w-full h-32 object-cover rounded-lg mb-3"
										/>
										<h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
											{item.title}
										</h4>
										<div className="flex items-center justify-between">
											<span className="text-sm font-bold text-gray-800">
												₹{item.rentPrice}
											</span>
											<div className="flex items-center gap-1">
												<Star className="h-3 w-3 text-yellow-400 fill-current" />
												<span className="text-xs text-gray-600">
													{item.rating}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Action Panel */}
					<div className="lg:col-span-1">
						<div className="sticky top-24">
							{/* Main Info Card */}
							<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
								<h1 className="text-2xl font-bold text-gray-800 mb-2">
									{resource.title}
								</h1>
								<p className="text-gray-600 mb-4">by {resource.author}</p>
								<div className="flex items-center gap-3 mb-4">
									<div className="flex items-center gap-1">
										{renderStars(resource.rating)}
									</div>
									<span className="text-sm font-medium text-gray-700">
										{resource.rating}
									</span>
									<span className="text-sm text-gray-500">
										({resource.reviews.length} reviews)
									</span>
								</div>
								<div className="flex flex-wrap gap-2 mb-6">
									{resource.tags.slice(0, 4).map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
											<Tag className="h-3 w-3" />
											{tag}
										</span>
									))}
								</div>
								<div className="border-t border-gray-200 pt-4 mb-6">
									<div className="flex items-center gap-3 mb-3">
										<MapPin className="h-5 w-5 text-gray-400" />
										<span className="text-sm text-gray-700">
											{resource.uploader.location?.city ||
											resource.uploader.location?.landmark ||
											resource.uploader.location?.zipcode ||
											resource.uploader.location?.state ||
											resource.uploader.location?.country
												? `${resource.uploader.location?.city ?? ""}
												${resource.uploader.location?.landmark ?? ""},
												${resource.uploader.location?.zipcode ?? ""},
												${resource.uploader.location?.state ?? ""},
												${resource.uploader.location?.country ?? ""}`
												: "Unavailable"}
										</span>
									</div>
									<div className="flex items-center gap-3 mb-3">
										<Eye className="h-5 w-5 text-gray-400" />
										<span className="text-sm text-gray-700">
											{resource.views} views
										</span>
									</div>
									{resource.format === "digital" ? (
										""
									) : (
										<div className="flex items-center gap-3 mb-3">
											<Box className="h-5 w-5 text-gray-400" />
											<span className="text-sm text-gray-700">
												{resource.stock} in Stock
											</span>
										</div>
									)}
									<div className="flex items-center gap-3">
										<Package className="h-5 w-5 text-gray-400" />
										<span className="text-sm text-gray-700">
											Condition:{" "}
											<span className="font-medium text-green-600">
												{resource.specifications.Condition}
											</span>
										</span>
									</div>
								</div>

								{/* Pricing Actions */}
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-3">
										{resource.rentPrice && (
											<div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
												<div className="flex items-center justify-between mb-3">
													<div>
														<p className="text-sm text-gray-600">
															Rent for up to {resource.rentPeriod.max} days
														</p>
														<p className="text-3xl font-bold text-gray-800">
															₹{resource.rentPrice}
														</p>
													</div>
													<DollarSign className="h-8 w-8 text-blue-500" />
												</div>
												<button
													onClick={() => handleInitiatePayment("rent")}
													className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
													Rent Now
												</button>
											</div>
										)}

										{resource.sellPrice && (
											<div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
												<div className="flex items-center justify-between mb-3">
													<div>
														<p className="text-sm text-gray-600">
															One-time purchase
														</p>
														<p className="text-3xl font-bold text-gray-800">
															₹{resource.sellPrice}
														</p>
													</div>
													<ShoppingCart className="h-8 w-8 text-green-500" />
												</div>
												<button
													onClick={() => handleInitiatePayment("buy")}
													className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
													Buy Now
												</button>
											</div>
										)}
										{showPaymentModal && (
											<PaymentModal
												showPaymentModal={showPaymentModal}
												setShowPaymentModal={setShowPaymentModal}
												transactionType={transactionType}
												paymentStep={paymentStep}
												setPaymentStep={setPaymentStep}
												selectedResource={resource}
											/>
										)}

										{/* Action Buttons */}
										<button
											onClick={handleAddToCart}
											className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300">
											Add to Cart
										</button>
									</div>

									{/* Shipping Info */}
									{resource.shippingInfo.freeShipping && (
										<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
											<div className="flex items-center gap-2 text-sm text-green-700">
												<Check className="h-4 w-4" />
												Free Shipping • {resource.shippingInfo.estimatedDays}
											</div>
										</div>
									)}
								</div>

								{/* Uploader Info Card */}
								<div className="bg-white rounded-2xl shadow-lg p-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										Uploaded by
									</h3>
									<div className="flex items-center gap-3 mb-4">
										<img
											src={resource.uploader.avatar}
											alt={resource.uploader.name}
											className="w-16 h-16 rounded-full object-cover"
										/>
										<div>
											<div className="flex items-center gap-2">
												<span className="font-semibold text-gray-800">
													{resource.uploader.name}
												</span>
												{resource.uploader.verified && (
													<ShieldCheck className="h-4 w-4 text-blue-500" />
												)}
											</div>
											<div className="flex items-center gap-1 mt-1">
												{renderStars(resource.uploader.rating)}
												<span className="text-sm text-gray-600 ml-1">
													{resource.uploader.rating}
												</span>
											</div>
										</div>
									</div>

									<div className="space-y-3 text-sm text-gray-600 mb-4">
										<div className="flex items-center justify-between">
											<span>Member since</span>
											<span className="font-medium text-gray-800">
												{resource.uploader.memberSince}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span>Total resources</span>
											<span className="font-medium text-gray-800">
												{resource.uploader.totalUploads}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span>Response time</span>
											<span className="font-medium text-gray-800">
												{resource.uploader.responseTime}
											</span>
										</div>
									</div>

									<button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
										<MessageSquare className="h-4 w-4" />
										Contact Uploader
									</button>
								</div>

								{/* Trust Signals */}
								<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										Why choose this resource?
									</h3>
									<div className="space-y-3">
										<div className="flex items-start gap-3">
											<div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
												<Check className="h-5 w-5 text-green-600" />
											</div>
											<div>
												<div className="font-medium text-gray-800">
													Quality Verified
												</div>
												<div className="text-sm text-gray-600">
													Condition verified by our team
												</div>
											</div>
										</div>
										<div className="flex items-start gap-3">
											<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
												<ShieldCheck className="h-5 w-5 text-blue-600" />
											</div>
											<div>
												<div className="font-medium text-gray-800">
													Secure Transaction
												</div>
												<div className="text-sm text-gray-600">
													Your payment is protected
												</div>
											</div>
										</div>
										<div className="flex items-start gap-3">
											<div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
												<Clock className="h-5 w-5 text-purple-600" />
											</div>
											<div>
												{resource.shippingInfo.returnPolicy !== "No return" ? (
													<div className="font-medium text-gray-800">
														Easy Returns
													</div>
												) : (
													""
												)}
												<div className="text-sm text-gray-600">
													{resource.shippingInfo.returnPolicy}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
