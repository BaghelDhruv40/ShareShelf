import React, { useState } from "react";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Edit2,
	Save,
	X,
	Camera,
	Key,
	Shield,
	BookOpen,
	Package,
	Clock,
	DollarSign,
	Award,
	Calendar,
} from "lucide-react";

const UserProfile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const [showPasswordModal, setShowPasswordModal] = useState(false);

	const [userData, setUserData] = useState({
		name: "Alex Johnson",
		username: "alexj",
		email: "alex@example.com",
		phone: "+91 98765 43210",
		location: "Meerut, Uttar Pradesh",
		bio: "Passionate learner and knowledge sharer. Love reading tech books and research papers.",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		joinDate: "January 2024",
		membershipLevel: "Gold Member",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [stats] = useState({
		uploadedResources: 24,
		borrowedResources: 15,
		totalTransactions: 39,
		earnings: 12500,
		rating: 4.8,
		reviews: 45,
	});

	const [uploadedResources] = useState([
		{
			id: 1,
			title: "Advanced Calculus Textbook",
			type: "Book",
			status: "Available",
			rentals: 8,
			earnings: 4000,
		},
		{
			id: 2,
			title: "Machine Learning Notes",
			type: "Notes",
			status: "Rented",
			rentals: 12,
			earnings: 1200,
		},
		{
			id: 3,
			title: "Quantum Physics Paper",
			type: "Research Paper",
			status: "Available",
			rentals: 5,
			earnings: 500,
		},
	]);

	const [borrowedResources] = useState([
		{
			id: 1,
			title: "Data Structures & Algorithms",
			owner: "John Doe",
			dueDate: "2024-11-15",
			status: "Active",
		},
		{
			id: 2,
			title: "Organic Chemistry Notes",
			owner: "Sarah Smith",
			dueDate: "2024-11-10",
			status: "Due Soon",
		},
		{
			id: 3,
			title: "MBA Thesis Collection",
			owner: "Mike Johnson",
			dueDate: "2024-10-28",
			status: "Overdue",
		},
	]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveProfile = () => {
		console.log("Saving profile:", userData);
		alert("✅ Profile updated successfully!");
		setIsEditing(false);
	};

	const handleChangePassword = () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			alert("❌ New passwords do not match!");
			return;
		}
		console.log("Changing password");
		alert("✅ Password changed successfully!");
		setShowPasswordModal(false);
		setPasswordData({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	const handleAvatarChange = () => {
		alert("📸 Avatar upload functionality would be implemented here");
	};

	const inputStyles =
		"w-full p-3 border-2 border-gray-300 rounded-xl bg-white text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-gray-400";
	const labelStyles = "block mb-2 text-sm font-semibold text-gray-700";

	const getStatusColor = (status) => {
		switch (status) {
			case "Available":
				return "bg-green-100 text-green-800";
			case "Rented":
				return "bg-blue-100 text-blue-800";
			case "Active":
				return "bg-green-100 text-green-800";
			case "Due Soon":
				return "bg-yellow-100 text-yellow-800";
			case "Overdue":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div
			className="min-h-screen p-6 mt-5"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}>
			<div className="max-w-6xl mx-auto">
				{/* Header Card */}
				<div
					className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
					style={{
						backdropFilter: "blur(20px)",
						backgroundColor: "rgba(255, 255, 255, 0.95)",
					}}>
					<div className="flex flex-col md:flex-row items-center gap-6">
						{/* Avatar */}
						<div className="relative group">
							<img
								src={userData.avatar}
								alt={userData.name}
								className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
							/>
							<button
								onClick={handleAvatarChange}
								className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110">
								<Camera className="h-4 w-4" />
							</button>
						</div>

						{/* User Info */}
						<div className="flex-1 text-center md:text-left">
							<h1 className="text-3xl font-bold text-gray-800 mb-2">
								{userData.name}
							</h1>
							<p className="text-gray-600 mb-1">@{userData.username}</p>
							<p className="text-sm text-gray-500 mb-3">{userData.bio}</p>
							<div className="flex flex-wrap gap-3 justify-center md:justify-start">
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold">
									<Award className="h-4 w-4 mr-1" />
									{userData.membershipLevel}
								</span>
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
									<Calendar className="h-4 w-4 mr-1" />
									Joined {userData.joinDate}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col gap-3">
							{!isEditing ? (
								<button
									onClick={() => setIsEditing(true)}
									className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105">
									<Edit2 className="h-4 w-4" />
									Edit Profile
								</button>
							) : (
								<>
									<button
										onClick={handleSaveProfile}
										className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105">
										<Save className="h-4 w-4" />
										Save Changes
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300 flex items-center gap-2 shadow transform hover:scale-105">
										<X className="h-4 w-4" />
										Cancel
									</button>
								</>
							)}
							<button
								onClick={() => setShowPasswordModal(true)}
								className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-300 flex items-center gap-2">
								<Key className="h-4 w-4" />
								Change Password
							</button>
						</div>
					</div>

					{/* Stats Row */}
					<div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 pt-6 border-t border-gray-200">
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{stats.uploadedResources}
							</div>
							<div className="text-sm text-gray-600">Uploaded</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{stats.borrowedResources}
							</div>
							<div className="text-sm text-gray-600">Borrowed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{stats.totalTransactions}
							</div>
							<div className="text-sm text-gray-600">Transactions</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								₹{stats.earnings}
							</div>
							<div className="text-sm text-gray-600">Earnings</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{stats.rating}
							</div>
							<div className="text-sm text-gray-600">Rating</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{stats.reviews}
							</div>
							<div className="text-sm text-gray-600">Reviews</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div
					className="bg-white rounded-2xl shadow-lg mb-6 p-2"
					style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setActiveTab("profile")}
							className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
								activeTab === "profile"
									? "text-white shadow-lg"
									: "text-gray-700 hover:bg-gray-50"
							}`}
							style={
								activeTab === "profile"
									? { background: "linear-gradient(135deg, #667eea, #764ba2)" }
									: {}
							}>
							<User className="h-4 w-4" />
							Profile Details
						</button>
						<button
							onClick={() => setActiveTab("uploaded")}
							className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
								activeTab === "uploaded"
									? "text-white shadow-lg"
									: "text-gray-700 hover:bg-gray-50"
							}`}
							style={
								activeTab === "uploaded"
									? { background: "linear-gradient(135deg, #667eea, #764ba2)" }
									: {}
							}>
							<Package className="h-4 w-4" />
							My Resources
						</button>
						<button
							onClick={() => setActiveTab("borrowed")}
							className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
								activeTab === "borrowed"
									? "text-white shadow-lg"
									: "text-gray-700 hover:bg-gray-50"
							}`}
							style={
								activeTab === "borrowed"
									? { background: "linear-gradient(135deg, #667eea, #764ba2)" }
									: {}
							}>
							<BookOpen className="h-4 w-4" />
							Borrowed
						</button>
					</div>
				</div>

				{/* Tab Content */}
				<div
					className="bg-white rounded-3xl shadow-2xl p-8"
					style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
					{activeTab === "profile" && (
						<div className="space-y-6">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								Profile Information
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className={labelStyles}>
										Full Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="name"
										value={userData.name}
										onChange={handleInputChange}
										disabled={!isEditing}
										className={inputStyles}
									/>
								</div>

								<div>
									<label className={labelStyles}>
										Username <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="username"
										value={userData.username}
										onChange={handleInputChange}
										disabled={!isEditing}
										className={inputStyles}
									/>
								</div>

								<div>
									<label className={labelStyles}>
										Email <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="email"
											name="email"
											value={userData.email}
											onChange={handleInputChange}
											disabled={!isEditing}
											className={`${inputStyles} pl-12`}
										/>
									</div>
								</div>

								<div>
									<label className={labelStyles}>
										Phone Number <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="tel"
											name="phone"
											value={userData.phone}
											onChange={handleInputChange}
											disabled={!isEditing}
											className={`${inputStyles} pl-12`}
										/>
									</div>
								</div>

								<div className="md:col-span-2">
									<label className={labelStyles}>Location</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="text"
											name="location"
											value={userData.location}
											onChange={handleInputChange}
											disabled={!isEditing}
											className={`${inputStyles} pl-12`}
										/>
									</div>
								</div>

								<div className="md:col-span-2">
									<label className={labelStyles}>Bio</label>
									<textarea
										name="bio"
										value={userData.bio}
										onChange={handleInputChange}
										disabled={!isEditing}
										rows={4}
										className={`${inputStyles} resize-none`}
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === "uploaded" && (
						<div>
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								My Uploaded Resources
							</h2>
							<div className="space-y-4">
								{uploadedResources.map((resource) => (
									<div
										key={resource.id}
										className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-800 mb-1">
													{resource.title}
												</h3>
												<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
													<span className="flex items-center gap-1">
														<BookOpen className="h-4 w-4" />
														{resource.type}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{resource.rentals} rentals
													</span>
													<span className="flex items-center gap-1">
														<DollarSign className="h-4 w-4" />₹
														{resource.earnings} earned
													</span>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span
													className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(
														resource.status
													)}`}>
													{resource.status}
												</span>
												<button className="px-4 py-2 rounded-xl text-sm font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300">
													View Details
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === "borrowed" && (
						<div>
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								Borrowed Resources
							</h2>
							<div className="space-y-4">
								{borrowedResources.map((resource) => (
									<div
										key={resource.id}
										className="p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-800 mb-1">
													{resource.title}
												</h3>
												<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
													<span className="flex items-center gap-1">
														<User className="h-4 w-4" />
														Owner: {resource.owner}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														Due: {resource.dueDate}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span
													className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(
														resource.status
													)}`}>
													{resource.status}
												</span>
												<button className="px-4 py-2 rounded-xl text-sm font-medium text-purple-600 border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300">
													Manage
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Password Change Modal */}
			{showPasswordModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div
						className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
						style={{ animation: "slideUp 0.3s ease-out" }}>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
								<Shield className="h-6 w-6 text-blue-500" />
								Change Password
							</h2>
							<button
								onClick={() => setShowPasswordModal(false)}
								className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
								<X className="h-5 w-5 text-gray-500" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className={labelStyles}>Current Password</label>
								<input
									type="password"
									name="currentPassword"
									value={passwordData.currentPassword}
									onChange={handlePasswordChange}
									className={inputStyles}
									placeholder="Enter current password"
								/>
							</div>

							<div>
								<label className={labelStyles}>New Password</label>
								<input
									type="password"
									name="newPassword"
									value={passwordData.newPassword}
									onChange={handlePasswordChange}
									className={inputStyles}
									placeholder="Enter new password"
								/>
							</div>

							<div>
								<label className={labelStyles}>Confirm New Password</label>
								<input
									type="password"
									name="confirmPassword"
									value={passwordData.confirmPassword}
									onChange={handlePasswordChange}
									className={inputStyles}
									placeholder="Confirm new password"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									onClick={handleChangePassword}
									className="flex-1 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105">
									Update Password
								</button>
								<button
									onClick={() => setShowPasswordModal(false)}
									className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300">
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<style jsx>{`
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
			`}</style>
		</div>
	);
};

export default UserProfile;
