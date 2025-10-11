import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fetchSingleCarQuery } from "@/hooks/carsHook";
import { OptimizedImage } from "../ui/OptimizedImage";
import { CarBookForm } from "./CarBookForm";

const SingleCarHero2 = () => {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });
	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	if (!car) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-6 py-8 md:gap-8 md:py-12 lg:flex-row lg:gap-16 lg:py-16">
				{/* Car Image - Full width on mobile, 60% on desktop */}
				<div className="w-full lg:w-3/5">
					<OptimizedImage
						alt={car.images?.[0]?.alt || `${car.name} - 4x4 vehicle`}
						className="h-[300px] w-full rounded-2xl object-cover object-center sm:h-[400px] md:h-[500px] lg:h-[600px]"
						height={600}
						source={car.images[0]}
						width={800}
					/>
				</div>

				{/* Booking Form - Full width on mobile, 40% on desktop */}
				<div className="w-full lg:w-2/5">
					<CarBookForm {...{ car }} />
				</div>
			</div>
		</div>
	);
};

export default SingleCarHero2;
