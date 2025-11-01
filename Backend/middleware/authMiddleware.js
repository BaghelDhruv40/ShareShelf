import {
	createAccessToken,
	verifyAccessToken,
	verifyAndRotateRefreshToken,
} from "../utils/tokenService.js";
import User from "../models/User.js";

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
};

const authenticate = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;
		if (!accessToken) throw new Error("No access token");

		const decoded = verifyAccessToken(accessToken);
		req.user = decoded.user;
		return next();
	} catch (err) {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken)
			return res.status(403).json({ message: "Please sign in again" });

		const result = await verifyAndRotateRefreshToken(refreshToken);
		if (!result)
			return res
				.status(401)
				.json({ message: "Invalid or expired refresh token" });

		const { userId, refreshToken: newRefreshToken } = result;

		const userDoc = await User.findById(userId);
		if (!userDoc) return res.status(404).json({ message: "User not found" });

		const newAccessToken = createAccessToken(userDoc);

		res.cookie("accessToken", newAccessToken, cookieOptions);
		res.cookie("refreshToken", newRefreshToken, cookieOptions);

		req.user = userDoc;
		next();
	}
};

export default authenticate;
