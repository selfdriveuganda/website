import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type CommonPageHeroProps = {
	title: string;
	description: string;
};

function CommonPageHero({ title, description }: CommonPageHeroProps) {
	const desktopTitleRef = useRef<HTMLHeadingElement>(null);
	const desktopDescRef = useRef<HTMLParagraphElement>(null);
	const mobileTitleRef = useRef<HTMLHeadingElement>(null);
	const mobileDescRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		// Desktop animations
		if (desktopTitleRef.current && desktopDescRef.current) {
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
		}

		// Mobile animations
		if (mobileTitleRef.current && mobileDescRef.current) {
			gsap.fromTo(
				mobileTitleRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
			);

			gsap.fromTo(
				mobileDescRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
			);
		}
	}, []);

	return (
		<div className="flex flex-col overflow-y-auto">
			{/* Desktop Layout - Text above image */}
			<div className="hidden h-full flex-col md:flex">
				{/* Hero Text Section - Desktop */}
				<div className="flex-shrink-0 bg-gray-50 py-12 md:py-16">
					<div className="container mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6 lg:px-8">
						<h2
							className="font-bold text-3xl text-gray-900 capitalize leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl xl:text-6xl"
							ref={desktopTitleRef}
						>
							{title}
						</h2>
						<p
							className="mx-auto mt-2 max-w-2xl text-center text-gray-600 text-sm sm:mt-3 sm:text-sm md:mt-4 md:text-base"
							ref={desktopDescRef}
						>
							{description}
						</p>
					</div>
				</div>
			</div>

			{/* Mobile Layout */}
			<div className="relative flex h-full flex-col md:hidden">
				<div className="relative min-h-[30vh] overflow-hidden bg-gray-50 py-12">
					<div className="container mx-auto flex flex-col items-center px-4 text-center sm:px-6">
						<h2
							className="mb-3 font-bold text-2xl text-gray-900 capitalize leading-tight sm:text-3xl"
							ref={mobileTitleRef}
						>
							{title}
						</h2>
						<p
							className="mx-auto max-w-md text-gray-600 text-sm"
							ref={mobileDescRef}
						>
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CommonPageHero;
