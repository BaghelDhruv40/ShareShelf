import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import Logo from "./Logo/Logo";
import Notifications from "./Notifications/Notifications";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown";
import MobileMenuBtn from "./MobileMenu/MobileMenuBtn/MobileMenuBtn";
import MobileMenu from "./MobileMenu/MobileMenu";

const ResourceNavbar = ({
	isAuthenticated,
	user,
	setUser,
	setIsAuthenticated,
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest(".profile-dropdown")) {
				setIsProfileDropdownOpen(false);
			}
			if (!event.target.closest(".notifications-dropdown")) {
				setIsNotificationsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navItems = [
		{ name: "Messages", icon: MessageSquare, href: "#", active: false },
	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				isScrolled
					? "backdrop-blur-md bg-white/90 shadow-lg"
					: "bg-white/95 backdrop-blur-md"
			}`}
			style={{
				borderBottom: isScrolled
					? "1px solid rgba(255, 255, 255, 0.2)"
					: "none",
			}}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}

					<Logo />

					{/* Right Side Items */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Notifications */}
						<Notifications
							user={user}
							notifications={user.notifications}
							isNotificationsOpen={isNotificationsOpen}
							setIsNotificationsOpen={setIsNotificationsOpen}
						/>

						{/* Profile Dropdown */}
						<ProfileDropdown
							user={user}
							isProfileDropdownOpen={isProfileDropdownOpen}
							setIsProfileDropdownOpen={setIsProfileDropdownOpen}
							isAuthenticated={isAuthenticated}
							setIsAuthenticated={setIsAuthenticated}
							setUser={setUser}
						/>
					</div>

					{/* Mobile Menu Button */}
					<MobileMenuBtn
						isMobileMenuOpen={isMobileMenuOpen}
						setIsMobileMenuOpen={setIsMobileMenuOpen}
					/>
				</div>
			</div>

			{/* Mobile Menu */}
			<MobileMenu
				user={user}
				navItems={navItems}
				setIsMobileMenuOpen={setIsMobileMenuOpen}
				isMobileMenuOpen={isMobileMenuOpen}
			/>
		</nav>
	);
};

export default ResourceNavbar;
