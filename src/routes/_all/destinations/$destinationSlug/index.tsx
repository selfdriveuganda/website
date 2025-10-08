import { type PortableTextBlock, toPlainText } from "@portabletext/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import DestinationsHero from "@/components/destinations/DestinationsHero";
import RecommendedCars from "@/components/destinations/RecommendedCars";
import WhatToDo from "@/components/destinations/WhatToDo";
import ReadyToBook from "@/components/home/ReadyToBook";
import { fetchCarsQuery } from "@/hooks/carsHook";
import { fetchSingleDestinationQuery } from "@/hooks/destinationsHook";
import { fetchPackagesByDestinationQuery } from "@/hooks/packagesHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/destinations/$destinationSlug/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		const { destinationSlug } = params;
		if (!destinationSlug) {
			throw notFound();
		}
		const destination = await queryClient.ensureQueryData(
			fetchSingleDestinationQuery(destinationSlug)
		);

		await queryClient.ensureQueryData(
			fetchPackagesByDestinationQuery(destinationSlug)
		);

		// Prefetch cars for recommendations
		await queryClient.ensureQueryData(fetchCarsQuery);

		if (!destination) {
			throw notFound();
		}

		return { destination };
	},
	head: ({ loaderData }) => {
		const destination = loaderData?.destination;
		const description = destination?.description
			? toPlainText(destination.description as PortableTextBlock[])
			: `Explore ${destination?.name || "this destination"} with our 4x4 vehicles.`;

		return {
			meta: [
				...seo({
					title: destination?.name
						? `${destination.name} | Uganda Destinations`
						: "Destination | Self Drive 4x4 Uganda",
					description,
					keywords: [
						destination?.name || "",
						"Uganda destination",
						"safari destination",
						"4x4 rental",
						"self drive Uganda",
					].filter(Boolean),
					image: destination?.mainImage?.url,
					type: "article",
				}),
			],
		};
	},
});

function RouteComponent() {
	const { destinationSlug } = Route.useParams();
	const { data: destination } = useSuspenseQuery(
		fetchSingleDestinationQuery(destinationSlug)
	);
	// const { data: packages } = useSuspenseQuery(
	// 	fetchPackagesByDestinationQuery(destinationSlug)
	// );

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<DestinationsHero
				{...{
					title: destination.name,
					description: destination.description
						? toPlainText(destination.description as PortableTextBlock[])
						: "Explore this beautiful destination.",
					imageUrl: destination.mainImage?.url,
				}}
			/>
			{/* <div className="container mx-auto">
				<div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:gap-6 md:gap-8 md:pb-16 lg:grid-cols-3 lg:gap-x-8">
					{packages.map((p) => (
						<GridPackage {...{ pack: p }} key={p._id} />
					))}
				</div>
			</div> */}
			<WhatToDo {...{ destination }} />
			<RecommendedCars />
			<div className="pt-8 sm:pt-12 md:pt-16">
				<ReadyToBook />
			</div>
		</div>
	);
}
