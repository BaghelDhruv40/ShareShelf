import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import resourcesRoute from "./routes/resources.js";
import paymentRoute from "./routes/payment.js";

const app = express();
connectDB();

app.use(
	cors({
		origin: "https://share-shelf-chi.vercel.app/",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/resources/", resourcesRoute);
app.use("/api/payment", paymentRoute);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
