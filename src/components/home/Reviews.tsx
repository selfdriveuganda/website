import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchReviewsQuery } from "@/hooks/reviewHook";
import { ReviewCard } from "../reviews/ReviewCard";
import { Button } from "../ui/button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const ReviewsSection = () => {
	const { data: reviews } = useSuspenseQuery(fetchReviewsQuery);

	return (
		<section className="">
			<div className="container mx-auto px-4 sm:px-6">
				<div className="mb-8 space-y-2 text-center sm:mb-10 md:mb-12">
					<h2 className="font-bold text-2xl sm:text-3xl md:text-4xl">
						What Our Customers Say
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-md">
						Real experiences from travelers who explored Uganda with our
						vehicles. Your adventure could be next!
					</p>
				</div>
				<div className="relative px-12">
					<Swiper
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						breakpoints={{
							320: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							640: {
								slidesPerView: 1,
								spaceBetween: 30,
							},
							1024: {
								slidesPerView: 2,
								spaceBetween: 33,
							},
						}}
						centeredSlides={false}
						className="reviewSwiper"
						loop={true}
						modules={[Autoplay, Navigation]}
						navigation={{
							nextEl: ".review-button-next-custom",
							prevEl: ".review-button-prev-custom",
						}}
						slidesPerView={2}
						spaceBetween={33}
					>
						{reviews.map((review: SanityDocument) => (
							<SwiperSlide className="flex justify-center" key={review._id}>
								<ReviewCard {...{ review }} />
							</SwiperSlide>
						))}
					</Swiper>

					{/* Custom Navigation Buttons */}
					<Button
						aria-label="Previous review"
						className="review-button-prev-custom -translate-y-1/2 absolute top-1/2 left-0 z-10 rounded-full"
						size="icon"
						variant="outline"
					>
						<ChevronLeft className="size-5" />
					</Button>
					<Button
						aria-label="Next review"
						className="review-button-next-custom -translate-y-1/2 absolute top-1/2 right-0 z-10 rounded-full"
						size="icon"
						variant="outline"
					>
						<ChevronRight className="size-5" />
					</Button>
				</div>
			</div>
		</section>
	);
};

export default ReviewsSection;
