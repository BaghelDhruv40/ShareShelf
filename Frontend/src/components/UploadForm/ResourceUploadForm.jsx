import { useState, useEffect } from "react";
import resourceGeneralInfo from "../../utils/ResGenInfo";
import resourceTypes from "../../utils/ResTypes";
import resourceSpecifications from "../../utils/ResSpecs";
import axios from "axios";

const ResourceUploadForm = ({ user }) => {
	const [formData, setFormData] = useState({
		uploaderId: user._id,
		resourceType: "",
		author: "",
		title: "",
		format: "",
		license: "",
		licenseFile: [],
		rentPrice: "",
		sellPrice: "",
		rentPeriod: { min: 7, max: 14, value: 10 },
		shortDescription: "",
		description: "",
		coverImageURL: [],
		resourceImageURLs: [],
		tags: "",
		stock: 1,
	});
	const [specifications, setSpecifications] = useState({});
	const [showDropdown, setShowDropdown] = useState(false);
	const [showFormat, setShowFormat] = useState(false);
	const [showLicense, setShowLicense] = useState(false);
	const [showSpecifications, setShowSpecifications] = useState(false);
	const [showStock, setShowStock] = useState(false);
	const [freeShipping, setFreeShipping] = useState(false);
	const [estimatedDays, setEstimatedDays] = useState("3-7 days");
	const [returnPolicy, setReturnPolicy] = useState("No return");
	const [showPricing, setShowPricing] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "estimatedDays") {
			setEstimatedDays(value);
		} else if (name === "freeShipping") {
			setFreeShipping(value === "yes");
		} else if (name === "returnPolicy") {
			setReturnPolicy(value);
		} else if (name === "rentPeriod") {
			setFormData((prev) => ({
				...prev,
				[name]: { min: 7, max: 14, value },
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		const fileArray = Array.from(files);

		setFormData((prev) => ({
			...prev,
			[name]: fileArray,
		}));
	};

	const handleSpecificationChange = (e) => {
		const { name, value } = e.target;
		setSpecifications((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleResourceTypeSelect = (value) => {
		handleFormatSelect("");
		setFormData((prev) => ({ ...prev, resourceType: value }));
		setShowDropdown(false);
		setShowFormat(true);
		setShowLicense(false);
		setShowSpecifications(false);
		setShowPricing(false);
	};

	const handleFormatSelect = (value) => {
		setFormData((prev) => ({ ...prev, format: value }));
		if (value === "digital" || value === "both") {
			setShowLicense(true);
			setShowSpecifications(false);
			setShowPricing(false);
			value === "both" ? setShowStock(true) : setShowStock(false);
		} else {
			setShowLicense(false);
			setShowSpecifications(true);
			setShowPricing(true);
			setShowStock(true);
		}
	};

	const handleLicenseSelect = (value) => {
		setFormData((prev) => ({ ...prev, license: value }));
		setShowSpecifications(true);
		setShowPricing(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		if (!formData.resourceType || !formData.format) {
			alert("Please fill in all required fields");
			return;
		}

		if (formData.format === "digital" && !formData.license) {
			alert("Please select license status for digital resources");
			return;
		}

		for (const key in formData) {
			if (
				key !== "licenseFile" &&
				key !== "coverImageURL" &&
				key !== "resourceImageURLs" &&
				key !== "rentPeriod"
			) {
				formDataToSend.append(key, formData[key]);
			}
		}

		if (formData.licenseFile.length > 0) {
			formDataToSend.append("licenseFile", formData.licenseFile[0]);
		}

		if (formData.coverImageURL.length > 0) {
			formDataToSend.append("coverImageURL", formData.coverImageURL[0]);
		}

		formData.resourceImageURLs.forEach((file) => {
			formDataToSend.append("resourceImageURLs", file);
		});

		formDataToSend.append("specifications", JSON.stringify(specifications));

		const shippingPayload = {
			freeShipping,
			estimatedDays,
			returnPolicy,
		};
		formDataToSend.append("shippingInfo", JSON.stringify(shippingPayload));

		formDataToSend.append("rentPeriod", JSON.stringify(formData.rentPeriod));

		axios
			.post(
				`${import.meta.env.VITE_BACKEND_SERVER}/resources/upload-resource`,
				formDataToSend,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			)
			.then((res) => {
				console.log("Form submitted successfully:", res.data);
			})
			.catch((err) => console.error("Error:", err));
	};

	const getResourceTitle = () => {
		const titles = {
			book: "Book Details",
			notes: "Notes Details",
			research_paper: "Research Paper Details",
			thesis: "Thesis Details",
			journal: "Journal Details",
			other: "Resource Details",
		};
		return titles[formData.resourceType] || "Resource Details";
	};

	const selectedResourceType = resourceTypes.find(
		(type) => type.value === formData.resourceType
	);

	const inputStyles =
		"w-full p-4 border-2 border-gray-300 rounded-xl bg-white text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-gray-400 hover:shadow-md";

	const labelStyles = "block mb-2 text-sm font-semibold text-gray-700";

	const formGroupStyles = "mb-6";

	const animationStyle = (delay) => ({
		animation: `slideUp 0.6s ease ${delay}s both`,
		opacity: 0,
	});

	return (
		<div
			className="min-h-screen p-5 flex items-center justify-center mt-5"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}>
			<div
				className="w-full max-w-2xl p-10 rounded-3xl shadow-2xl border"
				style={{
					background: "rgba(255, 255, 255, 0.95)",
					backdropFilter: "blur(20px)",
					borderColor: "rgba(255, 255, 255, 0.2)",
					overflow: "visible",
				}}>
				{/* Header */}
				<div className="text-center mb-10">
					<h1
						className="text-4xl font-bold mb-2"
						style={{
							background: "linear-gradient(135deg, #667eea, #764ba2)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}>
						📚 Resource Upload
					</h1>
					<p className="text-gray-600 text-lg">
						Share your knowledge with the community
					</p>
				</div>

				<div className="space-y-6" style={{ overflow: "visible" }}>
					{/* Resource Type Dropdown */}
					<div
						className={formGroupStyles}
						style={
							mounted
								? {
										...animationStyle(0.3),
										overflow: "visible",
										position: "relative",
								  }
								: { overflow: "visible", position: "relative" }
						}>
						<label className={labelStyles}>
							Resource Type <span className="text-red-500">*</span>
						</label>
						<div
							className="relative"
							style={{ zIndex: showDropdown ? 1000 : 1, overflow: "visible" }}>
							<div
								className={`w-full p-4 border-2 rounded-xl bg-white cursor-pointer transition-all duration-300 flex items-center justify-between hover:shadow-md ${
									showDropdown
										? "border-blue-500 ring-4 ring-blue-200"
										: "border-gray-300 hover:border-gray-400"
								}`}
								onClick={() => setShowDropdown(!showDropdown)}>
								<span
									className={
										formData.resourceType ? "text-gray-800" : "text-gray-500"
									}>
									{selectedResourceType
										? selectedResourceType.label
										: "Select resource type..."}
								</span>
								<span
									className="transition-transform duration-300 text-gray-600"
									style={{
										transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
									}}>
									▼
								</span>
							</div>

							{showDropdown && (
								<div
									className="mt-1 bg-white border-2 border-gray-300 border-t-0 rounded-b-xl max-h-48 overflow-y-auto shadow-lg"
									style={{
										animation: "dropdownSlide 0.3s ease both",
									}}>
									{resourceTypes.map((type) => (
										<div
											key={type.value}
											className={`p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
												formData.resourceType === type.value
													? "bg-blue-500 text-white"
													: "text-gray-800"
											}`}
											onClick={() => handleResourceTypeSelect(type.value)}>
											{type.label}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Format Selection */}
					{showFormat && (
						<div className={formGroupStyles} style={animationStyle(0.4)}>
							<label className={labelStyles}>
								Resource Format <span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div
									className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
										formData.format === "physical"
											? "border-blue-500 bg-blue-50 ring-4 ring-blue-200"
											: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
									}`}
									onClick={() => handleFormatSelect("physical")}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="format"
											value="physical"
											checked={formData.format === "physical"}
											onChange={() => {}}
											className="w-4 h-4 text-blue-600"
										/>
										<span className="font-medium text-gray-800">Physical</span>
									</div>
								</div>
								<div
									className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
										formData.format === "digital"
											? "border-blue-500 bg-blue-50 ring-4 ring-blue-200"
											: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
									}`}
									onClick={() => handleFormatSelect("digital")}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="format"
											value="digital"
											checked={formData.format === "digital"}
											onChange={() => {}}
											className="w-4 h-4 text-blue-600"
										/>
										<span className="font-medium text-gray-800">Digital</span>
									</div>
								</div>
								<div
									className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
										formData.format === "both"
											? "border-blue-500 bg-blue-50 ring-4 ring-blue-200"
											: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
									}`}
									onClick={() => handleFormatSelect("both")}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="format"
											value="both"
											checked={formData.format === "both"}
											onChange={() => {}}
											className="w-4 h-4 text-blue-600"
										/>
										<span className="font-medium text-gray-800">Both</span>
									</div>
								</div>
							</div>
						</div>
					)}
					{/* Stocks */}
					{showStock && (
						<div className={formGroupStyles} style={animationStyle(0.5)}>
							<label className={labelStyles}>
								Stock <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="stock"
								onChange={handleInputChange}
								className={inputStyles}
								placeholder="How much stock available..."
							/>
						</div>
					)}

					{/* License Selection */}
					{showLicense && (
						<div className={formGroupStyles} style={animationStyle(0.5)}>
							<label className={labelStyles}>
								License Status <span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div
									className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
										formData.license === "author"
											? "border-blue-500 bg-blue-50 ring-4 ring-blue-200"
											: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
									}`}
									onClick={() => handleLicenseSelect("author")}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="license"
											value="author"
											checked={formData.license === "author"}
											onChange={() => {}}
											className="w-4 h-4 text-blue-600"
										/>
										<span className="font-medium text-gray-800">
											✍️ I'm the author
										</span>
									</div>
								</div>
								<div
									className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
										formData.license === "licensed"
											? "border-blue-500 bg-blue-50 ring-4 ring-blue-200"
											: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
									}`}
									onClick={() => handleLicenseSelect("licensed")}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="license"
											value="licensed"
											checked={formData.license === "licensed"}
											onChange={() => {}}
											className="w-4 h-4 text-blue-600"
										/>
										<span className="font-medium text-gray-800">
											📋 I have license
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
					{showLicense && formData.license === "licensed" ? (
						<div className={formGroupStyles} style={animationStyle(0.5)}>
							<label className={labelStyles}>
								Upload License <span className="text-red-500">*</span>
							</label>
							<input
								type="file"
								name="licenseFile"
								onChange={handleFileChange}
								className={inputStyles}
								multiple
							/>
						</div>
					) : (
						""
					)}

					{/* Dynamic Attributes */}
					{showSpecifications &&
						formData.resourceType &&
						resourceSpecifications[formData.resourceType] && (
							<div className={formGroupStyles} style={animationStyle(0.6)}>
								<div
									className="p-6 rounded-2xl border shadow-sm"
									style={{
										backgroundColor: "#f8fafc",
										borderColor: "#e2e8f0",
									}}>
									<div className="flex items-center gap-2 mb-6">
										<span className="text-xl">📋</span>
										<h3 className="text-lg font-semibold text-gray-800">
											{getResourceTitle()}
										</h3>
									</div>
									<div className="space-y-4">
										{resourceGeneralInfo.map((attr, index) => (
											<div
												key={attr.name}
												style={animationStyle(0.1 * (index + 1))}>
												<label className={labelStyles}>
													{attr.label}{" "}
													{attr.required && (
														<span className="text-red-500">*</span>
													)}
												</label>
												{attr.type === "select" ? (
													<select
														name={attr.name}
														value={
															formData[attr.name] || freeShipping === true
																? "yes"
																: "no"
														}
														onChange={handleInputChange}
														className={inputStyles}>
														<option value="">Select...</option>
														{attr.options.map((option) => (
															<option
																key={option}
																value={option
																	.toLowerCase()
																	.replace(/\s+/g, "_")}>
																{option}
															</option>
														))}
													</select>
												) : attr.type === "file" ? (
													<input
														type={attr.type}
														name={attr.name}
														onChange={handleFileChange}
														placeholder={attr.placeholder}
														className={inputStyles}
														multiple={attr.multiple}
													/>
												) : attr.type === "text" ? (
													<input
														type={attr.type}
														name={attr.name}
														value={
															attr.name === "estimatedDays"
																? estimatedDays
																: attr.name === "returnPolicy"
																? returnPolicy
																: formData[attr.name] || ""
														}
														onChange={handleInputChange}
														placeholder={attr.placeholder}
														className={inputStyles}
													/>
												) : (
													<textarea
														type={attr.type}
														name={attr.name}
														value={formData[attr.name] || ""}
														onChange={handleInputChange}
														placeholder={attr.placeholder}
														className={inputStyles}></textarea>
												)}
											</div>
										))}
									</div>
									<div className="mt-4 space-y-4">
										{resourceSpecifications[formData.resourceType].map(
											(attr, index) => (
												<div
													key={attr.name}
													style={animationStyle(0.1 * (index + 1))}>
													<label className={labelStyles}>
														{attr.label}{" "}
														{attr.required && (
															<span className="text-red-500">*</span>
														)}
													</label>
													{attr.type === "select" ? (
														<select
															name={attr.name}
															value={specifications[attr.name] || ""}
															onChange={handleSpecificationChange}
															className={inputStyles}>
															<option value="">Select...</option>
															{attr.options.map((option) => (
																<option
																	key={option}
																	value={option
																		.toLowerCase()
																		.replace(/\s+/g, "_")}>
																	{option}
																</option>
															))}
														</select>
													) : attr.type === "textarea" ? (
														<textarea
															name={attr.name}
															value={specifications[attr.name] || ""}
															onChange={handleSpecificationChange}
															placeholder={attr.placeholder}
															rows={4}
															className={`${inputStyles} resize-none`}
														/>
													) : (
														<input
															type={attr.type}
															name={attr.name}
															value={specifications[attr.name] || ""}
															onChange={handleSpecificationChange}
															placeholder={attr.placeholder}
															className={inputStyles}
														/>
													)}
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}

					{/* Pricing */}
					{showPricing && (
						<div className={formGroupStyles} style={animationStyle(0.7)}>
							<label className="block mb-4 text-lg font-semibold text-gray-800">
								Pricing & Availability
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<label className={labelStyles}>Rent Price (₹)</label>
									<input
										type="number"
										name="rentPrice"
										value={formData.rentPrice}
										onChange={handleInputChange}
										min="0"
										step="0.01"
										placeholder="0.00"
										className={inputStyles}
									/>
								</div>
								<div>
									<label className={labelStyles}>Sell Price (₹)</label>
									<input
										type="number"
										name="sellPrice"
										value={formData.sellPrice}
										onChange={handleInputChange}
										min="0"
										step="0.01"
										placeholder="0.00"
										className={inputStyles}
									/>
								</div>
							</div>
							<div>
								<label className={labelStyles}>
									Maximum Rent Period ({formData.rentPeriod.max} days)
								</label>
								<input
									type="number"
									name="rentPeriod"
									value={formData.rentPeriod.value}
									onChange={handleInputChange}
									min={formData.rentPeriod.min}
									max={formData.rentPeriod.max}
									placeholder="30"
									className={inputStyles}
								/>
							</div>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="button"
						onClick={(e) => handleSubmit(e)}
						className="w-full p-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 mt-8"
						style={{
							background: "linear-gradient(135deg, #667eea, #764ba2)",
							boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
						}}>
						🚀 Upload Resource
					</button>
				</div>
			</div>

			<style jsx="true">{`
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes dropdownSlide {
					from {
						opacity: 0;
						transform: translateY(-10px);
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

export default ResourceUploadForm;
