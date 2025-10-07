import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { fetchSingleCarQuery } from "@/hooks/carsHook";

type SanityImage = {
	_key?: string;
	asset?: { _id?: string };
	alt?: string;
};

const AboutCar = () => {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });
	const [isExpanded, setIsExpanded] = useState(false);

	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	if (!car) {
		return <div className="text-center text-red-500">Car not found</div>;
	}

	const imageLength = car.images?.length;
	const aboutText = car.about || "No description available for this car.";

	// Split text into lines for mobile truncation
	const words = aboutText.split(" ");
	const shouldTruncate = words.length > 50; // Approximate 4 lines worth of words

	return (
		<div className="container mx-auto px-4">
			<h4 className="font-bold text-lg md:text-2xl">About {car.name}</h4>

			{/* Desktop - full text always visible */}
			<p className="mt-2 hidden text-sm leading-relaxed md:block">
				{aboutText}
			</p>

			{/* Mobile - expandable text */}
			<div className="mt-2 md:hidden">
				<p
					className={`text-sm leading-relaxed ${!isExpanded && shouldTruncate ? "line-clamp-4" : ""}`}
				>
					{aboutText}
				</p>
				{shouldTruncate && (
					<Button
						className="mt-2 h-auto p-0 text-blue-600 hover:text-blue-800"
						onClick={() => setIsExpanded(!isExpanded)}
						size="sm"
						variant="ghost"
					>
						{isExpanded ? "Read Less" : "Read More"}
					</Button>
				)}
			</div>
			{/* images  */}
			<div className="my-8 grid grid-cols-1 gap-4 md:my-16 md:grid-cols-2 md:gap-8">
				{imageLength === 2 ? (
					<div className="md:col-span-2">
						<OptimizedImage
							alt={car.images[1].alt || "Car image"}
							className="h-[250px] w-full rounded-lg object-cover md:h-[450px]"
							height={450}
							source={car.images[1]}
							width={800}
						/>
					</div>
				) : (
					car.images?.slice(1, 5).map((img: SanityImage, index: number) => (
						<div key={`${img._key || img.asset?._id || index}`}>
							<OptimizedImage
								alt={img.alt || "Car image"}
								className="h-[250px] w-full rounded-lg object-cover md:h-[450px]"
								height={450}
								source={img}
								width={400}
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default AboutCar;
