import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getLogoUrl, settingsQuery } from "@/hooks/siteSettingsHook";
import { Button } from "../ui/button";
import { OptimizedImage } from "../ui/OptimizedImage";

const menuItems = [
	{
		name: "Home",
		to: "/",
	},
	{
		name: "Our fleet",
		to: "/cars",
	},
	{ name: "Our services", to: "/services" },
	{
		name: "Destinations",
		to: "/destinations",
	},
	// {
	// 	name: "Packages",
	// 	to: "/packages",
	// },
	{ name: "Blogs", to: "/blogs" },
];

export function NavMenu() {
	// Fetch site settings for logo
	const { data: settings } = useSuspenseQuery(settingsQuery);
	// const { data: siteSettings } = useSiteSettings();

	const logoUrl = getLogoUrl(settings);
	// const logoUrl = getLogoUrl(settings?.logo.asset.url);

	// Constants
	const initialRenderDelayMs = 100;
	const desktopMinWidth = 768;
	const navHideScrollThreshold = 100;
	const navHideY = -100;
	const navAnimDuration = 0.3;
	// Initialize state to closed
	const [isOpen, setIsOpen] = React.useState(false);
	// Use a separate state to track if initial rendering is complete
	const [isInitialRender, setIsInitialRender] = React.useState(true);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLButtonElement>(null);
	const menuItemsRef = useRef<HTMLDivElement[]>([]);
	const closeButtonRef = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);

	// Track scroll position for hiding/showing navbar
	const [isNavbarVisible, setIsNavbarVisible] = useState(true);
	const lastScrollY = useRef(0);

	// Initialize GSAP timeline
	const tl = useRef<gsap.core.Timeline | null>(null);
	// First useEffect: Set initial state on component mount
	useEffect(() => {
		// Force mobile menu to be closed initially
		setIsOpen(false);

		// After a very short delay, set initialRender to false
		// This ensures the menu is hidden during the first render cycle
		const timer = setTimeout(() => {
			setIsInitialRender(false);
		}, initialRenderDelayMs);

		// Helpers for navbar animation
		const animateNavbarTo = (y: number) => {
			if (!navbarRef.current) {
				return;
			}
			gsap.to(navbarRef.current, {
				y,
				duration: navAnimDuration,
				ease: "power2.out",
			});
		};

		const setNavbarY = (y: number) => {
			if (!navbarRef.current) {
				return;
			}
			gsap.set(navbarRef.current, { y });
		};

		const handleDesktopScroll = (currentScrollY: number) => {
			const scrollingDown = currentScrollY > lastScrollY.current;
			if (scrollingDown) {
				if (currentScrollY > navHideScrollThreshold && isNavbarVisible) {
					setIsNavbarVisible(false);
					animateNavbarTo(navHideY);
				}
			} else if (isNavbarVisible === false) {
				setIsNavbarVisible(true);
				animateNavbarTo(0);
			}
		};

		// Add scroll event listener for navbar hide/show (desktop only)
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (window.innerWidth >= desktopMinWidth) {
				handleDesktopScroll(currentScrollY);
			} else if (isNavbarVisible === false) {
				// On mobile, always keep navbar visible
				setIsNavbarVisible(true);
				setNavbarY(0);
			}
			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			clearTimeout(timer);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isNavbarVisible]);

	// Second useEffect: Handle GSAP setup after first render
	useEffect(() => {
		// Initialize the timeline
		tl.current = gsap.timeline({ paused: true });

		if (mobileMenuRef.current && overlayRef.current) {
			// Set initial states without animation - maintain what CSS already sets
			gsap.set(mobileMenuRef.current, { x: "100%" });
			gsap.set(overlayRef.current, { opacity: 0, display: "none" });
			gsap.set(menuItemsRef.current, { opacity: 0, y: 20 });
			if (closeButtonRef.current) {
				gsap.set(closeButtonRef.current, { opacity: 0, scale: 0.8 });
			}

			// Create animation sequence but don't play it yet
			tl.current
				.set(overlayRef.current, { display: "block", visibility: "visible" })
				.to(overlayRef.current, {
					opacity: 1,
					duration: 0.3,
					ease: "power2.out",
				})
				.set(mobileMenuRef.current, { visibility: "visible", opacity: 1 })
				.to(
					mobileMenuRef.current,
					{ x: "0%", duration: 0.5, ease: "power2.out" },
					"-=0.1"
				)
				.to(
					menuItemsRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.4,
						stagger: 0.08,
						ease: "back.out(1.7)",
					},
					"-=0.2"
				);

			if (closeButtonRef.current) {
				tl.current.to(
					closeButtonRef.current,
					{
						opacity: 1,
						scale: 1,
						duration: 0.3,
						ease: "back.out(1.7)",
					},
					"-=0.4"
				);
			}

			// Don't execute any animations on mount
			tl.current.progress(0).pause();
		}
	}, []);

	const toggleMobileMenu = () => {
		if (tl.current) {
			if (isOpen) {
				// Close the menu
				tl.current.reverse();
			} else {
				// Open the menu - make sure animation starts from beginning
				tl.current.progress(0).play();

				// Make sure overlay is visible before animation
				if (overlayRef.current) {
					gsap.set(overlayRef.current, { display: "block" });
				}
			}
			setIsOpen(!isOpen);
		}
	};

	const closeMobileMenu = () => {
		if (tl.current && isOpen) {
			// Reverse the animation to close the menu
			tl.current.reverse().eventCallback("onReverseComplete", () => {
				// After animation completes, make sure everything is completely hidden
				if (overlayRef.current) {
					gsap.set(overlayRef.current, {
						display: "none",
						visibility: "hidden",
					});
				}
				if (mobileMenuRef.current) {
					gsap.set(mobileMenuRef.current, { visibility: "hidden", opacity: 0 });
				}
			});
			setIsOpen(false);
		}
	};

	return (
		<>
			<div className="fixed top-0 right-0 left-0 z-50 bg-white" ref={navbarRef}>
				<div className="container mx-auto flex items-center justify-between gap-2 px-2 py-4 md:py-6">
					<div className="flex items-center">
						<Link className="flex items-center gap-2" to={"/"}>
							{logoUrl ? (
								<OptimizedImage
									alt={settings?.logo?.alt || settings?.title || "Logo"}
									className="h-10 w-auto object-contain md:h-12"
									height={48}
									source={logoUrl}
									width={120}
								/>
							) : (
								<span className="font-bold text-black text-xl">
									{settings?.title || "Logo"}
								</span>
							)}
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden gap-6 md:flex">
						{menuItems.map((item) => (
							<div className="relative inline-block" key={item.to}>
								<Link
									activeOptions={{ exact: true }}
									activeProps={{
										className:
											"font-bold text-primary underline decoration-primary decoration-2 underline-offset-4",
									}}
									className="relative font-semibold text-black/80 text-sm transition-colors hover:text-primary md:text-base"
									preload="viewport"
									to={item.to}
								>
									{item.name}
								</Link>
							</div>
						))}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							aria-label="Toggle menu"
							className="relative z-30 size-10 text-black hover:text-black"
							onClick={toggleMobileMenu}
							size="icon"
							variant={"ghost"}
						>
							{isOpen ? <X /> : <Menu />}
						</Button>
					</div>

					{/* Contact Button (hidden on mobile) */}
					<div className="hidden md:block">
						<Button asChild className="rounded-full" variant={"outline"}>
							<a href="/contact">Contact Us</a>
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<button
				aria-label="Close menu"
				className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden ${
					isOpen ? "block" : "hidden"
				} ${isInitialRender ? "hidden" : ""}`}
				onClick={closeMobileMenu}
				ref={overlayRef as React.MutableRefObject<HTMLButtonElement | null>}
				type="button"
			/>

			{/* Mobile Menu */}
			<div
				className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl md:hidden ${
					isOpen ? "block" : "pointer-events-none invisible opacity-0"
				} ${isInitialRender ? "hidden" : ""}`}
				ref={mobileMenuRef}
			>
				{/* Mobile Menu Close Button */}
				<div className="absolute top-6 right-6" ref={closeButtonRef}>
					<Button
						aria-label="Close menu"
						className="size-10"
						onClick={closeMobileMenu}
						size="icon"
						variant={"ghost"}
					>
						<X className="h-6 w-6" />
					</Button>
				</div>

				<div className="px-6 pt-24">
					<div
						className="space-y-1"
						ref={(el) => {
							if (el) {
								menuItemsRef.current[0] = el;
							}
						}}
					>
						{menuItems.map((item, index) => (
							<div
								key={item.to}
								ref={(el) => {
									if (el) {
										menuItemsRef.current[index + 1] = el;
									}
								}}
							>
								<Link
									activeOptions={{ exact: true }}
									activeProps={{
										className:
											"font-bold text-primary border-primary underline",
									}}
									className="block border-gray-100 border-b py-3 font-semibold text-base transition-colors hover:text-primary"
									onClick={closeMobileMenu}
									to={item.to}
								>
									{item.name}
								</Link>
							</div>
						))}

						<div className="mt-8 pt-4">
							<Button
								asChild
								className="w-full rounded-full"
								variant={"default"}
							>
								<a href="/contact" onClick={closeMobileMenu}>
									Contact Us
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default NavMenu;
