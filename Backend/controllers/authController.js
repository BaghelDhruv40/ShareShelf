import User from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

import {
	createAccessToken,
	createRotatingRefreshToken,
} from "../utils/tokenService.js";

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
};

const signup = async (req, res) => {
	const { username, email, password, city, state, country, contactNumber } =
		req.body;

	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}

		user = await User.create({
			username,
			email,
			password,
			city,
			country,
			state,
			contactNumber,
		});

		user = user.toObject();
		delete user.__v;

		const accessToken = createAccessToken(user);
		const refreshToken = await createRotatingRefreshToken(user._id);
		res.cookie("refreshToken", refreshToken, cookieOptions);
		res.cookie("accessToken", accessToken, cookieOptions);
		res.status(201).json({
			message: "Signed up successfully",
			user,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		await user.comparePassword(password);
		user = user.toObject();
		delete user.password;
		delete user.__v;

		const oldRefreshToken = req.cookies.refreshToken;
		if (oldRefreshToken) {
			jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

			const accessToken = createAccessToken(user);
			res.cookie("accessToken", accessToken, cookieOptions);
			return res.status(200).json({
				message: "Session restored",
				user,
			});
		}

		const accessToken = createAccessToken(user);
		const refreshToken = await createRotatingRefreshToken(user._id);
		res.cookie("refreshToken", refreshToken, cookieOptions);
		res.cookie("accessToken", accessToken, cookieOptions);
		res.status(200).json({
			message: "Signed in successfully",
			user,
		});
	} catch (error) {
		res.status(500).send("Server error");
	}
};

const signout = async (req, res) => {
	try {
		const oldToken = req.cookies.refreshToken;
		if (!oldToken) return res.status(400).json({ message: "No token found" });

		jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);

		const stored = await RefreshToken.findOne({ token: oldToken });
		if (stored) await RefreshToken.deleteOne({ token: oldToken });

		res.clearCookie("refreshToken", cookieOptions);
		res.clearCookie("accessToken", cookieOptions);
		res.status(200).json({ message: "Logged out successfully" });
	} catch (err) {
		res.clearCookie("refreshToken", cookieOptions);
		res.clearCookie("accessToken", cookieOptions);
		res.status(200).json({ message: "Session expired, logged out" });
	}
};

const updateUser = async (req, res) => {
	try {
		const {
			email,
			password,
			username,
			name,
			contactNumber,
			bio,
			location,
			accountStatus,
			responseTime,
		} = req.body;

		let parsedLocation;
		try {
			parsedLocation =
				typeof location === "string" ? JSON.parse(location) : location;
		} catch (err) {
			return res.status(400).json({ message: "Invalid location format" });
		}

		let avatar;
		if (req.file?.path) {
			const avatarLocalPath = req.file.path;
			avatar = await uploadOnCloudinary(avatarLocalPath);
			if (!avatar)
				return res.status(500).json({ message: "Failed upload of avatar" });
		}
		if (password) {
			const salt = await bcrypt.genSalt(10);
			updateFields.password = await bcrypt.hash(password, salt);
		}

		const updateFields = {
			...(email && { email }),
			...(password && { password }),
			...(username && { username }),
			...(name && { name }),
			...(contactNumber && { contactNumber }),
			...(bio && { bio }),
			...(parsedLocation && { location: parsedLocation }),
			...(accountStatus && { accountStatus }),
			...(responseTime && { responseTime }),
			...(avatar && { avatar: avatar.url }),
		};

		await User.updateOne({ email }, { $set: updateFields });

		res.status(200).json({ message: "Updated Successfully" });
	} catch (err) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { signup, signin, signout, updateUser };
