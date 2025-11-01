import express from "express";
import {
	signup,
	signin,
	signout,
	updateUser,
} from "../controllers/authController.js";
import authenticate from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/update-user", upload.single("avatar"), updateUser);
router.get("/user", authenticate, (req, res) => {
	res.json({ message: "Authenticated successfully", user: req.user });
});
export default router;
