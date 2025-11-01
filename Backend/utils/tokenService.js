import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
import RefreshToken from "../models/RefreshToken.js";

export function createAccessToken(user) {
	const payload = {
		user,
	};

	return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export async function createRotatingRefreshToken(userId) {
	try {
		const token = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
			expiresIn: "7d",
		});
		const decoded = jwt.decode(token);
		const expiresAt = new Date(decoded.exp * 1000);
		await RefreshToken.create({
			userId,
			token,
			expiresAt,
		});
		return token;
	} catch (err) {
		throw new Error("Error occurred while creating refresh token");
	}
}

export function verifyAccessToken(token) {
	return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export async function verifyAndRotateRefreshToken(oldToken) {
	try {
		const decoded = jwt.verify(oldToken, REFRESH_TOKEN_SECRET);

		// Check if token exists in DB
		const stored = await RefreshToken.findOne({ token: oldToken });
		if (!stored) return null;

		// Delete old token
		await RefreshToken.deleteOne({ token: oldToken });

		// Issue new refresh token
		const newToken = await createRotatingRefreshToken(decoded.userId);

		return decoded.userId
			? { userId: decoded.userId, refreshToken: newToken }
			: null;
	} catch (err) {
		return null;
	}
}
