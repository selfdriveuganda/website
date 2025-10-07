import type { SanityDocument } from "@sanity/client";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

function DestinationGrid({ destination }: { destination: SanityDocument }) {
	// Handle both URL object and Sanity image reference
	const imageUrl =
		typeof destination.mainImage === "string"
			? destination.mainImage
			: destination.mainImage?.url || "";

	return (
		<Link
			className="group relative block h-[350px] w-full max-w-full overflow-hidden rounded-xl sm:h-[400px] sm:max-w-[350px] md:h-[350px]"
			params={{
				destinationSlug: destination.slug.current,
			}}
			to={"/destinations/$destinationSlug"}
		>
			{/* Background Image - Layer 1 */}
			<div
				className="absolute inset-0 z-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
				style={{
					backgroundImage: `url(${imageUrl})`,
				}}
			/>

			{/* Gradient Overlay - Layer 2 */}
			<div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

			{/* Content - Layer 3 */}
			<div className="relative z-20 flex h-full flex-col justify-between">
				{/* Top Right Button */}
				<div className="flex justify-end p-4 sm:p-5 md:p-6">
					<Button
						aria-label="View details"
						className="h-[36px] w-[36px] rounded-[8px] bg-black hover:bg-gray-800 sm:h-[40px] sm:w-[40px] sm:rounded-[10px] md:h-[46px] md:w-[46px]"
						size="icon"
						variant="default"
					>
						<ArrowUpRight className="text-white" size={16} />
					</Button>
				</div>

				{/* Bottom Content */}
				<div className="px-4 pb-[25px] text-white sm:px-6 sm:pb-[30px] md:px-8 md:pb-[37px]">
					<div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
						<p className="text-[12px] capitalize leading-tight sm:text-[14px] sm:leading-[21px]">
							{destination.location?.country || "Unknown Location"}
						</p>
						<div className="flex flex-col items-start gap-2">
							<div>
								<h3 className="font-bold text-base leading-tight sm:text-base sm:leading-[28px]">
									{destination.name}
								</h3>
								<p className="text-xs capitalize">
									{destination.location?.region}
								</p>
							</div>

							<div>
								<Button
									className="rounded-full"
									disabled
									size="sm"
									variant={"secondary"}
								>
									{destination.packageCount} Package
									{destination.packageCount !== 1 ? "s" : ""}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default DestinationGrid;
