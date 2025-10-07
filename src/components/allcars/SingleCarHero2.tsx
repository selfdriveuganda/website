import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fetchSingleCarQuery } from "@/hooks/carsHook";
import { OptimizedImage } from "../ui/OptimizedImage";
import { CarBookForm } from "./CarBookForm";

const SingleCarHero2 = () => {
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });
	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	return (
		<div className="container mx-auto flex max-h-[90dvh] overflow-y-auto">
			<div className="flex gap-16 pt-10 pb-20">
				<div className="w-3/4">
					<OptimizedImage
						alt="4x4 vehicle in Uganda landscape"
						className="h-full min-h-[500px] w-full rounded-2xl object-cover object-center"
						source={car.images[0]}
					/>
				</div>
				<CarBookForm {...{ car }} />
			</div>
		</div>
	);
};

export default SingleCarHero2;
