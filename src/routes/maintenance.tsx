import { createFileRoute } from "@tanstack/react-router";
import { Clock, Construction, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useContactInfo, useMaintenanceMode } from "@/hooks/siteSettingsHook";

export const Route = createFileRoute("/maintenance")({
	component: RouteComponent,
});

function RouteComponent() {
	const { maintenance } = useMaintenanceMode();
	const { contactInfo } = useContactInfo();

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Empty className="max-w-2xl border-none">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Construction className="text-primary" />
					</EmptyMedia>
				</EmptyHeader>
				<EmptyTitle className="text-2xl md:text-3xl">
					{maintenance?.message
						? "We're Currently Under Maintenance"
						: "Site Under Maintenance"}
				</EmptyTitle>
				<EmptyDescription className="max-w-md text-base">
					{maintenance?.message ||
						"We're currently performing scheduled maintenance to improve your experience. We'll be back shortly. Thank you for your patience."}
				</EmptyDescription>
				{maintenance?.estimatedCompletion && (
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Clock className="size-4" />
						<span>
							Expected completion:{" "}
							{new Date(maintenance.estimatedCompletion).toLocaleString()}
						</span>
					</div>
				)}
				<EmptyContent>
					{contactInfo?.phone ? (
						<Button asChild size="lg">
							<a
								className="flex items-center gap-2"
								href={`tel:${contactInfo.phone}`}
							>
								<Phone className="size-5" />
								Call Us: {contactInfo.phone}
							</a>
						</Button>
					) : (
						<Button asChild size="lg">
							<a href="/contact">Contact Us</a>
						</Button>
					)}
				</EmptyContent>
			</Empty>
		</div>
	);
}
