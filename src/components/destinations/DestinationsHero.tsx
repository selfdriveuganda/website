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
	const desktopTitleRef = useRef<HTMLHeadingElement>(null);
	const desktopDescRef = useRef<HTMLParagraphElement>(null);
	const desktopImageRef = useRef<HTMLDivElement>(null);
	const mobileTitleRef = useRef<HTMLHeadingElement>(null);
	const mobileDescRef = useRef<HTMLParagraphElement>(null);
	const mobileImageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Desktop animations
		if (
			desktopTitleRef.current &&
			desktopDescRef.current &&
			desktopImageRef.current
		) {
			gsap.fromTo(
				desktopTitleRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
			);

			gsap.fromTo(
				desktopDescRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
			);

			gsap.fromTo(
				desktopImageRef.current,
				{ opacity: 0, scale: 1.1 },
				{ opacity: 1, scale: 1, duration: 1, delay: 0.3, ease: "power3.out" }
			);
		}

		// Mobile animations
		if (
			mobileTitleRef.current &&
			mobileDescRef.current &&
			mobileImageRef.current
		) {
			gsap.fromTo(
				mobileImageRef.current,
				{ opacity: 0, scale: 1.1 },
				{ opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
			);

			gsap.fromTo(
				mobileTitleRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
			);

			gsap.fromTo(
				mobileDescRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
			);
		}
	}, []);

	return (
		<div className="flex h-[60dvh] flex-col overflow-y-auto md:h-[50dvh]">
			{/* Desktop Layout - Text above image */}
			<div className="hidden h-full flex-col md:flex">
				{/* Hero Text Section - Desktop */}
				<div className="flex-shrink-0 pt-16">
					<div className="mx-auto flex max-w-4xl flex-col items-center">
						<h2
							className="text-center font-bold text-3xl text-gray-900 capitalize leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl xl:text-6xl"
							ref={desktopTitleRef}
						>
							{title}
						</h2>
						<p
							className="mx-auto mt-2 max-w-2xl text-center text-gray-600 text-sm sm:mt-3 sm:text-sm md:mt-4 md:text-sm"
							ref={desktopDescRef}
						>
							{description}
						</p>
					</div>
				</div>

				{/* Hero Image Section - Desktop */}
				<div className="relative flex-1 overflow-hidden">
					<div className="absolute inset-0 z-0 h-24 bg-gradient-to-b from-white via-white/30 to-transparent sm:h-28 md:h-32" />
					<div ref={desktopImageRef}>
						<OptimizedImage
							alt="4x4 vehicle in Uganda landscape"
							className="h-[20dvh] w-full object-cover object-center"
							height={200}
							source={imageUrl}
							width={800}
						/>
					</div>
				</div>
			</div>

			{/* Mobile Layout - Text overlay on image */}
			<div className="relative flex h-full flex-col md:hidden">
				{/* Hero Image Section - Mobile - Half height */}
				<div className="relative h-1/2 overflow-hidden">
					{/* White gradient from top - Mobile (same as home page) */}
					<div className="absolute inset-0 z-0 h-24 bg-gradient-to-b from-white via-white/30 to-transparent sm:h-28 md:h-32" />

					<div ref={mobileImageRef}>
						<OptimizedImage
							alt="4x4 vehicle in Uganda landscape"
							className="h-full w-full object-cover object-center"
							height={400}
							source={imageUrl}
							width={600}
						/>
					</div>

					{/* Text Overlay - Mobile */}
					<div className="absolute inset-0 z-10 flex items-start bg-gradient-to-b from-black/80 via-black/40 to-transparent">
						<div className="w-full p-4 pt-8">
							<div className="mx-auto flex max-w-4xl flex-col items-center text-center">
								<h2
									className="mb-3 font-bold text-2xl text-white leading-tight sm:text-3xl"
									ref={mobileTitleRef}
								>
									{title}
								</h2>
								<p
									className="mx-auto max-w-md text-gray-200 text-sm"
									ref={mobileDescRef}
								>
									{description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DestinationsHero;
