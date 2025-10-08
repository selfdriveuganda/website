import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { OptimizedImage } from "../ui/OptimizedImage";

type DestinationsHeroProps = {
	title: string;
	description: string;
	imageUrl: string;
};

function DestinationsHero({
	title,
	description,
	imageUrl,
}: DestinationsHeroProps) {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const descRef = useRef<HTMLParagraphElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (titleRef.current && descRef.current && imageRef.current) {
			gsap.fromTo(
				imageRef.current,
				{ opacity: 0, scale: 1.1 },
				{ opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
			);

			gsap.fromTo(
				titleRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
			);

			gsap.fromTo(
				descRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" }
			);
		}
	}, []);

	return (
		<div className="relative min-h-[60dvh] overflow-hidden md:min-h-[70dvh]">
			{/* Background Image */}
			<div className="absolute inset-0" ref={imageRef}>
				<OptimizedImage
					alt={title}
					className="h-full w-full object-cover object-center"
					height={800}
					source={imageUrl}
					width={1920}
				/>
			</div>

			{/* Dark Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

			{/* Content */}
			<div className="relative z-10 flex h-full items-center justify-center py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="container mx-auto flex flex-col items-center text-center">
						<h1
							className="font-bold text-4xl text-white capitalize leading-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl"
							ref={titleRef}
						>
							{title}
						</h1>
						<p
							className="mx-auto mt-4 max-w-4xl text-base text-gray-200 sm:mt-6 sm:text-lg md:text-xl"
							ref={descRef}
						>
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DestinationsHero;
