import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import type { SanityAssetDocument } from "@sanity/client";
// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import { Button } from "../ui/button";
import { OptimizedImage } from "../ui/OptimizedImage";

type PackageSlideProps = {
	images: SanityAssetDocument[];
};

function PackageSlide({ images }: PackageSlideProps) {
	const swiperRef = useRef<SwiperType | null>(null);

	return (
		<div className="relative w-full">
			<Swiper
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				breakpoints={{
					// Mobile (default): 1 slide
					320: {
						slidesPerView: 1,
						spaceBetween: 10,
					},
					// Small tablets: 1.5 slides
					480: {
						slidesPerView: 1.5,
						spaceBetween: 15,
					},
					// Tablets: 2 slides
					768: {
						slidesPerView: 2,
						spaceBetween: 0,
					},
					// Desktop: 3 slides
					1024: {
						slidesPerView: 3,
						spaceBetween: 0,
					},
				}}
				className="mySwiper w-full"
				modules={[Pagination, Autoplay]}
				onBeforeInit={(swiper) => {
					swiperRef.current = swiper;
				}}
				pagination={{
					clickable: true,
				}}
				slidesPerView={1}
				spaceBetween={0}
			>
				{images.map((image) => (
					<SwiperSlide key={image._id}>
						<div className="h-[300px] w-full overflow-hidden sm:h-[250px] md:h-[300px] lg:h-[329px]">
							<OptimizedImage
								alt={image.alt}
								className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
								source={image}
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom Navigation Buttons */}
			<Button
				className="-translate-y-1/2 absolute top-1/2 left-4 z-10 rounded-full bg-white/80 hover:bg-white"
				onClick={() => swiperRef.current?.slidePrev()}
				size="icon"
				variant="outline"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<Button
				className="-translate-y-1/2 absolute top-1/2 right-4 z-10 rounded-full bg-white/80 hover:bg-white"
				onClick={() => swiperRef.current?.slideNext()}
				size="icon"
				variant="outline"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default PackageSlide;
