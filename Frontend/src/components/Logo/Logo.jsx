import React from "react";
import { Link } from "react-router-dom";
export default function Logo() {
	return (
		<>
			<div className="flex items-center flex-shrink-0">
				<div className="flex items-center">
					<Link to="/">
						<div className="ml-3">
							<h1
								className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity duration-300"
								style={{
									background: "linear-gradient(135deg, #667eea, #764ba2)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
								}}>
								ShareShelf
							</h1>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
}
