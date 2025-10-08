import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CommonPageHero from "@/components/common/CommonPageHero";
import ReadyToBook from "@/components/home/ReadyToBook";
import GridService from "@/components/services/GridService";
import { fetchServicesQuery } from "@/hooks/servicesHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/services")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchServicesQuery);
	},
	head: () => ({
		meta: [
			...seo({
				title: "Our Services | Self Drive 4x4 Uganda",
				description:
					"Comprehensive car rental services in Uganda including 4x4 rentals, guided tours, airport transfers, and custom safari packages. Professional service for your Uganda adventure.",
				keywords: [
					"car rental services",
					"Uganda rental services",
					"4x4 rental Uganda",
					"guided tours",
					"airport transfers",
					"safari packages",
					"rental services",
				],
			}),
		],
	}),
});

function RouteComponent() {
	const { data: services } = useSuspenseQuery(fetchServicesQuery);

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<CommonPageHero
				{...{
					title: "Services",
					description:
						"We offer a range of services to meet your needs, from car rentals to guided tours. Our team is dedicated to providing you with the best experience possible.",
				}}
			/>
			<div className="container mx-auto px-4 sm:px-6 md:mt-0">
				<div className="mt-4 grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:gap-6 md:gap-8 md:pb-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-9 xl:grid-cols-2">
					{services.map((service) => (
						<GridService key={service.id} service={service} />
					))}
				</div>
			</div>
			<ReadyToBook />
		</div>
	);
}
