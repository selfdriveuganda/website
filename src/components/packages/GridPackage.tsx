import type { SanityDocument } from "@sanity/client";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { OptimizedImage } from "../ui/OptimizedImage";

type GridPackageProps = {
	pack: SanityDocument;
};

function GridPackage({ pack }: GridPackageProps) {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate({
			to: "/packages/$packageSlug",
			params: {
				packageSlug: pack.slug?.current || "",
			},
		});
	};

	return (
		<Card
			className="w-full gap-3 border-0 p-3 shadow-none hover:cursor-pointer sm:gap-4 sm:p-4 md:gap-5 md:p-5"
			onClick={handleNavigate}
		>
			<CardContent className="p-0">
				<div className="relative">
					<OptimizedImage
						alt={pack.images.alt || "Package image"}
						className="h-[329px] w-full rounded-md object-cover"
						source={pack.images}
					/>
					{/* Black gradient overlay from bottom to top */}
					<div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

					{/* Package name overlay */}
					<div className="absolute right-0 bottom-0 left-0 p-4 pb-8">
						<h6 className="font-semibold text-lg text-white">{pack.name}</h6>
						<div className="mt-2 flex flex-wrap items-center gap-2">
							{pack.recommendedCars?.length > 0 && (
								<Badge className="rounded-full px-2 py-1" variant={"secondary"}>
									{pack.recommendedCars?.length} Recommended Car
									{pack.recommendedCars?.length !== 1 ? "s" : ""}
								</Badge>
							)}
							<Badge className="rounded-full px-2 py-1" variant={"secondary"}>
								{pack.duration} Day{pack.duration?.length !== 1 ? "s" : ""} Trip
							</Badge>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 p-0">
				<div className="">
					{/* <h5 className="">{pack.name}</h5> */}
					{/* <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {service.subtitle || "No subtitle available"}
          </p> */}
				</div>
				{/* <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center mt-3 sm:mt-4 md:mt-5 w-full">
          {service.specifics?.slice(0, 3).map((spec: any, index: number) => (
            <Button
              key={index}
              size="sm"
              className="rounded-full text-xs px-2 sm:px-3 py-1 sm:py-1.5"
              disabled
            >
              {spec.title}
            </Button>
          ))}
          {service.specifics?.length > 3 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{service.specifics.length - 3} more
            </span>
          )}
        </div> */}
			</CardFooter>
		</Card>
	);
}

export default GridPackage;
