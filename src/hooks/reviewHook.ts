import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

export const fetchReviewsQuery = queryOptions({
	queryKey: ["reviews"],
	queryFn: async () => {
		const reviews = await client.fetch(
			`*[_type == "review"] | order(reviewDate desc, rating desc) [0...12] {
        _id,
        reviewerName,
        rating,
        reviewBody,
        reviewDate,
        source,
        isVerified,
        keywords
      }`
		);
		return reviews;
	},
});
