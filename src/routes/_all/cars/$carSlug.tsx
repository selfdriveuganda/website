import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import AboutCar from "@/components/allcars/AboutCar";
import CarTechnicalSpecifications from "@/components/allcars/CarTechnicalSpecifications";
import SimilarCars from "@/components/allcars/SimilarCars";
// import SimilarCars from "@/components/allcars/SimilarCars";
import SingleCarHero from "@/components/allcars/SingleCarHero";
import SingleCarHero2 from "@/components/allcars/SingleCarHero2";
import VehicleMainSpecs from "@/components/allcars/VehicleMainSpecs";
import LoadingComponent from "@/components/common/LoadingComponent";
import ReadyToBook from "@/components/home/ReadyToBook";
import { fetchSingleCarQuery } from "@/hooks/carsHook";

export type Car = {
	name: string;
	details: string[];
	price_per_day: number;
	image: string;
	slug: string;
};

export const Route = createFileRoute("/_all/cars/$carSlug")({
	component: RouteComponent,
	loader: async ({ params, context: { queryClient } }) => {
		const carSlug = params.carSlug;
		console.log("carSlug in loader---------------->:", params);

		const car = await queryClient.ensureQueryData(fetchSingleCarQuery(carSlug));

		console.log("car in loader:", car);

		if (!car) {
			throw notFound();
		}
	},
});

function RouteComponent() {
	console.log("Rendering RouteComponent");

	return (
		<div>
			<Suspense fallback={<LoadingComponent />}>
				<DeferredComponent />
			</Suspense>
		</div>
	);
}

function DeferredComponent() {
	return (
		<div className="typography pt-20">
			{/* <SingleCarHero /> */}
			<SingleCarHero2 />
			<VehicleMainSpecs />
			<AboutCar />
			<CarTechnicalSpecifications />
			<ReadyToBook />
			<SimilarCars />
		</div>
	);
}
