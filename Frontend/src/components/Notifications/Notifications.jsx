import { Bell } from "lucide-react";
export default function Notifications({
	user,
	notifications,
	isNotificationsOpen,
	setIsNotificationsOpen,
}) {
	return (
		<>
			<div className="relative notifications-dropdown ml-2">
				<button
					onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
					className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-300">
					<Bell className="h-5 w-5" />
					{user.unreadNotifications > 0 && (
						<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
							{user.unreadNotifications}
						</span>
					)}
				</button>

				{/* Notifications Dropdown */}
				{isNotificationsOpen && (
					<div
						className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
						style={{ animation: "dropdownSlide 0.3s ease-out" }}>
						<div className="px-4 py-3 border-b border-gray-100">
							<h3 className="text-lg font-semibold text-gray-800">
								Notifications
							</h3>
						</div>
						<div className="max-h-80 overflow-y-auto">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 ${
										notification.unread ? "bg-blue-50" : ""
									}`}>
									<div className="flex items-start gap-3">
										<div
											className={`w-2 h-2 rounded-full mt-2 ${
												notification.unread ? "bg-blue-500" : "bg-gray-300"
											}`}
										/>
										<div className="flex-1">
											<p className="text-sm text-gray-800">
												{notification.message}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												{notification.time}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="px-4 py-3 bg-gray-50">
							<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
								View all notifications
							</button>
						</div>
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
