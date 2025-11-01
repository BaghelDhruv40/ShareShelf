import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
	reviewer: String,
	comment: String,
	rating: Number,
	date: { type: Date, default: Date.now },
	verified: Boolean,
});

const resourceSchema = new mongoose.Schema(
	{
		// uploader Information

		uploader: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Resource Details
		resourceType: {
			type: String,
			required: true,
			enum: ["book", "notes", "research_paper", "thesis", "journal", "other"],
		},
		author: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		format: {
			type: String,
			required: true,
			enum: ["physical", "digital", "both"],
		},
		license: {
			type: String,
			enum: ["author", "licensed"],
			required: function () {
				return this.format === "digital" || this.format === "both";
			},
		},
		licenseFile: {
			type: [String],
			required: function () {
				return this.license === "licensed";
			},
			select: false,
		},
		description: {
			type: String,
			required: false,
		},
		shortDescription: {
			type: String,
			required: true,
		},
		coverImageURL: {
			type: [String],
			required: false,
		},
		resourceImageURLs: {
			type: [String],
			default: [],
		},
		tags: {
			type: [String],
			default: [],
		},
		specifications: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
		stock: {
			type: Number,
			required: function () {
				return this.format === "physical" || this.format === "both";
			},
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
		},
		reviews: [reviewSchema],

		// Pricing
		rentPrice: {
			type: Number,
			min: 0,
			default: 0,
		},
		sellPrice: {
			type: Number,
			min: 0,
			default: 0,
		},
		rentPeriod: {
			min: { type: Number, default: 7 },
			max: { type: Number, default: 90 },
			value: { type: Number, default: 30 },
		},

		shippingInfo: {
			freeShipping: {
				type: Boolean,
				default: false,
			},
			estimatedDays: {
				type: String,
				default: "3-5 days",
			},
			returnPolicy: {
				type: String,
				default: "7 days return policy",
			},
		},

		// Availability Status
		status: {
			type: String,
			enum: ["available", "rented", "sold", "unavailable"],
			default: "available",
		},

		currentUser: {
			email: {
				type: String,
				trim: true,
				lowercase: true,
			},
			contact: {
				type: String,
				trim: true,
			},
			name: {
				type: String,
				trim: true,
			},
			type: {
				type: String,
				enum: ["renter", "buyer"],
			},
			since: {
				type: Date,
			},
			dueDate: {
				type: Date,
			},
		},

		// Metadata
		isActive: {
			type: Boolean,
			default: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		inquiries: {
			type: Number,
			default: 0,
		},
		favorites: {
			type: Number,
			default: 0,
		},
		relatedResources: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
		],
	},
	{
		timestamps: true,
	}
);

// Indexes for better query performance
resourceSchema.index({ status: 1, resourceType: 1 });

resourceSchema.index({ "currentUser.email": 1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ resourceType: 1, rating: -1 });

// Pre-save middleware for validation
resourceSchema.pre("save", function (next) {
	if (this.rentPrice === 0 && this.sellPrice === 0) {
		const error = new Error(
			"Either rent charge or sell charge must be greater than 0"
		);
		return next(error);
	}

	// Clear currentUser if status is available
	if (this.status === "available") {
		this.currentUser = undefined;
	}

	// Set due date for rentals
	if (
		this.currentUser &&
		this.currentUser.type === "renter" &&
		this.currentUser.since
	) {
		this.currentUser.dueDate = new Date(
			this.currentUser.since.getTime() + this.rentPeriod * 24 * 60 * 60 * 1000
		);
	}

	next();
});

resourceSchema.statics.findAvailable = function (resourceType = null) {
	const query = { status: "available", isActive: true };
	if (resourceType) query.resourceType = resourceType;
	return this.find(query);
};

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
