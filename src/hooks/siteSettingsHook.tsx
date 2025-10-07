import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/client";

// Type definitions matching the Sanity schema
type ContactInfo = {
	phone?: string;
	email?: string;
	address?: string;
	businessHours?: string;
};

type SocialMedia = {
	facebook?: string;
	twitter?: string;
	instagram?: string;
	linkedin?: string;
	youtube?: string;
	tiktok?: string;
	whatsapp?: string;
};

type SeoSettings = {
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string[];
	ogImage?: SanityImageSource;
	twitterUsername?: string;
	twitterSite?: string;
	ogType?: "website" | "article" | "product" | "business.business";
	twitterCardType?: "summary" | "summary_large_image" | "app" | "player";
};

type MaintenanceMode = {
	isEnabled?: boolean;
	message?: string;
	estimatedCompletion?: string;
};

type Analytics = {
	googleAnalyticsId?: string;
	facebookPixelId?: string;
	googleTagManagerId?: string;
};

type LogoImage = {
	asset?: {
		_ref: string;
		_type: string;
	};
	alt?: string;
	hotspot?: {
		x: number;
		y: number;
		height: number;
		width: number;
	};
};

export type SiteSettings = {
	_id: string;
	_type: "siteSettings";
	_createdAt: string;
	_updatedAt: string;
	_rev: string;
	title: string;
	description: string;
	logo: LogoImage;
	favicon?: SanityImageSource;
	tagline?: string;
	contactInfo?: ContactInfo;
	socialMedia?: SocialMedia;
	seo?: SeoSettings;
	maintenance?: MaintenanceMode;
	analytics?: Analytics;
};

// Sanity query to fetch site settings
const fetchSiteSettingsQuery = `*[_type == "siteSettings"][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  description,
  logo{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  },
  favicon{
    asset->{
      _id,
      url
    }
  },
  tagline,
  contactInfo{
    phone,
    email,
    address,
    businessHours
  },
  socialMedia{
    facebook,
    twitter,
    instagram,
    linkedin,
    youtube,
    tiktok,
    whatsapp
  },
  seo{
    metaTitle,
    metaDescription,
    keywords,
    ogImage{
      asset->{
        _id,
        url
      }
    },
    twitterUsername,
    twitterSite,
    ogType,
    twitterCardType
  },
  maintenance{
    isEnabled,
    message,
    estimatedCompletion
  },
  analytics{
    googleAnalyticsId,
    facebookPixelId,
    googleTagManagerId
  }
}`;

// Fetch function
const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
	const data = await client.fetch<SiteSettings>(fetchSiteSettingsQuery);
	return data;
};

// Hook
export const useSiteSettings = () => {
	return useQuery({
		queryKey: ["siteSettings"],
		queryFn: fetchSiteSettings,
		staleTime: 1000 * 60 * 60, // 1 hour - site settings don't change often
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchOnWindowFocus: false,
	});
};

// Helper hooks for specific settings sections
export const useContactInfo = () => {
	const { data: settings, ...rest } = useSiteSettings();
	return {
		contactInfo: settings?.contactInfo,
		...rest,
	};
};

export const useSocialMedia = () => {
	const { data: settings, ...rest } = useSiteSettings();
	return {
		socialMedia: settings?.socialMedia,
		...rest,
	};
};

export const useSeoSettings = () => {
	const { data: settings, ...rest } = useSiteSettings();
	return {
		seo: settings?.seo,
		...rest,
	};
};

export const useMaintenanceMode = () => {
	const { data: settings, ...rest } = useSiteSettings();
	return {
		maintenance: settings?.maintenance,
		isMaintenanceMode: settings?.maintenance?.isEnabled ?? false,
		...rest,
	};
};

export const maintenanceQuery = queryOptions({
	queryKey: ["siteSettings", "maintenance"],
	queryFn: fetchSiteSettings,
	staleTime: 1000 * 60 * 5, // 5 minutes
	refetchOnWindowFocus: true,
	select: (data) => data?.maintenance,
});

export const useAnalytics = () => {
	const { data: settings, ...rest } = useSiteSettings();
	return {
		analytics: settings?.analytics,
		...rest,
	};
};

// Helper function to get logo URL
export const getLogoUrl = (
	settings: SiteSettings | null | undefined
): string | null => {
	if (!settings?.logo?.asset) {
		return null;
	}
	// @ts-expect-error - Sanity asset URL structure
	return settings.logo.asset.url || null;
};

export const settingsQuery = queryOptions({
	queryKey: ["siteSettings"],
	queryFn: fetchSiteSettings,
	staleTime: 1000 * 60 * 60 * 24, // 1 hour
	refetchOnWindowFocus: false,
});

// Helper function to get favicon URL
export const getFaviconUrl = (
	settings: SiteSettings | null | undefined
): string | null => {
	if (!settings?.favicon) {
		return null;
	}
	// @ts-expect-error - Sanity asset URL structure
	return settings.favicon.asset?.url || null;
};
