import React from "react";
import { Settings, LogOut, Bell } from "lucide-react";
export default function MobileProfileDropdown({ user }) {
	return (
		<>
			<div className="border-t border-gray-100 px-4 py-4">
				<div className="flex items-center space-x-3 mb-4">
					<img
						className="h-10 w-10 rounded-full"
						src={user.avatar}
						alt={user.name}
					/>
					<div>
						<p className="text-sm font-medium text-gray-900">{user.name}</p>
						<p className="text-xs text-gray-500">{user.email}</p>
					</div>
				</div>

				<div className="space-y-1">
					<button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200">
						<Bell className="h-4 w-4 mr-3" />
						Notifications
						{user.unreadNotifications > 0 && (
							<span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
								{user.unreadNotifications}
							</span>
						)}
					</button>

					<button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200">
						<Settings className="h-4 w-4 mr-3" />
						Settings
					</button>
					<button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
						<LogOut className="h-4 w-4 mr-3" />
						Sign out
					</button>
				</div>
			</div>
		</>
	);
}
