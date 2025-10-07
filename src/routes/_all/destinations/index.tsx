import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CommonPageHero from "@/components/common/CommonPageHero";
import DestinationGrid from "@/components/destinations/DestinationGrid";
import ReadyToBook from "@/components/home/ReadyToBook";
import { fetchDestinationsWithPackageCountQuery } from "@/hooks/destinationsHook";

export const Route = createFileRoute("/_all/destinations/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchDestinationsWithPackageCountQuery);
	},
});

function RouteComponent() {
	const { data: destinations } = useSuspenseQuery(
		fetchDestinationsWithPackageCountQuery
	);
	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<CommonPageHero
				{...{
					title: "Explore our Destinations",
					description:
						"Discover our amazing destinations - our growing fleet of the latest 4x4 vehicles and luxury cars will take you to destinations that few other rental companies reach. Our fleet will help you plan the perfect trip, holiday, or last-minute getaway.",
				}}
			/>
			<div className="container mx-auto mt-8 px-4 sm:px-6">
				<div className="mt-1 grid grid-cols-1 gap-4 pb-8 sm:mt-2 sm:grid-cols-2 sm:gap-6 md:mt-8 md:gap-8 md:pb-16 lg:mt-12 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
					{destinations.map((destination) => (
						<DestinationGrid destination={destination} key={destination._id} />
					))}
				</div>
			</div>
			<div className="pt-8 sm:pt-12 md:pt-16">
				<ReadyToBook />
			</div>
		</div>
	);
}
