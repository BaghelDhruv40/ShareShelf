import { useState } from "react";
import {
	Mail,
	Lock,
	User,
	Phone,
	MapPin,
	Eye,
	EyeOff,
	CheckCircle,
	XCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ setIsAuthenticated, setUser }) => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
		contactNumber: "",
		city: "",
		state: "",
		country: "",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const validateEmail = (email) => {
		const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		return emailRegex.test(email);
	};

	const validateUsername = (username) => {
		const usernameRegex = /^[a-zA-Z0-9_]+$/;
		return (
			username.length >= 3 &&
			username.length <= 30 &&
			usernameRegex.test(username)
		);
	};

	const validatePassword = (password) => {
		return password.length >= 6;
	};

	const validatePhone = (phone) => {
		const phoneRegex =
			/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
		return phoneRegex.test(phone);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (!validatePassword(formData.password)) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (isSignUp) {
			if (!formData.username) {
				newErrors.username = "Username is required";
			} else if (!validateUsername(formData.username)) {
				newErrors.username =
					"Username must be 3-30 characters (letters, numbers, underscores only)";
			}

			if (!formData.confirmPassword) {
				newErrors.confirmPassword = "Please confirm your password";
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
			}

			if (formData.contactNumber && !validatePhone(formData.contactNumber)) {
				newErrors.contactNumber = "Please enter a valid phone number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		const config = {
			withCredentials: true,
		};
		try {
			let response = await axios.post(
				`${import.meta.env.VITE_BACKEND_SERVER}/auth/${
					isSignUp ? "signup" : "signin"
				}`,
				formData,
				config
			);
			const { user } = response.data;
			setIsAuthenticated(true);
			setUser(user);

			alert(`Welcome ${user.email} !`);

			navigate("/");
		} catch (error) {
			console.error("error:", error);
		}
		setIsLoading(false);

		setFormData({
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
			contactNumber: "",
			city: "",
			state: "",
			country: "",
		});
		setErrors({});
	};

	const toggleAuthMode = () => {
		setIsSignUp(!isSignUp);
		setFormData({
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
			contactNumber: "",
			city: "",
			state: "",
			country: "",
		});
		setErrors({});
		setShowPassword(false);
		setShowConfirmPassword(false);
	};

	const inputStyles =
		"w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-gray-400";
	const errorInputStyles =
		"w-full pl-12 pr-4 py-3 border-2 border-red-400 rounded-xl bg-red-50 text-gray-800 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-200";
	const labelStyles = "block mb-2 text-sm font-semibold text-gray-700";

	return (
		<div
			className="min-h-screen p-5 flex items-center justify-center my-10"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}>
			<div
				className="w-full max-w-md p-8 rounded-3xl shadow-2xl"
				style={{
					background: "rgba(255, 255, 255, 0.95)",
					backdropFilter: "blur(20px)",
				}}>
				<div className="text-center mb-8">
					<h1
						className="text-3xl font-bold mb-2"
						style={{
							background: "linear-gradient(135deg, #667eea, #764ba2)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}>
						{isSignUp ? "Create Account" : "Welcome Back"}
					</h1>
					<p className="text-gray-600">
						{isSignUp ? "Join ShareShelf today" : "Sign in to your account"}
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className={labelStyles}>
							Email Address <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Mail
									className={`h-5 w-5 ${
										errors.email ? "text-red-400" : "text-gray-400"
									}`}
								/>
							</div>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="your@email.com"
								className={errors.email ? errorInputStyles : inputStyles}
							/>
						</div>
						{errors.email && (
							<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
								<XCircle className="h-4 w-4" />
								{errors.email}
							</p>
						)}
					</div>

					{isSignUp && (
						<div>
							<label className={labelStyles}>
								Username <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<User
										className={`h-5 w-5 ${
											errors.username ? "text-red-400" : "text-gray-400"
										}`}
									/>
								</div>
								<input
									type="text"
									name="username"
									value={formData.username}
									onChange={handleInputChange}
									placeholder="johndoe123"
									className={errors.username ? errorInputStyles : inputStyles}
								/>
							</div>
							{errors.username && (
								<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
									<XCircle className="h-4 w-4" />
									{errors.username}
								</p>
							)}
						</div>
					)}

					<div>
						<label className={labelStyles}>
							Password <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Lock
									className={`h-5 w-5 ${
										errors.password ? "text-red-400" : "text-gray-400"
									}`}
								/>
							</div>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="••••••••"
								className={errors.password ? errorInputStyles : inputStyles}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
								<XCircle className="h-4 w-4" />
								{errors.password}
							</p>
						)}
					</div>

					{isSignUp && (
						<div>
							<label className={labelStyles}>
								Confirm Password <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Lock
										className={`h-5 w-5 ${
											errors.confirmPassword ? "text-red-400" : "text-gray-400"
										}`}
									/>
								</div>
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									placeholder="••••••••"
									className={
										errors.confirmPassword ? errorInputStyles : inputStyles
									}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
									<XCircle className="h-4 w-4" />
									{errors.confirmPassword}
								</p>
							)}
							{!errors.confirmPassword &&
								formData.confirmPassword &&
								formData.password === formData.confirmPassword && (
									<p className="mt-2 text-sm text-green-600 flex items-center gap-1">
										<CheckCircle className="h-4 w-4" />
										Passwords match
									</p>
								)}
						</div>
					)}

					{isSignUp && (
						<div>
							<label className={labelStyles}>
								Contact Number{" "}
								<span className="text-gray-500 text-xs">(Optional)</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Phone
										className={`h-5 w-5 ${
											errors.contactNumber ? "text-red-400" : "text-gray-400"
										}`}
									/>
								</div>
								<input
									type="tel"
									name="contactNumber"
									value={formData.contactNumber}
									onChange={handleInputChange}
									placeholder="+91 98765 43210"
									className={
										errors.contactNumber ? errorInputStyles : inputStyles
									}
								/>
							</div>
							{errors.contactNumber && (
								<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
									<XCircle className="h-4 w-4" />
									{errors.contactNumber}
								</p>
							)}
						</div>
					)}

					{isSignUp && (
						<div>
							<label className={labelStyles}>
								Location{" "}
								<span className="text-gray-500 text-xs">(Optional)</span>
							</label>
							<div className="grid grid-cols-2 gap-3">
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<MapPin className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										name="city"
										value={formData.city}
										onChange={handleInputChange}
										placeholder="City"
										className={inputStyles}
									/>
								</div>
								<input
									type="text"
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									placeholder="State"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-gray-400"
								/>
							</div>
						</div>
					)}

					{!isSignUp && (
						<div className="text-right">
							<button
								type="button"
								className="text-sm font-medium transition-colors duration-200"
								style={{ color: "#667eea" }}
								onClick={() =>
									alert("Password reset functionality coming soon!")
								}>
								Forgot Password?
							</button>
						</div>
					)}

					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						className="w-full py-3 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						style={{
							background: "linear-gradient(135deg, #667eea, #764ba2)",
							boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
						}}>
						{isLoading ? (
							<span className="flex items-center justify-center gap-2">
								<span className="animate-spin">⏳</span>
								{isSignUp ? "Creating Account..." : "Signing In..."}
							</span>
						) : isSignUp ? (
							"🚀 Create Account"
						) : (
							"🔓 Sign In"
						)}
					</button>
				</div>

				<div className="mt-6 text-center">
					<p className="text-gray-600">
						{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
						<button
							type="button"
							onClick={toggleAuthMode}
							className="font-semibold transition-colors duration-200"
							style={{ color: "#667eea" }}>
							{isSignUp ? "Sign In" : "Sign Up"}
						</button>
					</p>
				</div>

				<div className="mt-6 flex items-center">
					<div className="flex-1 border-t border-gray-300"></div>
					<span className="px-4 text-sm text-gray-500">or continue with</span>
					<div className="flex-1 border-t border-gray-300"></div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={() => alert("Google sign-in coming soon!")}
						className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:shadow-md">
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span className="text-sm font-medium text-gray-700">Google</span>
					</button>
					<button
						type="button"
						onClick={() => alert("GitHub sign-in coming soon!")}
						className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:shadow-md">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						<span className="text-sm font-medium text-gray-700">GitHub</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
