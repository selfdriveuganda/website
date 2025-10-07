import type { SanityDocument } from "@sanity/client";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

type SingleGridCarProps = {
	car: CarWithSpecifications;
};

type Specification = {
	label: string;
	value: string;
};

interface CarWithSpecifications extends SanityDocument {
	specifications?: Specification[];
}

const SingleGridCar = ({ car }: SingleGridCarProps) => {
	const navigate = useNavigate();

	const seats = car.specifications?.find(
		(spec: Specification) => spec.label === "Seats"
	);
	const powerTrain = car.specifications?.find(
		(spec: Specification) => spec.label === "PowerTrain"
	);

	const handleNavigateToCar = (carSlug: string) => {
		navigate({
			to: "/cars/$carSlug",
			params: { carSlug },
		});
	};

	return (
		<Card
			className="w-full gap-5 p-5 shadow-none hover:cursor-pointer"
			onClick={() => handleNavigateToCar(car.slug)}
		>
			<CardContent className="p-0">
				<div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
					<OptimizedImage
						alt={car.images[0]?.alt || "Car image"}
						className="h-full w-full object-cover"
						height={300}
						loading="lazy"
						source={car.images[0]}
						width={400}
					/>
				</div>
			</CardContent>
			{car.specifications?.length && (
				<CardFooter className="flex-col items-start gap-2 p-0">
					<div className="">
						<h6>{car.name}</h6>
						<p className="text-muted-foreground text-xs">
							{powerTrain?.value ? powerTrain.value : "Unknown"} PowerTrain
						</p>
					</div>
					<div className="mt-5 flex w-full items-center justify-between">
						<Button className="rounded-full text-xs" disabled size="lg">
							{seats?.value ?? "Unknown"} Seats
						</Button>
						<div className="flex items-center gap-1">
							<h4>${car.price_per_day}</h4>
							<Label className="text-muted-foreground text-xs">/day</Label>
						</div>
					</div>
				</CardFooter>
			)}
		</Card>
	);
};

export default SingleGridCar;
