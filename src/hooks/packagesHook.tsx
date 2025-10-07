import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const ALL_PACKAGES_QUERY = `*[
    _type == "packageType"
    && defined(slug.current)
  ]|order(name asc){
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
features,
destination->{
  _id,
  name,
  slug,
  location{
    country,
    region
  }
},
images[0]{
  asset: image.asset,
  "url": image.asset->url,
  alt,
  caption
},
recommendedCars[]->{
  _id,
  name,
  "slug": slug.current,
  price_per_day,
  price_per_day_with_driver,
  "images": images[]{
    "url": asset->url,
    "alt": alt
  }
}
}`;

export const fetchAllPackagesQuery = queryOptions({
	queryKey: ["all-packages"],
	queryFn: async () => {
		try {
			const packages = await client.fetch<SanityDocument[]>(
				ALL_PACKAGES_QUERY,
				{}
			);
			return packages || [];
		} catch (_error) {
			return [];
		}
	},
});

const PACKAGES_BY_DESTINATION_QUERY = `*[
    _type == "packageType"
    && defined(slug.current)
    && destination->slug.current == $destinationSlug
  ]|order(name asc){
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
features,
images[0]{
  "url": image.asset->url,
  alt,
  caption
},
recommendedCars[]->{
  _id,
  name,
  "slug": slug.current,
  price_per_day,
  price_per_day_with_driver,
  "images": images[]{
    "url": asset->url,
    "alt": alt
  }
}
}`;

export const fetchPackagesByDestinationQuery = (destinationSlug: string) =>
	queryOptions({
		queryKey: ["packages", "destination", destinationSlug],
		queryFn: async () => {
			try {
				const packages = await client.fetch<SanityDocument[]>(
					PACKAGES_BY_DESTINATION_QUERY,
					{
						destinationSlug,
					}
				);
				return packages || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!destinationSlug,
	});

const PACKAGES_BY_DIFFICULTY_QUERY = `*[
    _type == "packageType"
    && defined(slug.current)
    && difficulty == $difficulty
  ]|order(name asc){
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
destination->{
  _id,
  name,
  location{
    country
  }
},
images[0]{
  "url": image.asset->url,
  alt,
  caption
}
}`;

export const fetchPackagesByDifficultyQuery = (difficulty: string) =>
	queryOptions({
		queryKey: ["packages", "difficulty", difficulty],
		queryFn: async () => {
			try {
				const packages = await client.fetch<SanityDocument[]>(
					PACKAGES_BY_DIFFICULTY_QUERY,
					{
						difficulty,
					}
				);
				return packages || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!difficulty,
	});

const PACKAGES_BY_DURATION_QUERY = `*[
    _type == "packageType"
    && defined(slug.current)
    && duration >= $minDuration
    && duration <= $maxDuration
  ]|order(duration asc, name asc){
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
destination->{
  _id,
  name,
  location{
    country
  }
},
images[0]{
  "url": image.asset->url,
  alt,
  caption
}
}`;

export const fetchPackagesByDurationQuery = (
	minDuration: number,
	maxDuration: number
) =>
	queryOptions({
		queryKey: ["packages", "duration", minDuration, maxDuration],
		queryFn: async () => {
			try {
				const packages = await client.fetch<SanityDocument[]>(
					PACKAGES_BY_DURATION_QUERY,
					{
						minDuration,
						maxDuration,
					}
				);
				return packages || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!(minDuration && maxDuration),
	});

const SINGLE_PACKAGE_QUERY = `*[
    _type == "packageType"
    && slug.current == $slug
  ][0]{
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
features,
destination->{
  _id,
  name,
  slug,
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
  }
},
images[]{
  "url": image.asset->url,
  alt,
  caption
},
travelTips{
  bestTimeToVisit{
    season,
    weather,
    crowds
  },
  safetyTips[]{
    key,
    value
  }
},
recommendedCars[]->{
  _id,
  name,
  "slug": slug.current,
  about,
  price_per_day,
  price_per_day_with_driver,
  "images": images[]{
    "url": asset->url,
    "alt": alt
  },
  specifications[]{
    label,
    value,
    category,
    icon
  },
  "categories": categories[]->{
    _id,
    category,
    "slug": slug.current
  }
}
}`;

export const fetchSinglePackageQuery = (slug: string) =>
	queryOptions({
		queryKey: ["package", slug],
		queryFn: async () => {
			const packageData = await client.fetch<SanityDocument>(
				SINGLE_PACKAGE_QUERY,
				{
					slug,
				}
			);
			return packageData || null;
		},
		enabled: !!slug,
	});

const PACKAGES_BY_TARGET_AUDIENCE_QUERY = `*[
    _type == "packageType"
    && defined(slug.current)
    && $targetAudience in targetAudience
  ]|order(name asc){
_id,
name,
slug,
description,
duration,
difficulty,
targetAudience,
destination->{
  _id,
  name,
  location{
    country
  }
},
images[0]{
  "url": image.asset->url,
  alt,
  caption
}
}`;

export const fetchPackagesByTargetAudienceQuery = (targetAudience: string) =>
	queryOptions({
		queryKey: ["packages", "target-audience", targetAudience],
		queryFn: async () => {
			try {
				const packages = await client.fetch<SanityDocument[]>(
					PACKAGES_BY_TARGET_AUDIENCE_QUERY,
					{
						targetAudience,
					}
				);
				return packages || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!targetAudience,
	});
