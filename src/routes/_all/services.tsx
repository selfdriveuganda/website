import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CommonPageHero from "@/components/common/CommonPageHero";
import ReadyToBook from "@/components/home/ReadyToBook";
import GridService from "@/components/services/GridService";
import ServicesHero from "@/components/services/ServicesHero";
import { fetchServicesQuery } from "@/hooks/servicesHook";

export const Route = createFileRoute("/_all/services")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchServicesQuery);
	},
});

function RouteComponent() {
	const { data: services } = useSuspenseQuery(fetchServicesQuery);

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			{/* <ServicesHero /> */}
			<CommonPageHero
				{...{
					title: "Services",
					description:
						"We offer a range of services to meet your needs, from car rentals to guided tours. Our team is dedicated to providing you with the best experience possible.",
				}}
			/>
			<div className="-mt-[25vh] container mx-auto px-4 sm:px-6 md:mt-0">
				<div className="mt-4 grid grid-cols-1 gap-4 pb-8 sm:mt-8 sm:grid-cols-2 sm:gap-6 md:mt-12 md:gap-8 md:pb-16 lg:mt-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-9 xl:grid-cols-2">
					{services.map((service) => (
						<GridService key={service.id} service={service} />
					))}
				</div>
			</div>
			<ReadyToBook />
		</div>
	);
}
