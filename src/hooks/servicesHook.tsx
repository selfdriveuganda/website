import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const SERVICES_QUERY = `*[
    _type == "services"
    && defined(slug.current)
    && isActive == true
  ]|order(title asc){
_id, 
title, 
slug,
subtitle,
description,
isActive,
specifics[]{
  title,
  description,
  icon
},
"image": image{
  asset,
  "url": asset->url,
  "alt": alt,
  "caption": caption
}
}`;

export const fetchServicesQuery = queryOptions({
	queryKey: ["services"],
	queryFn: async () => {
		try {
			const services = await client.fetch<SanityDocument[]>(SERVICES_QUERY, {});
			return services || [];
		} catch (_error) {
			return [];
		}
	},
});

const SINGLE_SERVICE_QUERY = `*[
    _type == "services"
    && slug.current == $slug
  ][0]{
_id, 
title, 
slug,
subtitle,
description,
isActive,
specifics[]{
  title,
  description,
  icon
},
"image": image{
  asset,
  "url": asset->url,
  "alt": alt,
  "caption": caption
}
}`;

export const fetchSingleServiceQuery = (slug: string) =>
	queryOptions({
		queryKey: ["service", slug],
		queryFn: async () => {
			const service = await client.fetch<SanityDocument>(SINGLE_SERVICE_QUERY, {
				slug,
			});
			return service || null; // Return null if no service is found
		},
		enabled: !!slug, // Only run query if slug is provided
	});
