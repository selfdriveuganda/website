import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Footer from "@/components/common/Footer";
import NavMenu from "@/components/common/NavMenu";
import { maintenanceQuery } from "@/hooks/siteSettingsHook";

export const Route = createFileRoute("/_all")({
	component: RouteComponent,
	beforeLoad: async ({ context: { queryClient } }) => {
		const settings = await queryClient.ensureQueryData(maintenanceQuery);
		if (settings?.maintenance?.isEnabled) {
			if (process.env.NODE_ENV === "development") {
				console.log("Maintenance mode is enabled. Redirecting to /maintenance");
				return;
			}

			throw redirect({ to: "/maintenance" });
		}
	},
});

function RouteComponent() {
	return (
		<div>
			<NavMenu />
			<Outlet />
			<Footer />
		</div>
	);
}
