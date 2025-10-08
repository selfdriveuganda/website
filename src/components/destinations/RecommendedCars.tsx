import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchCarsQuery } from "@/hooks/carsHook";
import SingleGridCar from "../allcars/SingleGridCar";

function RecommendedCars() {
	const { data: cars } = useSuspenseQuery(fetchCarsQuery);

	// Get first 3 available cars as recommendations
	const recommendedCars = cars
		.filter((car) => car.availability === "available")
		.slice(0, 3);

	if (recommendedCars.length === 0) {
		return null;
	}

	return (
		<div className="w-full bg-white py-12 md:py-16">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8 md:mb-12">
					<h2 className="font-bold text-2xl text-gray-900 md:text-3xl lg:text-4xl">
						Recommended Cars for Your Journey
					</h2>
					<p className="mt-2 text-gray-600 text-sm md:text-base">
						Perfect vehicles for exploring this destination
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3 lg:gap-x-8">
					{recommendedCars.map((car) => (
						<SingleGridCar car={car} key={car._id} />
					))}
				</div>
			</div>
		</div>
	);
}

export default RecommendedCars;
