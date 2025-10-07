import type { SanityDocument } from "@sanity/client";
import { format } from "date-fns";
import { CheckCircle, Star } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";

const sourceIcons: Record<string, string> = {
	google: "🔍",
	tripadvisor: "🦉",
	booking: "📅",
	facebook: "👥",
	yelp: "💬",
	website: "🌐",
	email: "✉️",
	other: "⭐",
};

const sourceNames: Record<string, string> = {
	google: "Google Reviews",
	tripadvisor: "TripAdvisor",
	booking: "Booking.com",
	facebook: "Facebook",
	yelp: "Yelp",
	website: "Website",
	email: "Email",
	other: "Other",
};

export const ReviewCard = ({ review }: { review: SanityDocument }) => {
	const renderStars = (rating: number) => (
		<div className="flex gap-1">
			{new Array(5).fill(0).map((_, index) => (
				<Star
					className={`size-4 ${
						index < rating
							? "fill-yellow-400 text-yellow-400"
							: "fill-gray-200 text-gray-200"
					}`}
					key={`star-${index}-${rating}`}
				/>
			))}
		</div>
	);

	return (
		<div className="flex h-[300px] flex-col rounded-2xl border-1 bg-white p-6 shadow-none">
			{/* Header */}
			<div className="mb-4 flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center gap-2">
						<h3 className="font-semibold text-lg">{review.reviewerName}</h3>
						{review.isVerified && (
							<CheckCircle className="size-4 text-green-600" />
						)}
					</div>
					{renderStars(review.rating)}
				</div>
			</div>

			{/* Review Body */}
			<div className="mb-4 flex-1 overflow-hidden text-gray-600 text-sm leading-relaxed">
				"{review.reviewBody}"
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between border-t pt-4 text-gray-500 text-xs">
				<div className="flex items-center gap-1">
					<span>{sourceIcons[review.source]}</span>
					<span>{sourceNames[review.source]}</span>
				</div>
				<span>{format(new Date(review.reviewDate), "MMM dd, yyyy")}</span>
			</div>
		</div>
	);
};
