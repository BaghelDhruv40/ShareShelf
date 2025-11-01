import express from "express";
import { upload } from "../middleware/multer.js";
import {
	resourceUploader,
	getResources,
	getResourceById,
} from "../controllers/resourcesController.js";
const router = express.Router();

router.post(
	"/upload-resource",
	upload.fields([
		{ name: "licenseFile" },
		{ name: "coverImageURL" },
		{ name: "resourceImageURLs" },
	]),
	resourceUploader
);

router.get("/", getResources);
router.get("/:id", getResourceById);

export default router;
