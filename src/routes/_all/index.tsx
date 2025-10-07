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

export const Route = createFileRoute("/_all/")({
	component: RouteComponent,
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
