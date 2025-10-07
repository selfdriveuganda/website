import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CommonPageHero from "@/components/common/CommonPageHero";
import ReadyToBook from "@/components/home/ReadyToBook";
import GridPackage from "@/components/packages/GridPackage";
import { fetchAllPackagesQuery } from "@/hooks/packagesHook";

export const Route = createFileRoute("/_all/packages/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchAllPackagesQuery);
	},
});

function RouteComponent() {
	const { data: packages } = useSuspenseQuery(fetchAllPackagesQuery);

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<CommonPageHero
				{...{
					title: "Ready Safari Packages ",
					description:
						"Explore our curated safari packages designed to offer you the best experiences in Uganda. From wildlife adventures to cultural immersions, find the perfect package for your next journey.",
					imageUrl:
						"https://images.unsplash.com/photo-1663668112782-ac5599d3b018?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				}}
			/>
			<div className="container mx-auto mt-6">
				<div className="grid grid-cols-1 pb-8 sm:grid-cols-2 md:gap-8 md:pb-16 lg:grid-cols-3 lg:gap-x-8">
					{packages.map((p) => (
						<GridPackage {...{ pack: p }} key={p._id} />
					))}
				</div>
			</div>
			<div>
				<ReadyToBook />
			</div>
		</div>
	);
}
