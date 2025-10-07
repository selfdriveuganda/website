import { Button } from "../ui/button";
import { OptimizedImage } from "../ui/OptimizedImage";

function ServicesHero() {
	return (
		<div className="flex h-[60dvh] flex-col overflow-y-auto md:h-[50dvh]">
			{/* Desktop Layout - Text above image */}
			<div className="hidden h-full flex-col md:flex">
				{/* Hero Text Section - Desktop */}
				<div className="flex-shrink-0 pt-10">
					<div className="mx-auto flex max-w-4xl flex-col items-center">
						<h2 className="text-center font-bold text-3xl text-gray-900 leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl xl:text-6xl">
							Our Services
						</h2>
						<p className="mx-auto mt-2 max-w-2xl text-center text-gray-600 text-sm sm:mt-3 sm:text-sm md:mt-4 md:text-sm">
							We offer a range of services to meet your needs, from car rentals
							to guided tours. Our team is dedicated to providing you with the
							best experience possible.
						</p>
						<div className="pt-8">
							<Button size={"lg"}>Book our Services</Button>
						</div>
					</div>
				</div>

				{/* Hero Image Section - Desktop */}
				<div className="relative flex-1 overflow-hidden">
					<div className="absolute inset-0 z-0 h-24 bg-gradient-to-b from-white via-white/30 to-transparent sm:h-28 md:h-32" />
					<OptimizedImage
						alt="4x4 vehicle in Uganda landscape"
						className="h-[20dvh] w-full object-cover object-center"
						height={200}
						source="https://images.pexels.com/photos/451590/pexels-photo-451590.jpeg?auto=compress&cs=tinysrgb&w=1200"
						width={800}
					/>
				</div>
			</div>

			{/* Mobile Layout - Text overlay on image */}
			<div className="relative flex h-full flex-col md:hidden">
				{/* Hero Image Section - Mobile - Half height */}
				<div className="relative h-1/2 overflow-hidden">
					{/* White gradient from top - Mobile (same as home page) */}
					<div className="absolute inset-0 z-0 h-24 bg-gradient-to-b from-white via-white/30 to-transparent sm:h-28 md:h-32" />

					<OptimizedImage
						alt="4x4 vehicle in Uganda landscape"
						className="h-full w-full object-cover object-center"
						height={400}
						source="https://images.pexels.com/photos/451590/pexels-photo-451590.jpeg?auto=compress&cs=tinysrgb&w=1200"
						width={600}
					/>

					{/* Text Overlay - Mobile */}
					<div className="absolute inset-0 z-10 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
						<div className="w-full p-4 pb-8">
							<div className="mx-auto flex max-w-4xl flex-col items-center text-center">
								<h2 className="mb-3 font-bold text-2xl text-white leading-tight sm:text-3xl">
									Our Services
								</h2>
								<p className="mx-auto max-w-md text-gray-200 text-sm">
									We offer a range of services to meet your needs, from car
									rentals to guided tours. Our team is dedicated to providing
									you with the best experience possible.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServicesHero;
