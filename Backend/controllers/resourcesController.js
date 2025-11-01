import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Resource from "../models/Resource.js";

const getResources = async (req, res) => {
	const data = await Resource.find().populate("uploader");
	res.json(data);
};

const getResourceById = async (req, res) => {
	try {
		const { id } = req.params;

		const data = await Resource.findById(id).populate("uploader");

		if (!data) {
			return res.status(404).json({ message: "Resource not found" });
		}
		res.json(data);
	} catch (error) {
		console.error("Error fetching resource:", error);
		res.status(500).json({ message: "Failed to fetch resource" });
	}
};

const resourceUploader = async (req, res) => {
	try {
		const {
			uploaderId,
			resourceType,
			author,
			title,
			format,
			license,
			rentPrice,
			sellPrice,
			rentPeriod,
			description,
			shortDescription,
			tags,
			specifications,
			shippingInfo,
			stock,
		} = req.body;

		const tagList = tags.split(",").map((item) => item.trim());
		let parseStock = parseInt(stock);
		const parseRentPeriod = JSON.parse(rentPeriod);
		const parsedSpecs = Array.isArray(specifications)
			? specifications.map((item) =>
					typeof item === "string" ? JSON.parse(item) : item
			  )
			: typeof specifications === "string"
			? JSON.parse(specifications)
			: specifications;

		const parsedShippingInfo =
			typeof shippingInfo === "string"
				? JSON.parse(shippingInfo)
				: shippingInfo;

		const Obj = {
			coverImageURL: [],
			resourceImageURLs: [],
			licenseFile: [],
		};

		for (const fieldName in req.files) {
			const files = req.files[fieldName];
			// console.log(`Field: ${fieldName}`);

			for (const file of files) {
				console.log(file.originalname, file.path);
				const url = await uploadOnCloudinary(file.path);
				Obj[fieldName].push(url);
			}
		}

		const resource = await Resource.create({
			uploader: uploaderId,
			resourceType,
			author,
			title,
			format,
			license,
			rentPrice,
			sellPrice,
			rentPeriod: parseRentPeriod,
			description,
			shortDescription,
			tags: tagList,
			specifications: parsedSpecs,
			shippingInfo: parsedShippingInfo,
			stock: parseStock,
			...Obj,
		});

		res.status(200).json({
			message: "Resource uploaded successfully",
			data: resource,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res
			.status(500)
			.json({ message: "Something went wrong", error: error.message });
	}
};

export { resourceUploader, getResources, getResourceById };
