import React from "react";
import ResourceSearchBar from "../ResourceSearchBar";
import MobileResourceUploadBtn from "./MobileResourceUploadBtn/MobileResourceUploadBtn";
import MobileProfileDropdown from "./MobileProfileDropdown/MobileProfileDropdown";
export default function MobileMenu({
	setIsMobileMenuOpen,
	user,
	navItems,
	isMobileMenuOpen,
}) {
	return (
		<>
			{isMobileMenuOpen && (
				<div
					className="md:hidden bg-white border-t border-gray-100"
					style={{
						animation: "mobileMenuSlide 0.3s ease-out",
						backdropFilter: "blur(20px)",
						backgroundColor: "rgba(255, 255, 255, 0.95)",
					}}>
					<div className="px-4 py-2 space-y-1">
						{/* <ResourceSearchBar compact={true} /> */}

						{/* Mobile Upload Button */}
						<MobileResourceUploadBtn
							setIsMobileMenuOpen={setIsMobileMenuOpen}
						/>

						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
									item.active
										? "text-white shadow-lg"
										: "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
								}`}
								style={
									item.active
										? {
												background: "linear-gradient(135deg, #667eea, #764ba2)",
												boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
										  }
										: {}
								}>
								<item.icon className="h-5 w-5" />
								{item.name}
							</a>
						))}
					</div>

					{/* Mobile User Section */}
					<MobileProfileDropdown user={user} />
				</div>
			)}
			<style jsx="true">{`
				@keyframes mobileMenuSlide {
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
		</>
	);
}
