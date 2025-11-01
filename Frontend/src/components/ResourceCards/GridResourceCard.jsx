import { Star, Clock, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function GridResourceCard({
	ResourceIcon,
	resource,
	getResourceColor,
}) {
	return (
		<Link to={`/content/${resource._id}`}>
			<div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
				{/* Image */}
				<div className="relative h-48 overflow-hidden">
					<img
						src={resource.coverImageURL}
						alt={resource.title}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>
					<div className="absolute top-4 left-4">
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
							style={{
								background: `linear-gradient(135deg, ${getResourceColor(
									resource.resourceType
								)
									.replace("from-", "")
									.replace(" to-", ", ")})`,
							}}>
							<ResourceIcon className="h-5 w-5" />
						</div>
					</div>
					<div className="absolute top-4 right-4">
						<span
							className={`px-3 py-1 text-xs font-semibold rounded-full ${
								resource.status === "available"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}>
							{resource.status === "available" ? "Available" : "Rented"}
						</span>
					</div>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				</div>

				{/* Content */}
				<div className="p-6">
					<div className="mb-3">
						<h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
							{resource.title}
						</h3>
						<p className="text-sm text-gray-600 mb-1">by {resource.author}</p>
						<div className="flex items-center gap-2">
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
									{resource.rating} ({resource.reviews.length})
								</span>
							</div>
						</div>
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mb-4">
						{resource.tags.slice(0, 2).map((tag, index) => (
							<span
								key={index}
								className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
								{tag}
							</span>
						))}
						{resource.tags.length > 2 && (
							<span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-md">
								+{resource.tags.length - 2}
							</span>
						)}
					</div>

					{/* Stats */}
					<div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
						<div className="flex items-center gap-1">
							<Eye className="h-3 w-3" />
							{resource.views}
						</div>
						<div className="flex items-center gap-1">
							<Heart className="h-3 w-3" />
							{resource.favorites}
						</div>
						<div className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{resource.rentPeriod.value}d
						</div>
					</div>

					{/* Price and Actions */}
					<div className="flex items-center justify-between">
						<div>
							<div className="text-lg font-bold text-gray-800">
								₹{resource.rentPrice}
								<span className="text-sm font-normal text-gray-500">/rent</span>
							</div>
							{resource.sellPrice && (
								<div className="text-sm text-gray-600">
									₹{resource.sellPrice} to buy
								</div>
							)}
						</div>
						<button
							className="px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
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
		</Link>
	);
}
