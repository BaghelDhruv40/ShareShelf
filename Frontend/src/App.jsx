import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ResourceUploadForm from "./components/UploadForm/ResourceUploadForm";
import ResourceNavbar from "./components/ResourceNavbar";
import Resources from "./pages/Resources";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthForm from "./components/AuthForm/AuthForm";
import axios from "axios";
import Content from "./pages/Content";
import UserProfile from "./components/UserProfile/UserProfile";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_SERVER}/auth/user`,
					{ withCredentials: true }
				);

				setUser(res.data.user);
				setIsAuthenticated(true);
			} catch (err) {
				setUser({});
				setIsAuthenticated(false);
				console.error("Error:", err.response.data.message);
			}
			setLoading(false);
		};
		checkAuth();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-24">
				<div className="container mx-auto px-6">
					<div className="text-center py-20">
						<div
							className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
							style={{ borderColor: "#667eea" }}></div>
						<h2 className="text-2xl font-semibold text-gray-700">Loading ..</h2>
						<p className="text-gray-500 mt-2">Please wait...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Router>
			<div className="flex flex-col min-h-screen">
				<ResourceNavbar
					isAuthenticated={isAuthenticated}
					user={user}
					setUser={setUser}
					setIsAuthenticated={setIsAuthenticated}
				/>
				<main className="flex-grow mt-10">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="content/:id" element={<Content />} />
						<Route path="/profile" element={<UserProfile />} />
						<Route
							path="/add-resource"
							element={
								<ProtectedRoute isAuthenticated={isAuthenticated}>
									<ResourceUploadForm user={user} />
								</ProtectedRoute>
							}
						/>

						<Route path="/resources" element={<Resources />} />
						<Route
							path="/auth"
							element={
								<AuthForm
									setIsAuthenticated={setIsAuthenticated}
									setUser={setUser}
								/>
							}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
