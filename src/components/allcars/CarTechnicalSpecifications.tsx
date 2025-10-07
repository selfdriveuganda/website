import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fetchSingleCarQuery } from "@/hooks/carsHook";

const CarTechnicalSpecifications = () => {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });

	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	if (!car) {
		return <div className="text-center text-red-500">Car not found</div>;
	}

	// Check if specifications exist before accessing them
	if (!(car.specifications && Array.isArray(car.specifications))) {
		return (
			<div className="text-center text-red-500">
				No technical specifications available
			</div>
		);
	}

	return (
		<div className="bg-gray-100 py-8 md:py-16">
			<div className="container mx-auto px-4">
				<h4 className="mb-6 text-center font-bold text-lg md:mb-8 md:text-start md:text-2xl">
					All Technical Specifications
				</h4>
				<div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-x-12 md:gap-y-8 lg:grid-cols-4 lg:gap-x-48">
					{car.specifications.map((spec) => (
						<div
							className={"flex flex-col items-center text-center"}
							key={spec._key}
						>
							<h6 className="font-bold text-xs uppercase md:text-lg lg:text-base">
								{spec.value}
							</h6>
							<p className="mt-1 text-muted-foreground text-xs capitalize md:text-sm">
								{spec.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CarTechnicalSpecifications;
