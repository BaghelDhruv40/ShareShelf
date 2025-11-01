export default function ResourcesHeader() {
	return (
		<div className="mb-8">
			<h1
				className="text-4xl font-bold mb-4"
				style={{
					background: "linear-gradient(135deg, #667eea, #764ba2)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					backgroundClip: "text",
				}}>
				Browse Resources
			</h1>
			<p className="text-xl text-gray-600">
				Discover amazing academic resources shared by students and educators
			</p>
		</div>
	);
}
