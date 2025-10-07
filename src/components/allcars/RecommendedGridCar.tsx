import type { SanityDocument } from "@sanity/client";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

type RecommendedGridCarProps = {
	car: SanityDocument;
};

type Specification = {
	label: string;
	value: string;
};

function RecommendedGridCar({ car }: RecommendedGridCarProps) {
	const _navigate = useNavigate();

	const seats = (car.specifications as Specification[] | undefined)?.find(
		(spec) => spec.label === "Seats"
	);
	const powerTrain = (car.specifications as Specification[] | undefined)?.find(
		(spec) => spec.label === "PowerTrain"
	);

	return (
		<Card className="w-full gap-5 border-0 shadow-none hover:cursor-pointer md:border-1 md:p-5">
			<CardContent className="p-0">
				<OptimizedImage
					alt={car.images[0]?.alt || "Car image"}
					className="max-h-[214px] min-h-[214px] w-full rounded-md object-cover"
					source={car.images[0]}
				/>
			</CardContent>
			{car.specifications?.length && (
				<CardFooter className="flex-col items-start gap-2 p-0">
					<div className="">
						<h6>{car.name}</h6>
						<p className="text-muted-foreground text-xs">
							{powerTrain?.value ? powerTrain.value : "Unknown"} PowerTrain
						</p>
						<p className="text-muted-foreground text-xs">
							{seats?.value ?? "Unknown"} Seats
						</p>
					</div>
					<div className="mt-1 flex w-full items-center justify-between">
						<div className="rounded-full font-semibold text-xs">
							Daily Rate (Self Drive)
						</div>
						<div className="flex items-center gap-1">
							<h5>${car.price_per_day}</h5>
							<Label className="text-muted-foreground text-xs">/day</Label>
						</div>
					</div>
					<div className="mt-1 flex w-full items-center justify-between">
						<div className="rounded-full font-semibold text-xs">
							Daily Rate with Driver
						</div>
						<div className="flex items-center gap-1">
							<h5>${car.price_per_day_with_driver}</h5>
							<Label className="text-muted-foreground text-xs">/day</Label>
						</div>
					</div>
					<div className="mt-5 w-full">
						<Button className="w-full" size="lg">
							Rent this Car
						</Button>
					</div>
				</CardFooter>
			)}
		</Card>
	);
}

export default RecommendedGridCar;
