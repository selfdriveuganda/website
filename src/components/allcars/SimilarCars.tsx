import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
	fetchCarsByCategoryQuery,
	fetchSingleCarQuery,
} from "@/hooks/carsHook";
import SingleGridCar from "./SingleGridCar";

function SimilarCars() {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });

	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	// Get category slug safely, with fallback (get first category if available)
	const categorySlug = car?.categories?.[0]?.slug || car?.category?.slug || "";

	const { data: allCars } = useSuspenseQuery(
		fetchCarsByCategoryQuery(categorySlug)
	);

	// Check for car data after all hooks are called
	if (!car) {
		return <div className="text-center text-red-500">Car not found</div>;
	}

	return (
		<div className="border-t py-14">
			<div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:py-12">
				<h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl">
					Explore similar cars
				</h2>
				<div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{allCars.map((carItem: SanityDocument) => (
						<SingleGridCar car={carItem} key={carItem._id} />
					))}
				</div>
			</div>
		</div>
	);
}

export default SimilarCars;
