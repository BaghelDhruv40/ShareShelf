import React from "react";
import { X, Menu } from "lucide-react";
export default function MobileMenuBtn({
	isMobileMenuOpen,
	setIsMobileMenuOpen,
}) {
	return (
		<>
			<div className="md:hidden">
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
					{isMobileMenuOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>
		</>
	);
}
