import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import LoadingComponent from "@/components/common/LoadingComponent";
import BlogSection from "@/components/home/Blogs";
import BookingSteps from "@/components/home/BookingSteps";
import ExploreVehicles from "@/components/home/ExploreVehicles";
import HeroSection from "@/components/home/HeroSection";
import ReadyToBook from "@/components/home/ReadyToBook";
import ReviewsSection from "@/components/home/Reviews";
import { fetchBlogsQuery } from "@/hooks/blogHook";
import { fetchCarCategoriesQuery } from "@/hooks/carsHook";
import { fetchReviewsQuery } from "@/hooks/reviewHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			...seo({
				title:
					"Self Drive 4x4 Uganda | Rent a Car in Uganda | Car Rental Uganda",
				description:
					"Discover Uganda with Self Drive 4x4. Rent premium 4x4 vehicles for self-drive adventures across Uganda. Affordable rates, comprehensive insurance, unlimited mileage, and 24/7 support. Book your safari car today!",
				keywords: [
					"car rental Uganda",
					"self drive Uganda",
					"4x4 car rental",
					"Uganda safari cars",
					"rent a car Kampala",
					"Uganda road trip",
					"self drive safari Uganda",
					"4x4 rental Entebbe",
					"Uganda car hire",
					"Land Cruiser rental Uganda",
					"Rav4 rental Uganda",
					"budget car rental Uganda",
					"Uganda 4x4 vehicles",
					"self drive car hire Uganda",
					"Uganda tourism car rental",
				],
				type: "website",
				url: "https://selfdrive4x4uganda.com",
				siteName: "Self Drive 4x4 Uganda",
			}),
		],
		scripts: [
			// Structured Data for Local Business
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					"@id": "https://selfdrive4x4uganda.com",
					name: "Self Drive 4x4 Uganda",
					description:
						"Premium car rental service specializing in 4x4 vehicles for self-drive adventures across Uganda",
					url: "https://selfdrive4x4uganda.com",
					telephone: "+256 774 873278",
					email: "info@selfdrive4x4uganda.com",
					address: {
						"@type": "PostalAddress",
						streetAddress: "Najja Shopping Center, Entebbe Road",
						addressLocality: "Kampala",
						addressCountry: "UG",
					},
					geo: {
						"@type": "GeoCoordinates",
						latitude: "0.3136",
						longitude: "32.5811",
					},
					openingHoursSpecification: {
						"@type": "OpeningHoursSpecification",
						dayOfWeek: [
							"Monday",
							"Tuesday",
							"Wednesday",
							"Thursday",
							"Friday",
							"Saturday",
							"Sunday",
						],
						opens: "08:00",
						closes: "18:00",
					},
					sameAs: [
						"https://www.facebook.com/selfdrive4x4uganda",
						"https://www.instagram.com/selfdrive4x4uganda",
						"https://twitter.com/selfdrive4x4ug",
					],
					priceRange: "$$",
					areaServed: {
						"@type": "Country",
						name: "Uganda",
					},
					hasOfferCatalog: {
						"@type": "OfferCatalog",
						name: "Car Rental Services",
						itemListElement: [
							{
								"@type": "Offer",
								itemOffered: {
									"@type": "Product",
									name: "4x4 Vehicle Rental",
									description: "Premium 4x4 vehicles for self-drive adventures",
								},
							},
							{
								"@type": "Offer",
								itemOffered: {
									"@type": "Product",
									name: "Safari Car Rental",
									description: "Safari-equipped vehicles with camping gear",
								},
							},
						],
					},
				}),
			},
			// Structured Data for Website
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "Self Drive 4x4 Uganda",
					url: "https://selfdrive4x4uganda.com",
					description:
						"Rent premium 4x4 vehicles for self-drive adventures across Uganda",
					potentialAction: {
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate:
								"https://selfdrive4x4uganda.com/cars?search={search_term_string}",
						},
						"query-input": "required name=search_term_string",
					},
				}),
			},
			// Structured Data for Organization
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Organization",
					name: "Self Drive 4x4 Uganda",
					url: "https://selfdrive4x4uganda.com",
					logo: "https://selfdrive4x4uganda.com/logo.png",
					contactPoint: {
						"@type": "ContactPoint",
						telephone: "+256-774-873278",
						contactType: "customer service",
						areaServed: "UG",
						availableLanguage: ["English"],
					},
					sameAs: [
						"https://www.facebook.com/selfdrive4x4uganda",
						"https://www.instagram.com/selfdrive4x4uganda",
						"https://twitter.com/selfdrive4x4ug",
					],
				}),
			},
		],
	}),
	beforeLoad: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(fetchCarCategoriesQuery);
		queryClient.ensureQueryData(fetchBlogsQuery);
		queryClient.ensureQueryData(fetchReviewsQuery);
	},
});

function RouteComponent() {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<HomePage />
		</Suspense>
	);
}

function HomePage() {
	return (
		<div>
			<HeroSection />
			<div className="space-y-16 pt-16">
				<BookingSteps />
				<ExploreVehicles />
				<BlogSection />
				<ReviewsSection />
				<ReadyToBook />
			</div>
		</div>
	);
}
