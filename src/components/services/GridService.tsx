import type { SanityDocument } from "@sanity/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OptimizedImage } from "../ui/OptimizedImage";

type GridServiceProps = {
	service: SanityDocument;
};

function GridService({ service }: GridServiceProps) {
	return (
		<Card className="w-full gap-3 border-0 p-3 shadow-none hover:cursor-pointer sm:gap-4 sm:p-4 md:gap-5 md:p-5">
			<CardContent className="p-0">
				<OptimizedImage
					alt={service.image.alt || "Service image"}
					className="h-[200px] w-full rounded-md object-cover sm:h-[280px] md:h-[340px] lg:h-[413px]"
					height={413}
					source={service.image}
					width={600}
				/>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 p-0">
				<div className="">
					<h4 className="text-base sm:text-lg md:text-xl">{service.title}</h4>
					<p className="mt-1 text-muted-foreground text-xs sm:text-sm">
						{service.subtitle || "No subtitle available"}
					</p>
				</div>
				<div className="mt-3 flex w-full flex-wrap items-center gap-1 sm:mt-4 sm:gap-1.5 md:mt-5">
					{service.specifics
						?.slice(0, 3)
						.map((spec: { title: string; _key: string }, index: number) => (
							<Button
								className="rounded-full px-2 py-1 text-xs sm:px-3 sm:py-1.5"
								disabled
								key={spec._key || index}
								size="sm"
							>
								{spec.title}
							</Button>
						))}
					{service.specifics?.length > 3 && (
						<span className="ml-1 text-muted-foreground text-xs">
							+{service.specifics.length - 3} more
						</span>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}

export default GridService;
