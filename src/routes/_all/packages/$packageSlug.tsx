import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ReadyToBook from "@/components/home/ReadyToBook";
import PackageSlide from "@/components/packages/PackageSlide";
import PackageSpecifications from "@/components/packages/PackageSpecifications";
import { fetchSinglePackageQuery } from "@/hooks/packagesHook";

export const Route = createFileRoute("/_all/packages/$packageSlug")({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			fetchSinglePackageQuery(params.packageSlug)
		);
	},
});

function RouteComponent() {
	const { packageSlug } = Route.useParams();
	const { data: packageData } = useSuspenseQuery(
		fetchSinglePackageQuery(packageSlug)
	);

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<PackageSlide {...{ images: packageData?.images ?? [] }} />
			<div className="space-y-8">
				<PackageSpecifications />
				{/* <PackageRecommendedCars {...{ cars: packageData.recommendedCars }} /> */}
				{/* <TravelTips {...{ travelTips: packageData.travelTips }} /> */}
			</div>
			<ReadyToBook />
		</div>
	);
}
