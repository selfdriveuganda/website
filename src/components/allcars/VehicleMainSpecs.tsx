import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fetchSingleCarQuery } from "@/hooks/carsHook";

type TechnicalSpec = {
	label: string;
	value: string;
	_key: string;
};

function VehicleMainSpecs() {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });
	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	if (!car?.specifications) {
		return null;
	}

	const bodySpec = car.specifications.find(
		(spec: TechnicalSpec) => spec.label.toLowerCase() === "body"
	);
	const drivetrainSpec = car.specifications.find(
		(spec: TechnicalSpec) => spec.label.toLowerCase() === "drivetrain"
	);
	const transmissionSpec = car.specifications.find(
		(spec: TechnicalSpec) => spec.label.toLowerCase() === "transmission"
	);
	const powerSpec = car.specifications.find(
		(spec: TechnicalSpec) => spec.label.toLowerCase() === "power"
	);
	const specs = [bodySpec, powerSpec, drivetrainSpec, transmissionSpec].filter(
		Boolean
	);

	return (
		<div className="mb-12 rounded-lg bg-muted p-8">
			<div className="container mx-auto">
				<h2 className="mb-6 font-bold text-2xl">Main Specifications</h2>
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
					{specs.map((spec) => (
						<div
							className="flex flex-col items-center text-center"
							key={spec?._key}
						>
							<p className="font-semibold text-lg">{spec?.label}</p>
							<p className="text-muted-foreground">{spec?.value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default VehicleMainSpecs;
