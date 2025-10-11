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
import { seo } from "@/utils/seo";

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

		return { car };
	},
	head: ({ loaderData }) => {
		const car = loaderData?.car;
		return {
			meta: [
				...seo({
					title: car?.name
						? `${car.name} Rental | Self Drive 4x4 Uganda`
						: "Car Rental | Self Drive 4x4 Uganda",
					description: car?.aboutCar
						? `Rent ${car.name} in Uganda. ${car.aboutCar.substring(0, 150)}...`
						: "Rent a quality 4x4 vehicle in Uganda. Competitive rates and professional service.",
					keywords: [
						car?.name || "",
						"4x4 rental Uganda",
						"car hire",
						"self drive",
						car?.category || "",
					].filter(Boolean),
					image: car?.images?.[0]?.url,
					type: "product",
				}),
			],
		};
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
		<div className="typography pt-16 sm:pt-18 md:pt-20">
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
