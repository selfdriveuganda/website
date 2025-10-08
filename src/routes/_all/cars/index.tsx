import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import CarGrid from "@/components/allcars/CarGrid";
import CarsHeader from "@/components/allcars/CarsHeader";
import CategoryButtons from "@/components/allcars/CategoryButtons";
import ReadyToBook from "@/components/home/ReadyToBook";
import { seo } from "@/utils/seo";

const carSearchSchema = z.object({
	category: z.string().optional().catch(""),
	location: z.string().optional().catch(""),
	pickupDate: z.string().optional().catch(""),
	pickupTime: z.string().optional().catch(""),
	dropoffTime: z.string().optional().catch(""),
	dropoffDate: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_all/cars/")({
	component: RouteComponent,
	validateSearch: carSearchSchema,
	head: () => ({
		links: [
			// Preload critical background image for cars page
			{ rel: "preload", as: "image", href: "/images/bg.png" },
		],
		meta: [
			...seo({
				title: "4x4 Car Rentals | Self Drive 4x4 Uganda",
				description:
					"Browse our fleet of 4x4 vehicles and luxury cars for rent in Uganda. Land Cruisers, safari vehicles, and more. Flexible rental periods, competitive rates, and professional service.",
				keywords: [
					"4x4 rental Uganda",
					"car hire Uganda",
					"Land Cruiser rental",
					"safari vehicles",
					"self drive cars",
					"Uganda car rental",
					"4x4 hire",
				],
			}),
		],
	}),
});

function RouteComponent() {
	return (
		<div className="typography">
			<CarsHeader />
			<div className="container mx-auto px-4 py-1 sm:px-6 sm:py-10 md:mt-10 md:py-12 md:pt-16">
				<CategoryButtons />
				<CarGrid />
				<div className="pt-16">
					<ReadyToBook />
				</div>
			</div>
		</div>
	);
}
