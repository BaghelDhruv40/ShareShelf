import React from "react";
import { Star, Clock, MapPin, Eye, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
export default function ListResourceCard({
	ResourceIcon,
	resource,
	getResourceColor,
}) {
	const formattedDate = resource.updatedAt
		? new Date(resource.updatedAt).toLocaleDateString("en-IN", {
				year: "numeric",
				month: "short",
				day: "numeric",
		  })
		: "Unknown";

	return (
		<div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
			<Link to={`/content/${resource.id}`}>
				<div className="flex items-center gap-6">
					{/* Image */}
					<div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
						<img
							src={resource.coverImageURL}
							alt={resource.title}
							className="w-full h-full object-cover"
						/>
						<div className="absolute top-2 left-2">
							<div
								className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
								style={{
									background: `linear-gradient(135deg, ${getResourceColor(
										resource.resourceType
									)
										.replace("from-", "")
										.replace(" to-", ", ")})`,
								}}>
								<ResourceIcon className="h-4 w-4" />
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1">
						<div className="flex items-start justify-between mb-3">
							<div>
								<h3 className="font-bold text-xl text-gray-800 mb-1">
									{resource.title}
								</h3>
								<p className="text-gray-600 mb-2">by {resource.author}</p>
								<div className="flex items-center gap-4 text-sm text-gray-500">
									<div className="flex items-center gap-1">
										<MapPin className="h-4 w-4" />
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
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{formattedDate}
									</div>
									<span
										className={`px-2 py-1 text-xs font-semibold rounded-full ${
											resource.status === "available"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}>
										{resource.status === "available" ? "Available" : "Rented"}
									</span>
								</div>
							</div>
							<div className="text-right">
								<div className="text-2xl font-bold text-gray-800 mb-1">
									₹{resource.rentPrice}
								</div>
								<div className="text-sm text-gray-500">
									for {resource.rentPeriod.value} days
								</div>
							</div>
						</div>

						<p className="text-gray-600 mb-4 line-clamp-2">
							{resource.shortDescription}
						</p>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-6">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(resource.rating)
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="ml-2 text-sm text-gray-600">
										{resource.rating} ({resource.reviews.length} reviews)
									</span>
								</div>
								<div className="flex items-center gap-4 text-sm text-gray-500">
									<div className="flex items-center gap-1">
										<Eye className="h-4 w-4" />
										{resource.views} views
									</div>
									<div className="flex items-center gap-1">
										<Heart className="h-4 w-4" />
										{resource.favorites} favorites
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<button className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
									<Heart className="h-5 w-5" />
								</button>
								<button className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
									<Share2 className="h-5 w-5" />
								</button>
								<button
									className="px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg"
									style={{
										background: "linear-gradient(135deg, #667eea, #764ba2)",
										boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
									}}
									disabled={resource.status !== "available"}>
									{resource.status === "available" ? "Rent Now" : "Rented"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
