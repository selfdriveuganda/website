import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const CAR_CATEGORIES_QUERY = `
  *[_type == "carCategory"] | order(category asc) {
    _id,
    category,
    "slug": slug.current,
    description
  }
`;

const CARS_QUERY = `
  *[_type == "car"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    price_per_day,
    price_per_day_with_driver,
    about,
    specifications[]{
      label,
      value,
      category,
      icon
    },
    availability,
    nextAvailableDate,
    "categories": categories[]->{
      _id,
      category,
      "slug": slug.current,
      description
    },
    protectionPlans[]{
      name,
      price,
      description,
      isIncluded,
      deductible
    }
  }
`;

const SINGLE_CAR_QUERY = `
  *[_type == "car" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    about,
    price_per_day,
    price_per_day_with_driver,
    specifications[]{
      label,
      value,
      category,
      icon
    },
    availability,
    nextAvailableDate,
    "categories": categories[]->{
      _id,
      category,
      "slug": slug.current,
      description
    },
    protectionPlans[]{
      name,
      price,
      description,
      isIncluded,
      deductible
    }
  }
`;

const CARS_BY_CATEGORY_QUERY = `
  *[_type == "car" && references(*[_type == "carCategory" && slug.current == $categorySlug]._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    price_per_day,
    price_per_day_with_driver,
    about,
    specifications[]{
      label,
      value,
      category,
      icon
    },
    availability,
    nextAvailableDate,
    "categories": categories[]->{
      _id,
      category,
      "slug": slug.current,
      description
    },
    protectionPlans[]{
      name,
      price,
      description,
      isIncluded,
      deductible
    }
  }
`;

const AVAILABLE_CARS_QUERY = `
  *[_type == "car" && availability == "available"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    price_per_day,
    price_per_day_with_driver,
    about,
    specifications[]{
      label,
      value,
      category,
      icon
    },
    availability,
    nextAvailableDate,
    "categories": categories[]->{
      _id,
      category,
      "slug": slug.current,
      description
    },
    protectionPlans[]{
      name,
      price,
      description,
      isIncluded,
      deductible
    }
  }
`;

const CARS_BY_AVAILABILITY_QUERY = `
  *[_type == "car" && availability == $availability] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "images": images[]{
      asset,
      "url": asset->url,
      "alt": alt,
      "caption": caption
    },
    price_per_day,
    price_per_day_with_driver,
    about,
    specifications[]{
      label,
      value,
      category,
      icon
    },
    availability,
    nextAvailableDate,
    "categories": categories[]->{
      _id,
      category,
      "slug": slug.current,
      description
    },
    protectionPlans[]{
      name,
      price,
      description,
      isIncluded,
      deductible
    }
  }
`;

export const fetchCarCategoriesQuery = queryOptions({
	queryKey: ["car_categories"],
	queryFn: async () => {
		try {
			return await client.fetch<SanityDocument[]>(CAR_CATEGORIES_QUERY);
		} catch (_error) {
			return [];
		}
	},
});

export const fetchCarsQuery = queryOptions({
	queryKey: ["cars"],
	queryFn: async () => {
		try {
			return await client.fetch<SanityDocument[]>(CARS_QUERY);
		} catch (_error) {
			return [];
		}
	},
});

export const fetchSingleCarQuery = (slug: string) =>
	queryOptions({
		queryKey: ["car", slug],
		queryFn: async () => {
			console.log("Fetching car with slug:", slug);

			try {
				return await client.fetch<SanityDocument | null>(SINGLE_CAR_QUERY, {
					slug,
				});
			} catch (_error) {
				return null;
			}
		},
	});

export const fetchCarsByCategoryQuery = (categorySlug: string) =>
	queryOptions({
		queryKey: ["cars", "category", categorySlug],
		queryFn: async () => {
			try {
				// If no categorySlug provided, return all cars
				if (!categorySlug || categorySlug.trim() === "") {
					return await client.fetch<SanityDocument[]>(CARS_QUERY);
				}

				return await client.fetch<SanityDocument[]>(CARS_BY_CATEGORY_QUERY, {
					categorySlug,
				});
			} catch (_error) {
				return [];
			}
		},
	});

export const fetchAvailableCarsQuery = queryOptions({
	queryKey: ["cars", "available"],
	queryFn: async () => {
		try {
			return await client.fetch<SanityDocument[]>(AVAILABLE_CARS_QUERY);
		} catch (_error) {
			return [];
		}
	},
});

export const fetchCarsByAvailabilityQuery = (availability: string) =>
	queryOptions({
		queryKey: ["cars", "availability", availability],
		queryFn: async () => {
			try {
				return await client.fetch<SanityDocument[]>(
					CARS_BY_AVAILABILITY_QUERY,
					{
						availability,
					}
				);
			} catch (_error) {
				return [];
			}
		},
	});
