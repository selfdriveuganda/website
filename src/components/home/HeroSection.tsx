import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { HeroSearchForm } from "./HeroSearchForm";

const HeroSection = () => {
	const titleLine1Ref = useRef<HTMLHeadingElement>(null);
	const titleLine2Ref = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const formContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			titleLine1Ref.current &&
			titleLine2Ref.current &&
			descriptionRef.current &&
			formContainerRef.current
		) {
			// Create a timeline for sequential animations
			const tl = gsap.timeline();

			tl.fromTo(
				titleLine1Ref.current,
				{ opacity: 0, y: 40 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
			)
				.fromTo(
					titleLine2Ref.current,
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
					"-=0.5"
				)
				.fromTo(
					descriptionRef.current,
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
					"-=0.4"
				)
				.fromTo(
					formContainerRef.current,
					{ opacity: 0, y: 30, scale: 0.95 },
					{ opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.2)" },
					"-=0.4"
				);
		}
	}, []);

	return (
		<div
			className="relative flex h-[100dvh] flex-col items-center justify-center bg-center bg-cover bg-no-repeat pt-20"
			style={{ backgroundImage: "url(/images/bg.svg)" }}
		>
			<div className="absolute inset-0 bg-background opacity-95" />
			<div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4 text-center sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl">
					<h1
						className="text-center font-bold text-4xl text-gray-900 leading-tight sm:text-5xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl xl:text-6xl"
						ref={titleLine1Ref}
					>
						Discover Uganda's Beauty with
					</h1>
					<h1
						className="text-center font-bold text-4xl text-primary leading-tight sm:text-5xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl xl:text-6xl"
						ref={titleLine2Ref}
					>
						Premium 4x4 Rentals
					</h1>
					<p
						className="mx-auto mt-4 max-w-2xl text-center text-gray-600 text-sm sm:mt-6 sm:text-base md:text-xl"
						ref={descriptionRef}
					>
						Reliable self-drive 4x4s for Uganda's roads — safe, comfortable, and
						ready when you are.
					</p>
				</div>

				<div className="w-full max-w-5xl" ref={formContainerRef}>
					<HeroSearchForm />
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
