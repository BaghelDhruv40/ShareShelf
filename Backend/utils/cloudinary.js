import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localPath) => {
	try {
		if (!localPath) return null;
		const response = cloudinary.uploader.upload(localPath, {
			resource_type: "auto",
		});
		console.log("file successfully uploaded on cloudinary");
		console.log(response);
		return response;
	} catch (error) {
		console.error("error:", error);
		fs.unlinkSync(localPath);
		return null;
	}
};

export { uploadOnCloudinary };
