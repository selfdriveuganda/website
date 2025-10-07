import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchSingleBlogQuery } from "@/hooks/blogHook";
import { client } from "@/sanity/client";
import { BLOG_QUERY } from "@/sanity/queries";

export const Route = createFileRoute("/_all/blogs/$blogSlug")({
	component: RouteComponent,
	loader: async ({ params, context: { queryClient } }) => {
		// Simulate fetching blog data based on the blogSlug parameter
		const { blogSlug } = params;

		await queryClient.ensureQueryData(fetchSingleBlogQuery(blogSlug));

		const { projectId, dataset } = client.config();
		const urlFor = (source: SanityImageSource) =>
			projectId && dataset
				? imageUrlBuilder({ projectId, dataset }).image(source)
				: null;
		// Here you would typically fetch data from an API or database
		const blog = await client.fetch(BLOG_QUERY, { slug: blogSlug });

		if (!blog) {
			throw notFound();
		}

		const blogImageUrl = blog.image
			? urlFor(blog.image)?.width(550).height(310).url()
			: null;

		// For this example, we'll return a mock object
		return {
			blog: {
				...blog,
				imageUrl: blogImageUrl,
			},
		};
	},
});

function RouteComponent() {
	// const { blog } = Route.useLoaderData();
	// console.log("Blog in component:", JSON.stringify(blog, null, 2));
	const { blogSlug } = Route.useParams();

	const { data: blog } = useSuspenseQuery(fetchSingleBlogQuery(blogSlug));

	return (
		<div>
			Hello "/blogs/$blogSlug"! {blog.title}
		</div>
	);
}
