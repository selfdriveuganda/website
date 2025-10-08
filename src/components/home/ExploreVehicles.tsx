import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import {
	fetchCarCategoriesQuery,
	fetchCarsByCategoryQuery,
} from "@/hooks/carsHook";
import SingleGridCar from "../allcars/SingleGridCar";
import { Button } from "../ui/button";

const ExploreVehicles = () => {
	const { data: categories } = useSuspenseQuery(fetchCarCategoriesQuery);

	const [activeCategory, setActiveCategory] = useState<SanityDocument | null>(
		null
	); // Start with null to show all cars
	const titleRef = useRef<HTMLHeadingElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const showAllButtonRef = useRef<HTMLDivElement>(null);

	// Always call the query hook, but pass a stable slug value
	const categorySlug = activeCategory?.slug || "";
	const { data: cars } = useSuspenseQuery(
		fetchCarsByCategoryQuery(categorySlug)
	);

	// Initial animations on component mount
	useEffect(() => {
		const tl = gsap.timeline();

		// Animate title
		tl.fromTo(
			titleRef.current,
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
		);

		// Animate category buttons
		if (buttonsRef.current) {
			tl.fromTo(
				Array.from(buttonsRef.current.children),
				{ opacity: 0, y: 30, scale: 0.9 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out",
				},
				"-=0.4"
			);
		}

		// Animate show all button
		tl.fromTo(
			showAllButtonRef.current,
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
			"-=0.2"
		);
	}, []);

	// Animation when category changes
	useEffect(() => {
		if (cardsRef.current) {
			gsap.fromTo(
				Array.from(cardsRef.current.children),
				{ opacity: 0, y: 50, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out",
				}
			);
		}
	}, []);

	// If no data, return early with a message (after all hooks)
	if (!categories || categories.length === 0) {
		return <div className="p-8 text-center">Loading categories...</div>;
	}

	const handleCategoryChange = (category: SanityDocument | null) => {
		// Handle null case (All Cars) and category comparison
		if (
			(category === null && activeCategory === null) ||
			category?._id === activeCategory?._id
		) {
			return;
		}

		// Exit animation for current cards
		if (cardsRef.current) {
			gsap.to(Array.from(cardsRef.current.children), {
				opacity: 0,
				y: -30,
				scale: 0.95,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					setActiveCategory(category);
				},
			});
		}
	};

	// Filter cars by the selected category slug, or show all cars if no category selected
	const filteredCars = activeCategory
		? cars.filter((car) =>
				car.categories?.some(
					(category: SanityDocument) => category.slug === activeCategory?.slug
				)
			)
		: cars; // Show all cars when no category is selected

	// Use filtered cars directly since we handle the "all cars" case above
	const displayCars = filteredCars;

	return (
		<div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:py-12">
			<h2
				className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl"
				ref={titleRef}
			>
				Explore our vehicles
			</h2>
			<div
				className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pt-5 sm:gap-3 sm:pt-7"
				ref={buttonsRef}
			>
				{/* All Cars button */}
				<Button
					className={`mb-2 whitespace-nowrap rounded-full px-4 py-1.5 font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 sm:mb-0 sm:px-5 sm:py-2 ${
						activeCategory
							? "border-gray-300 text-black hover:border-black"
							: "bg-black text-white"
					}`}
					onClick={() => handleCategoryChange(null)}
					onTouchEnd={(e) => {
						e.currentTarget.style.opacity = "1";
					}}
					onTouchStart={(e) => {
						e.currentTarget.style.opacity = "0.8";
					}}
					variant={activeCategory ? "outline" : "default"}
				>
					All Cars
				</Button>

				{categories.map((category, _index: number) => (
					<Button
						className={`mb-2 whitespace-nowrap rounded-full px-4 py-1.5 font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 sm:mb-0 sm:px-5 sm:py-2 ${
							activeCategory?._id === category._id
								? "bg-black text-white"
								: "border-gray-300 text-black hover:border-black"
						}`}
						key={category._id}
						onClick={() => handleCategoryChange(category)}
						onTouchEnd={(e) => {
							e.currentTarget.style.opacity = "1";
						}}
						// Ensure button is tappable with good feedback
						onTouchStart={(e) => {
							e.currentTarget.style.opacity = "0.8";
						}}
						variant={
							activeCategory?._id === category._id ? "default" : "outline"
						}
					>
						{category.category}
					</Button>
				))}
			</div>
			<div
				className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 md:mt-12 md:grid-cols-3 md:gap-8"
				ref={cardsRef}
			>
				{displayCars.map((car: SanityDocument) => (
					<SingleGridCar car={car} key={car._id} />
				))}
			</div>
			<div
				className="mt-8 text-center sm:mt-10 md:mt-12"
				ref={showAllButtonRef}
			>
				<Button
					asChild
					onMouseEnter={(e) => {
						// Skip animation on mobile
						if (window.innerWidth < 640) {
							return;
						}

						gsap.to(e.currentTarget, {
							scale: 1.05,
							duration: 0.2,
							ease: "power2.out",
						});
					}}
					// className="hover:scale-105 active:scale-95 transition-transform duration-200 w-full sm:w-auto sm:text-base md:text-lg px-4 py-2 sm:px-6 sm:py-2.5"
					onMouseLeave={(e) => {
						// Skip animation on mobile
						if (window.innerWidth < 640) {
							return;
						}

						gsap.to(e.currentTarget, {
							scale: 1,
							duration: 0.2,
							ease: "power2.out",
						});
					}}
					size={"lg"}
				>
					<Link to="/cars">Show All Cars for Rent</Link>
				</Button>
			</div>
		</div>
	);
};

export default ExploreVehicles;
