import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const BLOGS_QUERY = `*[
    _type == "blog"
    && defined(slug.current)
  ]|order(publishedAt desc){
_id, 
title, 
slug,
body, 
publishedAt, 
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
}`; // Fetched image instead of mainImage, removed excerpt

export const fetchBlogsQuery = queryOptions({
	queryKey: ["blogs"],
	queryFn: async () => {
		try {
			const blogs = await client.fetch<SanityDocument[]>(BLOGS_QUERY, {});
			return blogs || [];
		} catch (_error) {
			return [];
		}
	},
});

const SINGLE_BLOG_QUERY = `*[
    _type == "blog"
    && slug.current == $slug
  ][0]{
_id, 
title, 
slug, 
publishedAt, 
  "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
body 
}`;

export const fetchSingleBlogQuery = (slug: string) =>
	queryOptions({
		queryKey: ["blog", slug],
		queryFn: async () => {
			const blog = await client.fetch<SanityDocument>(SINGLE_BLOG_QUERY, {
				slug,
			});
			return blog || null;
		},
		enabled: !!slug,
	});
