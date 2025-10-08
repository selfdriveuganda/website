import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BlogPostCard } from "@/components/blogs/BlogPostCard";
import CommonPageHero from "@/components/common/CommonPageHero";
import { fetchBlogsQuery } from "@/hooks/blogHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/blogs/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			...seo({
				title: "Travel Blog & Safari Tips | Self Drive 4x4 Uganda",
				description:
					"Read our Uganda travel blog for safari tips, destination guides, road trip advice, and self-drive experiences. Get expert insights for your Uganda adventure.",
				keywords: [
					"Uganda travel blog",
					"safari tips Uganda",
					"self drive blog",
					"Uganda travel guide",
					"road trip Uganda",
					"Uganda safari advice",
					"travel tips Uganda",
					"4x4 adventure stories",
				],
			}),
		],
	}),
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchBlogsQuery);
	},
});

function RouteComponent() {
	const { data: blogs } = useSuspenseQuery(fetchBlogsQuery);

	return (
		<div className="typography pt-20">
			<div className="container mx-auto">
				<CommonPageHero
					{...{
						title: "Latest Blogs",
						description:
							"Discover our collection of articles covering insights, tips, and interesting reads on various topics. Stay updated with the latest trends and information that matter to you.",
					}}
				/>
			</div>

			{/* blogs list */}
			<div className="container mx-auto px-4 pt-8 sm:px-6 sm:pt-12 md:pt-16">
				<div className="mb-6 space-y-2 sm:mb-8 md:mb-12">
					<h2 className="">Explore more blog posts</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
					{blogs.map((blog) => (
						<div className="flex w-full justify-center" key={blog.id}>
							<BlogPostCard blog={blog} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
