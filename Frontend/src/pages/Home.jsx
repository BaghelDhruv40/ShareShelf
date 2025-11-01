import { useState, useEffect } from "react";
import {
	BookOpen,
	FileText,
	GraduationCap,
	Laptop,
	Search,
	Star,
	TrendingUp,
	Users,
	Award,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const features = [
		{
			icon: BookOpen,
			title: "Books & Textbooks",
			description: "Access thousands of academic books and textbooks",
			color: "from-blue-500 to-purple-600",
		},
		{
			icon: FileText,
			title: "Notes & Summaries",
			description: "Find comprehensive notes and study summaries",
			color: "from-green-500 to-teal-600",
		},
		{
			icon: GraduationCap,
			title: "Research Papers",
			description: "Explore cutting-edge research papers and journals",
			color: "from-purple-500 to-pink-600",
		},
		{
			icon: Laptop,
			title: "Software & Tools",
			description: "Get access to academic software and learning tools",
			color: "from-orange-500 to-red-600",
		},
	];

	const stats = [
		{ label: "Resources Available", value: "10,000+", icon: BookOpen },
		{ label: "Active Users", value: "2,500+", icon: Users },
		{ label: "Universities", value: "150+", icon: Award },
		{ label: "Success Rate", value: "95%", icon: TrendingUp },
	];

	const testimonials = [
		{
			name: "Mike Chen",
			role: "PhD Researcher",
			content:
				"Amazing platform for sharing research papers and academic resources.",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			rating: 5,
		},
		{
			name: "Emily Davis",
			role: "Medical Student",
			content:
				"The note-sharing feature helped me ace my exams. Highly recommended!",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			rating: 5,
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % testimonials.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const animationStyle = (delay) => ({
		animation: `slideUp 0.8s ease ${delay}s both`,
		opacity: 0,
	});

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section
				className="relative pt-20 pb-32 overflow-hidden"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				}}>
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
				</div>

				<div className="relative container mx-auto px-6">
					<div className="text-center text-white">
						<h1
							className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight"
							style={mounted ? animationStyle(0.2) : {}}>
							Rent, Buy & Share
							<br />
							<span className="text-yellow-300">Academic Resources</span>
						</h1>
						<p
							className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed"
							style={mounted ? animationStyle(0.4) : {}}>
							Find the books, notes, and resources you need — or upload your own
							to help others learn and grow together.
						</p>

						<div
							className="flex flex-col sm:flex-row gap-6 justify-center items-center"
							style={mounted ? animationStyle(0.6) : {}}>
							<Link to="/resources">
								<button className="px-10 py-4 bg-white text-purple-700 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 hover:bg-gray-50">
									<Search className="inline h-5 w-5 mr-2" />
									Explore Resources
								</button>
							</Link>
							<Link to="/add-resource">
								<button className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-purple-700 transform hover:-translate-y-2 transition-all duration-300">
									<BookOpen className="inline h-5 w-5 mr-2" />
									Share Your Resources
								</button>
							</Link>
						</div>
					</div>
				</div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
				<div className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-300/20 rounded-full animate-pulse"></div>
				<div className="absolute top-40 right-20 w-8 h-8 bg-white/15 rounded-full animate-ping"></div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							Everything You Need to Succeed
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Access a vast library of academic resources from students and
							educators worldwide
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
								style={mounted ? animationStyle(0.2 * (index + 1)) : {}}>
								<div
									className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg"
									style={{
										background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
									}}>
									<feature.icon className="h-8 w-8" />
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section
				className="py-20 text-white relative overflow-hidden"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				}}>
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<stat.icon className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
								<div className="text-4xl font-bold mb-2">{stat.value}</div>
								<div className="text-lg text-gray-200">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							What Students Say
						</h2>
						<p className="text-xl text-gray-600">
							Join thousands of satisfied students and educators
						</p>
					</div>

					<div className="relative max-w-4xl mx-auto">
						<div className="bg-gray-50 rounded-3xl p-8 md:p-12">
							<div className="text-center">
								<img
									src={testimonials[currentSlide].avatar}
									alt={testimonials[currentSlide].name}
									className="w-20 h-20 rounded-full mx-auto mb-6 shadow-lg"
								/>
								<div className="flex justify-center mb-4">
									{[...Array(testimonials[currentSlide].rating)].map((_, i) => (
										<Star
											key={i}
											className="h-6 w-6 text-yellow-400 fill-current"
										/>
									))}
								</div>
								<p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
									"{testimonials[currentSlide].content}"
								</p>
								<div className="font-bold text-gray-800 text-lg">
									{testimonials[currentSlide].name}
								</div>
								<div className="text-gray-600">
									{testimonials[currentSlide].role}
								</div>
							</div>
						</div>

						{/* Navigation */}
						<div className="flex justify-center mt-8 space-x-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										index === currentSlide
											? "bg-purple-600 scale-125"
											: "bg-gray-300 hover:bg-gray-400"
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<style jsx="true">{`
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(40px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
};

export default Home;
