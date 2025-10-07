type SeoProps = {
	title?: string;
	description?: string;
	keywords?: string | string[];
	image?: string;
	url?: string;
	type?: "website" | "article" | "product" | "business.business";
	twitterCard?: "summary" | "summary_large_image" | "app" | "player";
	twitterCreator?: string;
	twitterSite?: string;
	author?: string;
	locale?: string;
	siteName?: string;
};

const DEFAULT_SEO = {
	title: "Self Drive 4x4 Uganda | Rent a Car in Uganda | Car Rental Uganda",
	description:
		"Discover Uganda with Self Drive 4x4. Rent premium 4x4 vehicles for self-drive adventures. Affordable rates, full insurance, unlimited mileage. Book your safari car today!",
	keywords: [
		"car rental Uganda",
		"self drive Uganda",
		"4x4 car rental",
		"Uganda safari cars",
		"rent a car Kampala",
		"Uganda road trip",
		"self drive safari Uganda",
		"4x4 rental Entebbe",
		"Uganda car hire",
		"Land Cruiser rental Uganda",
		"Rav4 rental Uganda",
		"budget car rental Uganda",
	],
	siteName: "Self Drive 4x4 Uganda",
	locale: "en_UG",
	type: "website" as const,
	twitterCard: "summary_large_image" as const,
};

export const seo = ({
	title,
	description,
	keywords,
	image,
	url,
	type = "website",
	twitterCard = "summary_large_image",
	twitterCreator,
	twitterSite,
	author,
	locale = "en_UG",
	siteName,
}: SeoProps = {}) => {
	const seoTitle = title || DEFAULT_SEO.title;
	const seoDescription = description || DEFAULT_SEO.description;
	const seoKeywords = Array.isArray(keywords)
		? keywords.join(", ")
		: keywords || DEFAULT_SEO.keywords.join(", ");
	const seoSiteName = siteName || DEFAULT_SEO.siteName;

	const tags = [
		{ title: seoTitle },
		{ name: "description", content: seoDescription },
		{ name: "keywords", content: seoKeywords },
		{ name: "author", content: author || seoSiteName },

		// Open Graph / Facebook
		{ property: "og:type", content: type },
		{ property: "og:title", content: seoTitle },
		{ property: "og:description", content: seoDescription },
		{ property: "og:site_name", content: seoSiteName },
		{ property: "og:locale", content: locale },
		...(url ? [{ property: "og:url", content: url }] : []),
		...(image
			? [
					{ property: "og:image", content: image },
					{ property: "og:image:alt", content: seoTitle },
					{ property: "og:image:width", content: "1200" },
					{ property: "og:image:height", content: "630" },
				]
			: []),

		// Twitter
		{ name: "twitter:card", content: twitterCard },
		{ name: "twitter:title", content: seoTitle },
		{ name: "twitter:description", content: seoDescription },
		...(twitterCreator
			? [{ name: "twitter:creator", content: twitterCreator }]
			: []),
		...(twitterSite ? [{ name: "twitter:site", content: twitterSite }] : []),
		...(image ? [{ name: "twitter:image", content: image }] : []),

		// Additional SEO tags
		{ name: "robots", content: "index, follow, max-image-preview:large" },
		{ name: "googlebot", content: "index, follow" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ name: "format-detection", content: "telephone=no" },
		{ httpEquiv: "x-ua-compatible", content: "ie=edge" },
	];

	return tags.filter((tag) => tag.content !== undefined);
};
