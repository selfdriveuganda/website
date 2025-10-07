import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchBlogsQuery } from "@/hooks/blogHook";
import { BlogPostCard } from "../blogs/BlogPostCard";
import { Button } from "../ui/button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BlogSection = () => {
	const { data: blogs } = useSuspenseQuery(fetchBlogsQuery);

	return (
		<section className="border-t bg-gradient-to-t from-gray-200 to-white py-10 sm:py-12 md:py-16 lg:py-24">
			<div className="container mx-auto px-4 sm:px-6">
				<div className="mb-8 space-y-2 text-center sm:mb-10 md:mb-12">
					<h2 className="font-bold text-2xl sm:text-3xl md:text-4xl">
						Your Uganda Safari Guide
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-md">
						Essential travel tips, safari routes, and local insights to help you
						plan the perfect self-drive adventure across Uganda's stunning
						landscapes and wildlife parks.
					</p>
				</div>
				<div className="relative px-12">
					<Swiper
						breakpoints={{
							320: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							640: {
								slidesPerView: 2,
								spaceBetween: 30,
							},
							1024: {
								slidesPerView: 3,
								spaceBetween: 33,
							},
						}}
						centeredSlides={false}
						className="mySwiper"
						modules={[Navigation, Pagination]}
						navigation={{
							nextEl: ".swiper-button-next-custom",
							prevEl: ".swiper-button-prev-custom",
						}}
						pagination={{
							clickable: true,
						}}
						slidesPerView={3}
						spaceBetween={33}
					>
						{blogs.map((blog) => (
							<SwiperSlide className="flex justify-center" key={blog.id}>
								<BlogPostCard {...{ blog }} />
							</SwiperSlide>
						))}
					</Swiper>

					{/* Custom Navigation Buttons */}
					<Button
						aria-label="Previous slide"
						className="swiper-button-prev-custom -translate-y-1/2 absolute top-1/2 left-0 z-10 rounded-full"
						size="icon"
						variant="outline"
					>
						<ChevronLeft className="size-5" />
					</Button>
					<Button
						aria-label="Next slide"
						className="swiper-button-next-custom -translate-y-1/2 absolute top-1/2 right-0 z-10 rounded-full"
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

export default BlogSection;
