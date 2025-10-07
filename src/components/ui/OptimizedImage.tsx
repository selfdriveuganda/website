import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useEffect, useRef, useState } from "react";
import { getOptimizedImageUrl } from "@/sanity/client";

type OptimizedImageProps = {
	source:
		| SanityImageSource
		| {
				url?: string;
				alt?: string;
				asset?: SanityImageSource;
				[key: string]: unknown;
		  }
		| string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	loading?: "lazy" | "eager";
	sizes?: string;
	priority?: boolean;
};

// Helper function to extract image URLs from various source formats
function getImageUrls(
	source: OptimizedImageProps["source"],
	width?: number,
	height?: number
): { webp: string; fallback: string } | null {
	if (!source) {
		return null;
	}

	// Handle string URLs (external images)
	if (typeof source === "string") {
		return {
			webp: source,
			fallback: source,
		};
	}

	// Check if source has a raw asset reference (preferred for Sanity URL builder)
	const hasAssetReference =
		source && typeof source === "object" && "asset" in source && source.asset;
	const hasProcessedUrl =
		source && typeof source === "object" && "url" in source && source.url;

	if (hasAssetReference) {
		// Use the raw asset reference for optimal Sanity image processing
		try {
			return getOptimizedImageUrl(
				(source as { asset: SanityImageSource }).asset,
				width,
				height
			);
		} catch {
			// Fallback to processed URL if asset processing fails
			if (hasProcessedUrl) {
				const existingUrl = (source as { url: string }).url;
				return {
					webp: existingUrl,
					fallback: existingUrl,
				};
			}
			return null;
		}
	}

	if (hasProcessedUrl) {
		// Use the existing URL as fallback
		const existingUrl = (source as { url: string }).url;
		return {
			webp: existingUrl,
			fallback: existingUrl,
		};
	}

	// Try to use as direct Sanity image reference
	try {
		return getOptimizedImageUrl(source as SanityImageSource, width, height);
	} catch {
		return null;
	}
}

export function OptimizedImage({
	source,
	alt,
	width,
	height,
	className = "",
	loading = "lazy",
	sizes,
	priority = false,
}: OptimizedImageProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

	// Check if image is already loaded (e.g., from cache)
	useEffect(() => {
		if (imgRef.current?.complete) {
			setImageLoaded(true);
		}
	}, []);

	if (!source) {
		return (
			<div
				className={`flex items-center justify-center bg-gray-200 ${className}`}
			>
				<span className="text-gray-500 text-sm">No image</span>
			</div>
		);
	}

	const imageUrls = getImageUrls(source, width, height);

	if (!imageUrls) {
		return (
			<div
				className={`flex items-center justify-center bg-gray-200 ${className}`}
			>
				<span className="text-gray-500 text-sm">Invalid image source</span>
			</div>
		);
	}

	const handleLoad = () => {
		setImageLoaded(true);
	};

	const handleError = () => {
		setImageError(true);
		setImageLoaded(true);
	};

	if (imageError) {
		return (
			<div
				className={`flex items-center justify-center bg-gray-200 ${className}`}
			>
				<span className="text-gray-500 text-sm">Failed to load image</span>
			</div>
		);
	}

	return (
		<div className="relative">
			<picture>
				<source srcSet={imageUrls.webp} type="image/webp" />
				<img
					alt={alt}
					className={`transition-opacity duration-300 ${
						imageLoaded ? "opacity-100" : "opacity-0"
					} ${className}`}
					decoding="async"
					height={height}
					loading={priority ? "eager" : loading}
					onError={handleError}
					onLoad={handleLoad}
					ref={imgRef}
					sizes={sizes}
					src={imageUrls.fallback}
					width={width}
				/>
			</picture>
			{!imageLoaded && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
				</div>
			)}
		</div>
	);
}
