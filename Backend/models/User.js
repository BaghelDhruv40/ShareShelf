import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: false,
			unique: false,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please provide a valid email address",
			],
			index: true,
		},
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters long"],
			maxlength: [30, "Username cannot exceed 30 characters"],
			match: [
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain letters, numbers, and underscores",
			],
			index: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
			select: false, // Don't return password by default in queries
		},
		contactNumber: {
			type: String,
			trim: true,
			match: [
				/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
				"Please provide a valid contact number",
			],
		},
		avatar: {
			type: String,
			default:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		bio: {
			type: String,
			maxlength: [500, "Bio cannot exceed 500 characters"],
			trim: true,
		},
		location: {
			city: String,
			state: String,
			country: String,
			zipcode: String,
			landmark: String,
		},
		uploadedResources: [
			{
				resourceId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Resource",
					required: true,
				},
				uploadedAt: {
					type: Date,
					default: Date.now,
				},
				status: {
					type: String,
					enum: ["active", "rented", "sold", "inactive"],
					default: "active",
				},
			},
		],
		borrowedResources: [
			{
				resourceId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Resource",
					required: true,
				},
				borrowedAt: {
					type: Date,
					default: Date.now,
				},
				dueDate: {
					type: Date,
					required: true,
				},
				returnedAt: Date,
				status: {
					type: String,
					enum: ["borrowed", "returned", "overdue"],
					default: "borrowed",
				},
				rentAmount: {
					type: Number,
					required: true,
				},
			},
		],
		purchasedResources: [
			{
				resourceId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Resource",
					required: true,
				},
				purchasedAt: {
					type: Date,
					default: Date.now,
				},
				purchaseAmount: {
					type: Number,
					required: true,
				},
			},
		],
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Resource",
			},
		],
		notifications: [
			{
				type: {
					type: String,
					enum: ["rental", "message", "system", "payment", "review"],
					required: true,
				},
				message: {
					type: String,
					required: true,
				},
				read: {
					type: Boolean,
					default: false,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
				relatedResourceId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Resource",
				},
			},
		],
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		reviews: [
			{
				reviewerId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				rating: {
					type: Number,
					required: true,
					min: 1,
					max: 5,
				},
				comment: {
					type: String,
					maxlength: 500,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		accountStatus: {
			type: String,
			enum: ["active", "suspended", "deleted"],
			default: "active",
		},
		responseTime: {
			type: String,
			default: "Within 2 hours",
		},
		verificationStatus: {
			emailVerified: {
				type: Boolean,
				default: false,
			},
			phoneVerified: {
				type: Boolean,
				default: false,
			},
		},
		preferences: {
			notifications: {
				email: {
					type: Boolean,
					default: true,
				},
				push: {
					type: Boolean,
					default: true,
				},
			},
			privacy: {
				showEmail: {
					type: Boolean,
					default: false,
				},
				showPhone: {
					type: Boolean,
					default: false,
				},
			},
		},
		lastLogin: {
			type: Date,
		},
		passwordResetToken: String,
		passwordResetExpires: Date,
		emailVerificationToken: String,
		emailVerificationExpires: Date,
	},
	{
		timestamps: true, // Adds createdAt and updatedAt automatically
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for total uploaded resources count
UserSchema.virtual("totalUploads").get(function () {
	return this.uploadedResources.length;
});

// Virtual for total borrowed resources count
UserSchema.virtual("totalBorrows").get(function () {
	return this.borrowedResources.length;
});

// Virtual for total purchased resources count
UserSchema.virtual("totalPurchases").get(function () {
	return this.purchasedResources.length;
});

// Virtual for unread notifications count
UserSchema.virtual("unreadNotifications").get(function () {
	return this.notifications.filter((n) => !n.read).length;
});

UserSchema.virtual("memberSince").get(function () {
	const now = new Date();
	const created = new Date(this.createdAt);

	let years = now.getFullYear() - created.getFullYear();
	let months = now.getMonth() - created.getMonth();

	if (months < 0) {
		years -= 1;
		months += 12;
	}

	const parts = [];
	if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
	if (months > 0 || parts.length === 0)
		parts.push(`${months} month${months > 1 ? "s" : ""}`);

	return parts.join(", ");
});

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified("password")) return next();

	try {
		// Generate salt and hash password
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Pre-save middleware to check for overdue borrowed resources
UserSchema.pre("save", function (next) {
	const now = new Date();
	this.borrowedResources.forEach((borrow) => {
		if (
			borrow.status === "borrowed" &&
			borrow.dueDate < now &&
			!borrow.returnedAt
		) {
			borrow.status = "overdue";
		}
	});
	next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw new Error("Password comparison failed");
	}
};

// Method to add notification
UserSchema.methods.addNotification = function (type, message, resourceId) {
	this.notifications.unshift({
		type,
		message,
		relatedResourceId: resourceId,
		createdAt: new Date(),
	});

	// Keep only last 50 notifications
	if (this.notifications.length > 50) {
		this.notifications = this.notifications.slice(0, 50);
	}

	return this.save();
};

// Method to mark notifications as read
UserSchema.methods.markNotificationsAsRead = function (notificationIds) {
	this.notifications.forEach((notification) => {
		if (notificationIds.includes(notification._id.toString())) {
			notification.read = true;
		}
	});
	return this.save();
};

// Method to update user rating
// UserSchema.methods.updateRating = function () {
// 	if (this.reviews.length === 0) {
// 		this.rating.average = 0;
// 		this.rating.count = 0;
// 		return;
// 	}

// 	const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
// 	this.rating.average = (sum / this.reviews.length).toFixed(1);
// 	this.rating.count = this.reviews.length;
// };

// Pre-save hook to update rating before saving
// UserSchema.pre("save", function (next) {
// 	if (this.isModified("reviews")) {
// 		this.updateRating();
// 	}
// 	next();
// });

// Method to add resource to wishlist
UserSchema.methods.addToWishlist = function (resourceId) {
	if (!this.wishlist.includes(resourceId)) {
		this.wishlist.push(resourceId);
	}
	return this.save();
};

// Method to remove resource from wishlist
UserSchema.methods.removeFromWishlist = function (resourceId) {
	this.wishlist = this.wishlist.filter(
		(id) => id.toString() !== resourceId.toString()
	);
	return this.save();
};

// Static method to find users by location
// UserSchema.statics.findByLocation = function (city, state) {
// 	const query = {};
// 	if (city) query["location.city"] = new RegExp(city, "i");
// 	if (state) query["location.state"] = new RegExp(state, "i");
// 	return this.find(query);
// };

// Static method to find top-rated users
// UserSchema.statics.findTopRated = function (limit = 10) {
// 	return this.find({ accountStatus: "active" })
// 		.sort({ "rating.average": -1, "rating.count": -1 })
// 		.limit(limit)
// 		.select("username email avatar rating location");
// };

// Index for text search on username and email
UserSchema.index({ username: "text", email: "text" });

// Compound index for efficient queries
UserSchema.index({ accountStatus: 1, createdAt: -1 });
UserSchema.index({ "location.city": 1, "location.state": 1 });
// UserSchema.index({ "rating.average": -1 });

const User = mongoose.model("User", UserSchema);

export default User;
