import React from "react";
import {
	Settings,
	User,
	BookOpen,
	LogOut,
	LogIn,
	UserRound,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export default function ProfileDropdown({
	user,
	setUser,
	isProfileDropdownOpen,
	setIsProfileDropdownOpen,
	isAuthenticated,
	setIsAuthenticated,
}) {
	const navigate = useNavigate();
	const handleSignout = async () => {
		try {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_SERVER}/auth/signout`,
				{},
				{ withCredentials: true }
			);

			setIsAuthenticated(false);
			setUser({});
			navigate("/");
		} catch (error) {
			console.error("error", error);
		}
	};
	// console.log(user);
	return (
		<>
			<div className="relative profile-dropdown">
				<button
					onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
					className="flex items-center space-x-3 p-1 rounded-xl hover:bg-gray-300 ">
					{user != null ? (
						<>
							<img
								className="h-10 w-10 rounded-full"
								src={user.avatar}
								alt={user.name}
							/>
							<div className="hidden lg:block text-left">
								<p className="text-sm font-medium text-gray-900">{user.name}</p>
								<p className="text-xs text-gray-500">{user.username}</p>
							</div>
						</>
					) : (
						""
					)}
				</button>

				{/* Profile Dropdown Menu */}
				{isProfileDropdownOpen && (
					<div
						className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
						style={{ animation: "dropdownSlide 0.3s ease-out" }}>
						<div className="px-4 py-3 border-b border-gray-100">
							<p className="text-sm font-medium text-gray-900">{user.name}</p>
							<p className="text-sm text-gray-500">{user.email}</p>
						</div>

						<div className="py-2">
							<Link
								to="/profile"
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
								<User className="h-4 w-4 mr-3" />
								Profile
							</Link>
							<a
								href="#"
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
								<BookOpen className="h-4 w-4 mr-3" />
								My Resources
							</a>
							<a
								href="#"
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
								<Settings className="h-4 w-4 mr-3" />
								Settings
							</a>
						</div>

						{!isAuthenticated ? (
							<>
								<div className="border-t border-gray-100">
									<button
										className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
										onClick={() => {
											navigate("/auth");
										}}>
										<LogIn className="h-4 w-4 mr-3" />
										Sign in / Sign up
									</button>
								</div>
							</>
						) : (
							<div className="border-t border-gray-100">
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
									onClick={handleSignout}>
									<LogOut className="h-4 w-4 mr-3" />
									Sign out
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			<style jsx="true">{`
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
		</>
	);
}
