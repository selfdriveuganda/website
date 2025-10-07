import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { fetchSingleCarQuery } from "@/hooks/carsHook";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "../ui/button";
import { OptimizedImage } from "../ui/OptimizedImage";

const SingleCarHero = () => {
	const navigate = useNavigate();
	const { carSlug } = useParams({ from: "/_all/cars/$carSlug" });
	const setCar = useBookingStore((state) => state.setCar);

	const { data: car } = useSuspenseQuery(fetchSingleCarQuery(carSlug));

	const handleStartBooking = () => {
		setCar(car);
		navigate({
			to: "/bookings/new",
			replace: true,
		});
	};

	if (!car) {
		return <div className="text-center text-red-500">Car not found</div>;
	}

	return (
		<div className="flex h-[60dvh] flex-col overflow-y-auto md:h-[91dvh]">
			{/* Desktop Layout - Text above image */}
			<div className="hidden h-full flex-col md:flex">
				{/* Hero Text Section - Desktop */}
				<div className="flex-shrink-0 pt-10">
					<div className="mx-auto flex max-w-4xl flex-col items-center">
						<h2 className="text-center font-bold text-3xl text-gray-900 leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl xl:text-6xl">
							{car?.name}
						</h2>
						<p className="mx-auto mt-2 max-w-2xl text-center text-gray-600 text-sm sm:mt-3 sm:text-sm md:mt-4 md:text-sm">
							{car?.details}
						</p>
						<div className="pt-8">
							<Button
								className="w-full"
								onClick={handleStartBooking}
								size={"lg"}
							>
								Rent this Car for ${car?.price_per_day}/ day
							</Button>
						</div>
					</div>
				</div>

				{/* Hero Image Section - Desktop */}
				<div className="relative flex-1 overflow-hidden">
					<div className="absolute inset-0 z-0 h-24 bg-gradient-to-b from-white via-white/30 to-transparent sm:h-28 md:h-32" />
					<OptimizedImage
						alt="4x4 vehicle in Uganda landscape"
						className="h-full w-full object-cover object-center"
						source={car.images[0]}
					/>
				</div>
			</div>

			{/* Mobile Layout - Image above text */}
			<div className="flex h-full flex-col md:hidden">
				{/* Hero Image Section - Mobile */}
				<div className="relative flex-1 overflow-hidden">
					<OptimizedImage
						alt="4x4 vehicle in Uganda landscape"
						className="h-full w-full object-cover object-center"
						source={car.images[0]}
					/>
				</div>

				{/* Hero Text Section - Mobile */}
				<div className="flex-shrink-0 bg-white p-4">
					<div className="mx-auto flex max-w-4xl flex-col items-center">
						<h2 className="text-center font-bold text-gray-900 text-xl leading-tight">
							{car?.name}
						</h2>
						<p className="mx-auto mt-2 max-w-2xl text-center text-gray-600 text-sm">
							{car?.details}
						</p>
						<div className="w-full pt-4">
							<Button className="w-full" size={"lg"}>
								Rent this Car for ${car?.price_per_day}/ day
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SingleCarHero;
