import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
	projectId: "u018kops",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

// Enhanced image URL function with WebP support and optimization
export function urlForWebP(
	source: SanityImageSource,
	width?: number,
	height?: number
) {
	let imageBuilder = builder.image(source).format("webp").quality(85);

	if (width) {
		imageBuilder = imageBuilder.width(width);
	}

	if (height) {
		imageBuilder = imageBuilder.height(height);
	}

	return imageBuilder;
}

// Generate optimized image URLs with fallback
export function getOptimizedImageUrl(
	source: SanityImageSource,
	width?: number,
	height?: number
) {
	const webpUrl = urlForWebP(source, width, height).url();
	const fallbackUrl = urlFor(source).url();

	return {
		webp: webpUrl,
		fallback: fallbackUrl,
	};
}
