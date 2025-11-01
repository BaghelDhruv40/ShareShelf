import { useState, useEffect } from "react";
import {
	BookOpen,
	FileText,
	GraduationCap,
	Newspaper,
	Search,
} from "lucide-react";

import axios from "axios";
import GridResourceCard from "../components/ResourceCards/GridResourceCard";
import ListResourceCard from "../components/ResourceCards/ListResourceCard";
import ResourcesHeader from "../components/Resources/ResourcesHeader";

const Resources = () => {
	const [resources, setResources] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [viewMode, setViewMode] = useState("grid");

	useEffect(() => {
		const fetchResource = async () => {
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_BACKEND_SERVER}/resources`
				);
				setResources(data);
			} catch (err) {
				console.error("Error fetching resource:", err);
				throw err;
			}
			setLoading(false);
		};
		fetchResource();
	}, []);

	const getResourceIcon = (type) => {
		const icons = {
			book: BookOpen,
			notes: FileText,
			research_paper: GraduationCap,
			thesis: GraduationCap,
			journal: Newspaper,
		};
		return icons[type] || BookOpen;
	};

	const getResourceColor = (type) => {
		const colors = {
			book: "from-blue-500 to-purple-600",
			notes: "from-green-500 to-teal-600",
			research_paper: "from-purple-500 to-pink-600",
			thesis: "from-indigo-500 to-purple-700",
			journal: "from-orange-500 to-red-600",
		};
		return colors[type] || "from-blue-500 to-purple-600";
	};

	const filterResources = (resources) => {
		let filtered = resources;

		if (filter !== "all") {
			filtered = filtered.filter(
				(resource) => resource.resourceType === filter
			);
		}

		// Sort resources
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.uploadedAt) - new Date(a.uploadedAt);
				case "oldest":
					return new Date(a.uploadedAt) - new Date(b.uploadedAt);
				case "price-low":
					return a.rentPrice - b.rentPrice;
				case "price-high":
					return b.rentPrice - a.rentPrice;
				case "rating":
					return b.rating - a.rating;
				case "popular":
					return b.views - a.views;
				default:
					return 0;
			}
		});

		return filtered;
	};

	const filteredResources = filterResources(resources);

	const filterButtons = [
		{ key: "all", label: "All Resources", count: resources.length },
		{
			key: "book",
			label: "Books",
			count: resources.filter((r) => r.resourceType === "book").length,
		},
		{
			key: "notes",
			label: "Notes",
			count: resources.filter((r) => r.resourceType === "notes").length,
		},
		{
			key: "research_paper",
			label: "Research Papers",
			count: resources.filter((r) => r.resourceType === "research_paper")
				.length,
		},
		{
			key: "thesis",
			label: "Thesis",
			count: resources.filter((r) => r.resourceType === "thesis").length,
		},
		{
			key: "journal",
			label: "Journals",
			count: resources.filter((r) => r.resourceType === "journal").length,
		},
	];

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
		<div id="resources-section" className="min-h-screen bg-gray-50 ">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<ResourcesHeader />

				{/* Filters */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
					<div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
						{/* Category Filters */}
						<div className="flex flex-wrap gap-3">
							{filterButtons.map((btn) => (
								<button
									key={btn.key}
									onClick={() => setFilter(btn.key)}
									className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
										filter === btn.key
											? "text-white shadow-lg"
											: "text-gray-700 bg-gray-100 hover:bg-gray-200"
									}`}
									style={
										filter === btn.key
											? {
													background:
														"linear-gradient(135deg, #667eea, #764ba2)",
													boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
											  }
											: {}
									}>
									{btn.label}
									<span
										className={`px-2 py-0.5 text-xs rounded-full ${
											filter === btn.key ? "bg-white/20" : "bg-gray-300"
										}`}>
										{btn.count}
									</span>
								</button>
							))}
						</div>

						{/* Sort and View Controls */}
						<div className="flex gap-4 items-center">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
								<option value="newest">Newest First</option>
								<option value="oldest">Oldest First</option>
								<option value="price-low">Price: Low to High</option>
								<option value="price-high">Price: High to Low</option>
								<option value="rating">Highest Rated</option>
								<option value="popular">Most Popular</option>
							</select>

							<div className="flex border border-gray-300 rounded-xl overflow-hidden">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-2 ${
										viewMode === "grid"
											? "bg-blue-500 text-white"
											: "bg-white text-gray-600"
									}`}>
									<div className="grid grid-cols-2 gap-1 w-4 h-4">
										<div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
										<div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
										<div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
										<div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
									</div>
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`p-2 ${
										viewMode === "list"
											? "bg-blue-500 text-white"
											: "bg-white text-gray-600"
									}`}>
									<div className="space-y-1 w-4 h-4">
										<div className="bg-current h-1 rounded-sm"></div>
										<div className="bg-current h-1 rounded-sm"></div>
										<div className="bg-current h-1 rounded-sm"></div>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Resources Grid */}
				{viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredResources.map((resource) => {
							const ResourceIcon = getResourceIcon(resource.resourceType);
							return (
								<GridResourceCard
									key={resource._id}
									ResourceIcon={ResourceIcon}
									resource={resource}
									getResourceColor={getResourceColor}
								/>
							);
						})}
					</div>
				) : (
					/* List View */
					<div className="space-y-4">
						{filteredResources.map((resource) => {
							const ResourceIcon = getResourceIcon(resource.resourceType);
							return (
								<ListResourceCard
									key={resource._id}
									ResourceIcon={ResourceIcon}
									resource={resource}
									getResourceColor={getResourceColor}
								/>
							);
						})}
					</div>
				)}

				{/* Empty State */}
				{filteredResources.length === 0 && (
					<div className="text-center py-20">
						<div
							className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
							style={{
								background: "linear-gradient(135deg, #667eea, #764ba2)",
							}}>
							<Search className="h-10 w-10 text-white" />
						</div>
						<h2 className="text-2xl font-semibold text-gray-700 mb-2">
							No resources found
						</h2>
						<p className="text-gray-500 mb-8">
							Try adjusting your filters or search for different resources
						</p>
						<button
							onClick={() => setFilter("all")}
							className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg"
							style={{
								background: "linear-gradient(135deg, #667eea, #764ba2)",
								boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
							}}>
							Show All Resources
						</button>
					</div>
				)}

				{/* Load More Button */}
				{filteredResources.length > 0 && (
					<div className="text-center mt-12">
						<button
							className="px-8 py-3 bg-white border-2 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg"
							style={{ borderColor: "#667eea" }}>
							Load More Resources
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
export default Resources;
