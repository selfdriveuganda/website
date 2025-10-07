import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const bookingInfoCards = [
	{
		title: "Pick Your Car",
		description:
			"Choose from a wide range of vehicles to suit your needs, whether it's a compact car for city driving or a rugged SUV for off-road adventures.",
		icon: "/images/search_icon.png",
	},
	{
		title: "Pick Up Locations",
		description:
			"Choose from multiple convenient pick-up locations across the country. Whether you're at the airport or in the city, we've got you covered.",
		icon: "/images/calendar_icon.png",
	},
	{
		title: "Confirm & Drive Away",
		description:
			"Confirm your booking with ease. Our platform ensures a smooth and secure reservation process. Pay by credit card or cash on delivery.",
		icon: "/images/check_icon.png",
	},
];

export const BookingSteps = () => (
	<div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
		<div className="container mx-auto flex flex-col">
			<h2 className="mb-6 text-center font-bold text-2xl text-gray-900 sm:mb-8 sm:text-3xl lg:mb-10 lg:text-4xl">
				Rent a car in a few clicks
			</h2>
			<p className="mx-auto mb-6 hidden max-w-3xl text-center text-gray-600 text-xs sm:mb-8 md:block lg:mb-10 lg:text-base">
				Experience a hassle-free car rental process with our user-friendly
				platform. Whether you're planning a road trip or need a vehicle for a
				special occasion, we make it easy to find and book the perfect car for
				your needs.
			</p>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
				{bookingInfoCards.map((card, index) => (
					<Card
						className="hover:-translate-y-1 border-none bg-[#6e828a] p-2 text-white shadow-lg transition-all duration-300 hover:bg-[#454f53] hover:shadow-xl"
						key={index.toString()}
					>
						<CardHeader className="p-0 sm:p-2">
							<div className="mb-2 flex items-center justify-center sm:mb-3">
								<div
									className="h-4 w-4 bg-center bg-contain bg-no-repeat sm:h-6 sm:w-6"
									style={{ backgroundImage: `url(${card.icon})` }}
									title={card.title}
								/>
							</div>
							<CardTitle className="mb-2 text-center font-bold text-sm leading-snug sm:mb-3 sm:text-base">
								{card.title}
							</CardTitle>
							<CardDescription className="text-center font-normal text-sm text-white leading-relaxed">
								{card.description}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	</div>
);

export default BookingSteps;
