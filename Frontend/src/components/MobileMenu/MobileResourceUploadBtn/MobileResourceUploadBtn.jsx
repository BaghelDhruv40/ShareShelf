import React from "react";
import { Upload } from "lucide-react";
export default function MobileResourceUploadBtn({ setIsMobileMenuOpen }) {
	return (
		<>
			<button
				onClick={() => {
					console.log("Navigate to Upload Resource form");
					alert("Redirecting to Upload Resource form...");
					setIsMobileMenuOpen(false);
				}}
				className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg mb-4 transition-all duration-300"
				style={{
					background: "linear-gradient(135deg, #10b981, #059669)",
					boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
				}}>
				<Upload className="h-5 w-5" />
				Add Resource
			</button>
		</>
	);
}
