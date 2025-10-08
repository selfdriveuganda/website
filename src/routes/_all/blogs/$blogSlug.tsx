import { PortableText } from "@portabletext/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { BlogPostCard } from "@/components/blogs/BlogPostCard";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { fetchBlogsQuery, fetchSingleBlogQuery } from "@/hooks/blogHook";
import { client } from "@/sanity/client";
import { BLOG_QUERY } from "@/sanity/queries";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/blogs/$blogSlug")({
	component: RouteComponent,
	loader: async ({ params, context: { queryClient } }) => {
		const { blogSlug } = params;

		await queryClient.ensureQueryData(fetchSingleBlogQuery(blogSlug));
		await queryClient.ensureQueryData(fetchBlogsQuery);

		const blog = await client.fetch(BLOG_QUERY, { slug: blogSlug });

		if (!blog) {
			throw notFound();
		}

		return { blog };
	},
	head: ({ loaderData }) => {
		const blog = loaderData?.blog;
		return {
			meta: [
				...seo({
					title: blog?.title
						? `${blog.title} | Self Drive 4x4 Uganda Blog`
						: "Blog Post | Self Drive 4x4 Uganda",
					description:
						blog?.excerpt ||
						"Read our latest travel insights and safari tips for Uganda.",
					keywords: [
						"Uganda travel",
						"safari blog",
						"self drive Uganda",
						...(blog?.tags || []),
					],
					image: blog?.images?.[0]?.url,
					type: "article",
				}),
			],
		};
	},
});

function RouteComponent() {
	const { blogSlug } = Route.useParams();
	const { data: blog } = useSuspenseQuery(fetchSingleBlogQuery(blogSlug));
	const { data: allBlogs } = useSuspenseQuery(fetchBlogsQuery);

	// Get related blogs (excluding current blog, limit to 3)
	const relatedBlogs = allBlogs
		.filter((b) => b.slug.current !== blogSlug)
		.slice(0, 3);

	// Custom components for PortableText
	const portableTextComponents = {
		block: {
			h1: ({ children }: { children?: React.ReactNode }) => (
				<h1 className="mt-8 mb-6 font-bold text-3xl md:text-4xl">{children}</h1>
			),
			h2: ({ children }: { children?: React.ReactNode }) => (
				<h2 className="mt-6 mb-4 font-bold text-2xl md:text-3xl">{children}</h2>
			),
			h3: ({ children }: { children?: React.ReactNode }) => (
				<h3 className="mt-6 mb-4 font-bold text-xl md:text-2xl">{children}</h3>
			),
			h4: ({ children }: { children?: React.ReactNode }) => (
				<h4 className="mt-4 mb-3 font-semibold text-lg md:text-xl">
					{children}
				</h4>
			),
			normal: ({ children }: { children?: React.ReactNode }) => (
				<p className="mb-4 text-base text-gray-700 leading-relaxed md:text-lg">
					{children}
				</p>
			),
			blockquote: ({ children }: { children?: React.ReactNode }) => (
				<blockquote className="my-6 border-primary border-l-4 pl-6 text-gray-700 italic">
					{children}
				</blockquote>
			),
		},
		list: {
			bullet: ({ children }: { children?: React.ReactNode }) => (
				<ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
			),
			number: ({ children }: { children?: React.ReactNode }) => (
				<ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
			),
		},
		listItem: {
			bullet: ({ children }: { children?: React.ReactNode }) => (
				<li className="text-base text-gray-700 md:text-lg">{children}</li>
			),
			number: ({ children }: { children?: React.ReactNode }) => (
				<li className="text-base text-gray-700 md:text-lg">{children}</li>
			),
		},
		marks: {
			strong: ({ children }: { children?: React.ReactNode }) => (
				<strong className="font-bold">{children}</strong>
			),
			em: ({ children }: { children?: React.ReactNode }) => (
				<em className="italic">{children}</em>
			),
			link: ({
				children,
				value,
			}: {
				children?: React.ReactNode;
				value?: { href: string };
			}) => (
				<a
					className="text-primary underline hover:text-primary/80"
					href={value?.href}
					rel="noopener noreferrer"
					target="_blank"
				>
					{children}
				</a>
			),
		},
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section with Featured Image */}
			<div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
				{blog.images?.[0] && (
					<OptimizedImage
						alt={blog.images[0].alt || blog.title}
						className="h-full w-full object-cover"
						height={800}
						loading="eager"
						source={blog.images[0]}
						width={1920}
					/>
				)}
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl">
					{/* Breadcrumb/Date */}
					<div className="mb-6 flex items-center gap-2 text-gray-600 text-sm">
						<Calendar className="h-4 w-4" />
						<time dateTime={blog.publishedAt}>
							{format(new Date(blog.publishedAt), "dd/MM/yyyy")}
						</time>
					</div>

					{/* Title */}
					<h3 className="mb-8 font-extrabold text-4xl leading-tight md:text-5xl lg:text-6xl">
						{blog.title}
					</h3>

					{/* Blog Content */}
					<article className="prose prose-lg max-w-none">
						{blog.body && (
							<PortableText
								components={portableTextComponents}
								value={blog.body}
							/>
						)}
					</article>
				</div>

				{/* Related Posts Section */}
				{relatedBlogs.length > 0 && (
					<div className="mx-auto mt-16 max-w-7xl">
						<h2 className="mb-8 font-bold text-3xl">Related Posts</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{relatedBlogs.map((relatedBlog) => (
								<BlogPostCard blog={relatedBlog} key={relatedBlog._id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
