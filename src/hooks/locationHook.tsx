import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const ALL_LOCATIONS_QUERY = `*[
    _type == "location"
    && status == "active"
  ]|order(name asc){
_id,
name,
locationType,
address{
  street,
  city,
  state,
  country
},
coordinates,
contact{
  phone,
  email
},
amenities,
images[]{
  "url": asset->url,
  "alt": alt
},
status,
notes
}`;

const LOCATIONS_BY_TYPE_QUERY = `*[
    _type == "location"
    && status == "active"
    && locationType == $locationType
  ]|order(name asc){
_id,
name,
locationType,
address{
  street,
  city,
  state,
  country
},
coordinates,
contact{
  phone,
  email
},
amenities,
images[]{
  "url": asset->url,
  "alt": alt
},
status,
notes
}`;

const LOCATIONS_BY_COUNTRY_QUERY = `*[
    _type == "location"
    && status == "active"
    && address.country == $country
  ]|order(name asc){
_id,
name,
locationType,
address{
  street,
  city,
  state,
  country
},
coordinates,
contact{
  phone,
  email
},
amenities,
images[]{
  "url": asset->url,
  "alt": alt
},
status,
notes
}`;

const SINGLE_LOCATION_QUERY = `*[
    _type == "location"
    && _id == $locationId
  ][0]{
_id,
name,
locationType,
address{
  street,
  city,
  state,
  country
},
coordinates,
contact{
  phone,
  email
},
amenities,
images[]{
  "url": asset->url,
  "alt": alt
},
status,
notes
}`;

// Fetch all active locations
export const fetchAllLocationsQuery = queryOptions({
	queryKey: ["all-locations"],
	queryFn: async () => {
		try {
			const locations = await client.fetch<SanityDocument[]>(
				ALL_LOCATIONS_QUERY,
				{}
			);
			return locations || [];
		} catch (_error) {
			return [];
		}
	},
});

// Fetch locations by type (airport, hotel, office, etc.)
export const fetchLocationsByTypeQuery = (locationType: string) =>
	queryOptions({
		queryKey: ["locations", "type", locationType],
		queryFn: async () => {
			try {
				const locations = await client.fetch<SanityDocument[]>(
					LOCATIONS_BY_TYPE_QUERY,
					{
						locationType,
					}
				);
				return locations || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!locationType,
	});

// Fetch locations by country
export const fetchLocationsByCountryQuery = (country: string) =>
	queryOptions({
		queryKey: ["locations", "country", country],
		queryFn: async () => {
			try {
				const locations = await client.fetch<SanityDocument[]>(
					LOCATIONS_BY_COUNTRY_QUERY,
					{
						country,
					}
				);
				return locations || [];
			} catch (_error) {
				return [];
			}
		},
		enabled: !!country,
	});

// Fetch single location by ID
export const fetchSingleLocationQuery = (locationId: string) =>
	queryOptions({
		queryKey: ["location", locationId],
		queryFn: async () => {
			try {
				const location = await client.fetch<SanityDocument>(
					SINGLE_LOCATION_QUERY,
					{
						locationId,
					}
				);
				return location;
			} catch (_error) {
				return null;
			}
		},
		enabled: !!locationId,
	});

// Helper queries for specific location types
export const fetchAirportsQuery = queryOptions({
	queryKey: ["locations", "airports"],
	queryFn: async () => {
		try {
			const locations = await client.fetch<SanityDocument[]>(
				LOCATIONS_BY_TYPE_QUERY,
				{
					locationType: "airport",
				}
			);
			return locations || [];
		} catch (_error) {
			return [];
		}
	},
});

export const fetchHotelsQuery = queryOptions({
	queryKey: ["locations", "hotels"],
	queryFn: async () => {
		try {
			const locations = await client.fetch<SanityDocument[]>(
				LOCATIONS_BY_TYPE_QUERY,
				{
					locationType: "hotel",
				}
			);
			return locations || [];
		} catch (_error) {
			return [];
		}
	},
});

export const fetchOfficesQuery = queryOptions({
	queryKey: ["locations", "offices"],
	queryFn: async () => {
		try {
			const locations = await client.fetch<SanityDocument[]>(
				LOCATIONS_BY_TYPE_QUERY,
				{
					locationType: "office",
				}
			);
			return locations || [];
		} catch (_error) {
			return [];
		}
	},
});

export const fetchTouristAttractionsQuery = queryOptions({
	queryKey: ["locations", "tourist-attractions"],
	queryFn: async () => {
		try {
			const locations = await client.fetch<SanityDocument[]>(
				LOCATIONS_BY_TYPE_QUERY,
				{
					locationType: "tourist_attraction",
				}
			);
			return locations || [];
		} catch (_error) {
			return [];
		}
	},
});
