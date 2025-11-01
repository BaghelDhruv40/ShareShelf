import React, { useState, useEffect, useRef } from "react";
import {
	Search,
	Filter,
	X,
	ChevronDown,
	MapPin,
	Calendar,
	DollarSign,
} from "lucide-react";

const ResourceSearchBar = ({ className = "", compact = false }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filters, setFilters] = useState({
		resourceType: "",
		format: "",
		priceRange: { min: "", max: "" },
		location: "",
		yearRange: { min: "", max: "" },
		availability: "",
		academicLevel: "",
		subject: "",
	});

	const searchRef = useRef(null);
	const filtersRef = useRef(null);

	// Mock data for suggestions and search results
	const mockResources = [
		{
			id: 1,
			title: "Advanced Calculus Textbook",
			type: "book",
			author: "James Stewart",
			format: "physical",
			price: 500,
			year: 2020,
		},
		{
			id: 2,
			title: "Machine Learning Notes",
			type: "notes",
			subject: "Computer Science",
			format: "digital",
			price: 100,
			year: 2023,
		},
		{
			id: 3,
			title: "Quantum Physics Research Paper",
			type: "research_paper",
			authors: "Dr. Smith",
			format: "digital",
			price: 0,
			year: 2024,
		},
		{
			id: 4,
			title: "MBA Thesis on Marketing",
			type: "thesis",
			university: "Harvard",
			format: "digital",
			price: 200,
			year: 2022,
		},
		{
			id: 5,
			title: "Nature Journal Issue 2024",
			type: "journal",
			format: "physical",
			price: 150,
			year: 2024,
		},
		{
			id: 6,
			title: "MATLAB Software License",
			type: "software",
			platform: "Windows",
			format: "digital",
			price: 1000,
			year: 2024,
		},
	];

	const resourceTypes = [
		{ value: "", label: "All Types" },
		{ value: "book", label: "📖 Books" },
		{ value: "notes", label: "📝 Notes" },
		{ value: "research_paper", label: "🔬 Research Papers" },
		{ value: "thesis", label: "🎓 Thesis" },
		{ value: "journal", label: "📰 Journals" },
		{ value: "software", label: "💻 Software" },
	];

	const academicLevels = [
		{ value: "", label: "All Levels" },
		{ value: "high_school", label: "High School" },
		{ value: "undergraduate", label: "Undergraduate" },
		{ value: "graduate", label: "Graduate" },
		{ value: "phd", label: "PhD" },
	];

	const subjects = [
		"Mathematics",
		"Physics",
		"Chemistry",
		"Biology",
		"Computer Science",
		"Engineering",
		"Medicine",
		"Business",
		"Economics",
		"Psychology",
		"Literature",
		"History",
		"Philosophy",
	];

	// Generate search suggestions based on query
	const getSearchSuggestions = (query) => {
		if (!query.trim()) return [];

		const suggestions = [];

		// Title suggestions
		mockResources.forEach((resource) => {
			if (resource.title.toLowerCase().includes(query.toLowerCase())) {
				suggestions.push({
					type: "title",
					text: resource.title,
					icon: "📚",
					resource: resource,
				});
			}
		});

		// Author suggestions
		mockResources.forEach((resource) => {
			if (
				resource.author &&
				resource.author.toLowerCase().includes(query.toLowerCase())
			) {
				suggestions.push({
					type: "author",
					text: `by ${resource.author}`,
					icon: "👤",
					resource: resource,
				});
			}
		});

		// Subject suggestions
		subjects.forEach((subject) => {
			if (subject.toLowerCase().includes(query.toLowerCase())) {
				suggestions.push({
					type: "subject",
					text: subject,
					icon: "📚",
					subject: subject,
				});
			}
		});

		return suggestions.slice(0, 8);
	};

	const handleSearch = (query = searchQuery) => {
		console.log("Searching for:", query);
		console.log("With filters:", filters);
		setShowSuggestions(false);

		// Here you would typically make an API call
		// For demo purposes, we'll just filter mock data
		const results = mockResources.filter((resource) => {
			const matchesQuery =
				!query ||
				resource.title.toLowerCase().includes(query.toLowerCase()) ||
				(resource.author &&
					resource.author.toLowerCase().includes(query.toLowerCase())) ||
				(resource.subject &&
					resource.subject.toLowerCase().includes(query.toLowerCase()));

			const matchesType =
				!filters.resourceType || resource.type === filters.resourceType;
			const matchesFormat =
				!filters.format || resource.format === filters.format;

			return matchesQuery && matchesType && matchesFormat;
		});

		alert(`Found ${results.length} resources matching your search!`);
	};

	const handleFilterChange = (filterName, value) => {
		setFilters((prev) => ({
			...prev,
			[filterName]: value,
		}));
	};

	const handlePriceRangeChange = (type, value) => {
		setFilters((prev) => ({
			...prev,
			priceRange: {
				...prev.priceRange,
				[type]: value,
			},
		}));
	};

	const handleYearRangeChange = (type, value) => {
		setFilters((prev) => ({
			...prev,
			yearRange: {
				...prev.yearRange,
				[type]: value,
			},
		}));
	};

	const clearFilters = () => {
		setFilters({
			resourceType: "",
			format: "",
			priceRange: { min: "", max: "" },
			location: "",
			yearRange: { min: "", max: "" },
			availability: "",
			academicLevel: "",
			subject: "",
		});
	};

	const getActiveFiltersCount = () => {
		let count = 0;
		if (filters.resourceType) count++;
		if (filters.format) count++;
		if (filters.priceRange.min || filters.priceRange.max) count++;
		if (filters.location) count++;
		if (filters.yearRange.min || filters.yearRange.max) count++;
		if (filters.availability) count++;
		if (filters.academicLevel) count++;
		if (filters.subject) count++;
		return count;
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
			if (filtersRef.current && !filtersRef.current.contains(event.target)) {
				setShowFilters(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const suggestions = getSearchSuggestions(searchQuery);

	// Compact mode for navbar integration
	if (compact) {
		return (
			<div className={`flex-1 mx-4 ${className}`}>
				<div className="relative" ref={searchRef}>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-4 w-4 text-gray-400" />
						</div>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onFocus={() => setShowSuggestions(true)}
							onKeyPress={(e) => e.key === "Enter" && handleSearch()}
							placeholder="Search resources..."
							className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 hover:border-gray-400"
						/>
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center">
							<Filter className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
							{getActiveFiltersCount() > 0 && (
								<span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
									{getActiveFiltersCount()}
								</span>
							)}
						</button>
					</div>

					{/* Compact Suggestions */}
					{showSuggestions && suggestions.length > 0 && (
						<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
							{suggestions.map((suggestion, index) => (
								<div
									key={index}
									className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
									onClick={() => {
										setSearchQuery(suggestion.text);
										handleSearch(suggestion.text);
									}}>
									<div className="flex items-center gap-2">
										<span className="text-sm">{suggestion.icon}</span>
										<div className="flex-1">
											<div className="text-sm font-medium text-gray-800">
												{suggestion.text}
											</div>
											{suggestion.resource && (
												<div className="text-xs text-gray-500">
													{suggestion.resource.type.charAt(0).toUpperCase() +
														suggestion.resource.type.slice(1).replace("_", " ")}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Compact Advanced Filters Panel */}
					{showFilters && (
						<div
							ref={filtersRef}
							className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-40 p-4 max-w-2xl max-h-[80vh] overflow-y-auto"
							style={{
								animation: "filterSlide 0.3s ease-out",
								WebkitOverflowScrolling: "touch",
								overscrollBehavior: "contain",
							}}
							onTouchMove={(e) => {
								// Prevent page scroll when scrolling inside the panel
								e.stopPropagation();
							}}
							onWheel={(e) => {
								// Prevent page scroll when using mouse wheel inside the panel
								e.stopPropagation();
							}}>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-base font-semibold text-gray-800">
									Advanced Filters
								</h3>
								<div className="flex items-center gap-3">
									<button
										onClick={clearFilters}
										className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
										Clear All
									</button>
									<button
										onClick={() => setShowFilters(false)}
										className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
										<X className="h-4 w-4 text-gray-500" />
									</button>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{/* Resource Type */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Resource Type
									</label>
									<select
										value={filters.resourceType}
										onChange={(e) =>
											handleFilterChange("resourceType", e.target.value)
										}
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
										{resourceTypes.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</select>
								</div>

								{/* Format */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Format
									</label>
									<select
										value={filters.format}
										onChange={(e) =>
											handleFilterChange("format", e.target.value)
										}
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
										<option value="">All Formats</option>
										<option value="physical">📦 Physical</option>
										<option value="digital">💾 Digital</option>
									</select>
								</div>

								{/* Academic Level */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Academic Level
									</label>
									<select
										value={filters.academicLevel}
										onChange={(e) =>
											handleFilterChange("academicLevel", e.target.value)
										}
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
										{academicLevels.map((level) => (
											<option key={level.value} value={level.value}>
												{level.label}
											</option>
										))}
									</select>
								</div>

								{/* Subject */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Subject
									</label>
									<select
										value={filters.subject}
										onChange={(e) =>
											handleFilterChange("subject", e.target.value)
										}
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
										<option value="">All Subjects</option>
										{subjects.map((subject) => (
											<option key={subject} value={subject.toLowerCase()}>
												{subject}
											</option>
										))}
									</select>
								</div>

								{/* Location */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										<MapPin className="inline h-3 w-3 mr-1" />
										Location
									</label>
									<input
										type="text"
										value={filters.location}
										onChange={(e) =>
											handleFilterChange("location", e.target.value)
										}
										placeholder="City, State"
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
									/>
								</div>

								{/* Availability */}
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										Availability
									</label>
									<select
										value={filters.availability}
										onChange={(e) =>
											handleFilterChange("availability", e.target.value)
										}
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
										<option value="">All</option>
										<option value="rent">For Rent</option>
										<option value="sell">For Sale</option>
										<option value="both">Both</option>
									</select>
								</div>
							</div>

							{/* Price Range */}
							<div className="mt-4">
								<label className="block text-xs font-medium text-gray-700 mb-2">
									<DollarSign className="inline h-3 w-3 mr-1" />
									Price Range (₹)
								</label>
								<div className="grid grid-cols-2 gap-3">
									<input
										type="number"
										value={filters.priceRange.min}
										onChange={(e) =>
											handlePriceRangeChange("min", e.target.value)
										}
										placeholder="Min price"
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
									/>
									<input
										type="number"
										value={filters.priceRange.max}
										onChange={(e) =>
											handlePriceRangeChange("max", e.target.value)
										}
										placeholder="Max price"
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
									/>
								</div>
							</div>

							{/* Year Range */}
							<div className="mt-4">
								<label className="block text-xs font-medium text-gray-700 mb-2">
									<Calendar className="inline h-3 w-3 mr-1" />
									Publication Year Range
								</label>
								<div className="grid grid-cols-2 gap-3">
									<input
										type="number"
										value={filters.yearRange.min}
										onChange={(e) =>
											handleYearRangeChange("min", e.target.value)
										}
										placeholder="From year"
										min="1900"
										max="2024"
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
									/>
									<input
										type="number"
										value={filters.yearRange.max}
										onChange={(e) =>
											handleYearRangeChange("max", e.target.value)
										}
										placeholder="To year"
										min="1900"
										max="2024"
										className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
									/>
								</div>
							</div>

							{/* Apply Filters Button */}
							<div className="mt-4 pt-3 border-t border-gray-200">
								<button
									onClick={() => {
										handleSearch();
										setShowFilters(false);
									}}
									className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
									Apply Filters & Search
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Active Filters Display - Compact Version */}
				{getActiveFiltersCount() > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{filters.resourceType && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
								{
									resourceTypes.find((t) => t.value === filters.resourceType)
										?.label
								}
								<button
									onClick={() => handleFilterChange("resourceType", "")}
									className="ml-1">
									<X className="h-2 w-2" />
								</button>
							</span>
						)}
						{filters.format && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
								{filters.format === "physical" ? "📦 Physical" : "💾 Digital"}
								<button
									onClick={() => handleFilterChange("format", "")}
									className="ml-1">
									<X className="h-2 w-2" />
								</button>
							</span>
						)}
						{(filters.priceRange.min || filters.priceRange.max) && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
								₹{filters.priceRange.min || "0"} - ₹
								{filters.priceRange.max || "∞"}
								<button
									onClick={() =>
										setFilters((prev) => ({
											...prev,
											priceRange: { min: "", max: "" },
										}))
									}
									className="ml-1">
									<X className="h-2 w-2" />
								</button>
							</span>
						)}
						{filters.academicLevel && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
								{
									academicLevels.find((l) => l.value === filters.academicLevel)
										?.label
								}
								<button
									onClick={() => handleFilterChange("academicLevel", "")}
									className="ml-1">
									<X className="h-2 w-2" />
								</button>
							</span>
						)}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={`w-full max-w-4xl mx-auto p-6 ${className}`}>
			{/* Main Search Bar */}
			<div className="relative" ref={searchRef}>
				<div className="flex gap-3">
					{/* Search Input */}
					<div className="relative flex-1">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onFocus={() => setShowSuggestions(true)}
							onKeyPress={(e) => e.key === "Enter" && handleSearch()}
							placeholder="Search for books, notes, research papers..."
							className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 hover:border-gray-400 hover:shadow-md"
						/>

						{/* Search Suggestions */}
						{showSuggestions && suggestions.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
								{suggestions.map((suggestion, index) => (
									<div
										key={index}
										className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
										onClick={() => {
											setSearchQuery(suggestion.text);
											handleSearch(suggestion.text);
										}}>
										<div className="flex items-center gap-3">
											<span className="text-lg">{suggestion.icon}</span>
											<div className="flex-1">
												<div className="font-medium text-gray-800">
													{suggestion.text}
												</div>
												{suggestion.resource && (
													<div className="text-sm text-gray-500">
														{suggestion.resource.type.charAt(0).toUpperCase() +
															suggestion.resource.type
																.slice(1)
																.replace("_", " ")}{" "}
														• {suggestion.resource.format}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Filter Button */}
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="relative px-6 py-4 bg-white border-2 border-gray-300 rounded-2xl hover:border-gray-400 hover:shadow-md transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none flex items-center gap-2">
						<Filter className="h-5 w-5 text-gray-600" />
						<span className="font-medium text-gray-700">Filters</span>
						{getActiveFiltersCount() > 0 && (
							<span className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
								{getActiveFiltersCount()}
							</span>
						)}
					</button>

					{/* Search Button */}
					<button
						onClick={() => handleSearch()}
						className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none">
						Search
					</button>
				</div>

				{/* Advanced Filters Panel */}
				{showFilters && (
					<div
						ref={filtersRef}
						className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-40 p-6"
						style={{ animation: "filterSlide 0.3s ease-out" }}>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-800">
								Advanced Filters
							</h3>
							<div className="flex items-center gap-3">
								<button
									onClick={clearFilters}
									className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
									Clear All
								</button>
								<button
									onClick={() => setShowFilters(false)}
									className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
									<X className="h-4 w-4 text-gray-500" />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{/* Resource Type */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Resource Type
								</label>
								<select
									value={filters.resourceType}
									onChange={(e) =>
										handleFilterChange("resourceType", e.target.value)
									}
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
									{resourceTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>
							</div>

							{/* Format */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Format
								</label>
								<select
									value={filters.format}
									onChange={(e) => handleFilterChange("format", e.target.value)}
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
									<option value="">All Formats</option>
									<option value="physical">📦 Physical</option>
									<option value="digital">💾 Digital</option>
								</select>
							</div>

							{/* Academic Level */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Academic Level
								</label>
								<select
									value={filters.academicLevel}
									onChange={(e) =>
										handleFilterChange("academicLevel", e.target.value)
									}
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
									{academicLevels.map((level) => (
										<option key={level.value} value={level.value}>
											{level.label}
										</option>
									))}
								</select>
							</div>

							{/* Subject */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subject
								</label>
								<select
									value={filters.subject}
									onChange={(e) =>
										handleFilterChange("subject", e.target.value)
									}
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
									<option value="">All Subjects</option>
									{subjects.map((subject) => (
										<option key={subject} value={subject.toLowerCase()}>
											{subject}
										</option>
									))}
								</select>
							</div>

							{/* Location */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<MapPin className="inline h-4 w-4 mr-1" />
									Location
								</label>
								<input
									type="text"
									value={filters.location}
									onChange={(e) =>
										handleFilterChange("location", e.target.value)
									}
									placeholder="City, State"
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
							</div>

							{/* Availability */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Availability
								</label>
								<select
									value={filters.availability}
									onChange={(e) =>
										handleFilterChange("availability", e.target.value)
									}
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
									<option value="">All</option>
									<option value="rent">For Rent</option>
									<option value="sell">For Sale</option>
									<option value="both">Both</option>
								</select>
							</div>
						</div>

						{/* Price Range */}
						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<DollarSign className="inline h-4 w-4 mr-1" />
								Price Range (₹)
							</label>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="number"
									value={filters.priceRange.min}
									onChange={(e) =>
										handlePriceRangeChange("min", e.target.value)
									}
									placeholder="Min price"
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
								<input
									type="number"
									value={filters.priceRange.max}
									onChange={(e) =>
										handlePriceRangeChange("max", e.target.value)
									}
									placeholder="Max price"
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
							</div>
						</div>

						{/* Year Range */}
						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<Calendar className="inline h-4 w-4 mr-1" />
								Publication Year Range
							</label>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="number"
									value={filters.yearRange.min}
									onChange={(e) => handleYearRangeChange("min", e.target.value)}
									placeholder="From year"
									min="1900"
									max="2024"
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
								<input
									type="number"
									value={filters.yearRange.max}
									onChange={(e) => handleYearRangeChange("max", e.target.value)}
									placeholder="To year"
									min="1900"
									max="2024"
									className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
							</div>
						</div>

						{/* Apply Filters Button */}
						<div className="mt-6 pt-4 border-t border-gray-200">
							<button
								onClick={() => {
									handleSearch();
									setShowFilters(false);
								}}
								className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0">
								Apply Filters & Search
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Active Filters Display */}
			{getActiveFiltersCount() > 0 && (
				<div className="mt-4 flex flex-wrap gap-2">
					{filters.resourceType && (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
							{
								resourceTypes.find((t) => t.value === filters.resourceType)
									?.label
							}
							<button
								onClick={() => handleFilterChange("resourceType", "")}
								className="ml-2">
								<X className="h-3 w-3" />
							</button>
						</span>
					)}
					{filters.format && (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
							{filters.format === "physical" ? "📦 Physical" : "💾 Digital"}
							<button
								onClick={() => handleFilterChange("format", "")}
								className="ml-2">
								<X className="h-3 w-3" />
							</button>
						</span>
					)}
					{(filters.priceRange.min || filters.priceRange.max) && (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
							₹{filters.priceRange.min || "0"} - ₹
							{filters.priceRange.max || "∞"}
							<button
								onClick={() =>
									setFilters((prev) => ({
										...prev,
										priceRange: { min: "", max: "" },
									}))
								}
								className="ml-2">
								<X className="h-3 w-3" />
							</button>
						</span>
					)}
				</div>
			)}

			<style jsx>{`
				@keyframes filterSlide {
					from {
						opacity: 0;
						transform: translateY(-20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
};

export default ResourceSearchBar;
