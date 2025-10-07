import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { fetchCarsByCategoryQuery } from "@/hooks/carsHook";
import SingleGridCar from "./SingleGridCar";

const CarGrid = () => {
	const { category } = useSearch({ from: "/_all/cars/" });
	const { data: allCars } = useSuspenseQuery(
		fetchCarsByCategoryQuery(category!)
	);

	return (
		<div className="mt-12">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{allCars.map((car, index) => (
					<SingleGridCar key={index} {...{ car }} />
				))}
			</div>
		</div>
	);
};

export default CarGrid;
