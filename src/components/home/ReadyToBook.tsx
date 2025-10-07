import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const ReadyToBook = () => (
	<section className="py-8 sm:py-10 md:py-12 lg:py-16">
		<div className="mx-auto max-w-xs px-4 sm:max-w-sm sm:px-0 md:max-w-lg lg:max-w-xl">
			<div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
				<Button asChild className="size-10 shadow-md sm:size-12" size={"icon"}>
					<Link to="/contact">
						<ArrowRight className="sm:h-6 sm:w-6" size={24} />
					</Link>
				</Button>
				<p className="text-center text-gray-600 text-xs sm:text-sm">
					Contact us to get started
				</p>
			</div>
			<div className="flex flex-col items-center justify-center py-4 sm:py-5 md:py-7">
				<h2 className="max-w-[280px] text-center font-bold text-xl sm:max-w-none sm:text-2xl md:text-3xl lg:text-4xl">
					Ready to book a car for your next adventure?
				</h2>
				<div className="mt-4 h-1 w-[80px] rounded-full bg-gray-400 sm:mt-5 sm:w-[100px] md:mt-7 md:w-[124px]" />
			</div>
		</div>
	</section>
);

export default ReadyToBook;
