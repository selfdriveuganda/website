import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BlogPostCard } from "@/components/blogs/BlogPostCard";
import CommonPageHero from "@/components/common/CommonPageHero";
import { fetchBlogsQuery } from "@/hooks/blogHook";

export const Route = createFileRoute("/_all/blogs/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(fetchBlogsQuery);
	},
});

function RouteComponent() {
	const { data: blogs } = useSuspenseQuery(fetchBlogsQuery);

	return (
		<div className="typography">
			<div className="container mx-auto px-4 py-1 sm:px-6 sm:py-10 md:mt-10 md:py-12 md:pt-16">
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
					<h5 className="text-lg sm:text-xl md:text-2xl">
						Explore more blog posts
					</h5>
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
