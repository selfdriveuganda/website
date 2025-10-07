import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const DESTINATIONS_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
tags,
publishedAt,
updatedAt,
location{
  coordinates,
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
"gallery": gallery[]{
  "url": asset->url,
  "alt": alt,
  "caption": caption
},
whatToDo{
  activities[]{
    name,
    description,
    category,
    duration,
    difficulty,
    bestTime,
    cost{
      amount,
      currency,
      note
    }
  },
  mustSeeAttractions,
  hiddenGems
},
seoMetadata{
  metaTitle,
  metaDescription,
  keywords
}
}`;

export const fetchDestinationsQuery = queryOptions({
	queryKey: ["destinations"],
	queryFn: async () => {
		try {
			const destinations = await client.fetch<SanityDocument[]>(
				DESTINATIONS_QUERY,
				{}
			);
			return destinations || [];
		} catch (_error) {
			return [];
		}
	},
});

const FEATURED_DESTINATIONS_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
    && featured == true
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
location{
  coordinates,
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
whatToDo{
  mustSeeAttractions,
  hiddenGems
}
}`;

export const fetchFeaturedDestinationsQuery = queryOptions({
	queryKey: ["featured-destinations"],
	queryFn: async () => {
		try {
			const destinations = await client.fetch<SanityDocument[]>(
				FEATURED_DESTINATIONS_QUERY,
				{}
			);
			return destinations || [];
		} catch (_error) {
			return [];
		}
	},
});

const DESTINATIONS_BY_COUNTRY_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
    && location.country == $country
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
location{
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
}
}`;

export const fetchDestinationsByCountryQuery = (country: string) =>
	queryOptions({
		queryKey: ["destinations", "country", country],
		queryFn: async () => {
			try {
				const destinations = await client.fetch<SanityDocument[]>(
					DESTINATIONS_BY_COUNTRY_QUERY,
					{
						country,
					}
				);
				return destinations || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!country,
	});

const SINGLE_DESTINATION_QUERY = `*[
    _type == "destination"
    && slug.current == $slug
  ][0]{
_id, 
name, 
slug,
featured,
description,
tags,
publishedAt,
updatedAt,
location{
  coordinates,
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
"gallery": gallery[]{
  "url": asset->url,
  "alt": alt,
  "caption": caption
},
whatToDo{
  activities[]{
    name,
    description,
    category,
    duration,
    difficulty,
    bestTime,
    cost{
      amount,
      currency,
      note
    }
  },
  mustSeeAttractions,
  hiddenGems
},
seoMetadata{
  metaTitle,
  metaDescription,
  keywords
},
"packageCount": count(*[_type == "packageType" && destination._ref == ^._id && active == true]),
"totalPackageCount": count(*[_type == "packageType" && destination._ref == ^._id])
}`;

export const fetchSingleDestinationQuery = (slug: string) =>
	queryOptions({
		queryKey: ["destination", slug],
		queryFn: async () => {
			const destination = await client.fetch<SanityDocument>(
				SINGLE_DESTINATION_QUERY,
				{
					slug,
				}
			);
			return destination || null;
		},
		enabled: !!slug,
	});

const DESTINATIONS_BY_TAG_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
    && $targetTag in tags[]
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
tags,
location{
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
whatToDo{
  mustSeeAttractions
}
}`;

export const fetchDestinationsByTagQuery = (tag: string) =>
	queryOptions({
		queryKey: ["destinations", "tag", tag],
		queryFn: async () => {
			try {
				const destinations = await client.fetch<SanityDocument[]>(
					DESTINATIONS_BY_TAG_QUERY,
					{ targetTag: tag }
				);
				return destinations || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!tag,
	});

const DESTINATIONS_WITH_PACKAGE_COUNT_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
tags,
location{
  coordinates,
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
"packageCount": count(*[_type == "packageType" && destination._ref == ^._id && active == true]),
"totalPackageCount": count(*[_type == "packageType" && destination._ref == ^._id])
}`;

export const fetchDestinationsWithPackageCountQuery = queryOptions({
	queryKey: ["destinations-with-package-count"],
	queryFn: async () => {
		try {
			const destinations = await client.fetch<SanityDocument[]>(
				DESTINATIONS_WITH_PACKAGE_COUNT_QUERY,
				{}
			);
			return destinations || [];
		} catch (_error) {
			return [];
		}
	},
});

const FEATURED_DESTINATIONS_WITH_PACKAGE_COUNT_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
    && featured == true
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
location{
  coordinates,
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
whatToDo{
  mustSeeAttractions,
  hiddenGems
},
"packageCount": count(*[_type == "packageType" && destination._ref == ^._id && active == true]),
"totalPackageCount": count(*[_type == "packageType" && destination._ref == ^._id])
}`;

export const fetchFeaturedDestinationsWithPackageCountQuery = queryOptions({
	queryKey: ["featured-destinations-with-package-count"],
	queryFn: async () => {
		try {
			const destinations = await client.fetch<SanityDocument[]>(
				FEATURED_DESTINATIONS_WITH_PACKAGE_COUNT_QUERY,
				{}
			);
			return destinations || [];
		} catch (_error) {
			return [];
		}
	},
});

const DESTINATIONS_BY_COUNTRY_WITH_PACKAGE_COUNT_QUERY = `*[
    _type == "destination"
    && defined(slug.current)
    && location.country == $country
  ]|order(name asc){
_id, 
name, 
slug,
featured,
description,
location{
  region,
  country,
  nearestCity
},
"mainImage": mainImage{
  "url": asset->url,
  "alt": alt
},
"packageCount": count(*[_type == "packageType" && destination._ref == ^._id && active == true]),
"totalPackageCount": count(*[_type == "packageType" && destination._ref == ^._id])
}`;

export const fetchDestinationsByCountryWithPackageCountQuery = (
	country: string
) =>
	queryOptions({
		queryKey: ["destinations", "country", country, "with-package-count"],
		queryFn: async () => {
			try {
				const destinations = await client.fetch<SanityDocument[]>(
					DESTINATIONS_BY_COUNTRY_WITH_PACKAGE_COUNT_QUERY,
					{
						country,
					}
				);
				return destinations || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!country,
	});
