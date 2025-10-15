// biome-ignore-all lint/style/useNamingConvention: Pesapal API uses snake_case
/**
 * Pesapal Payment Integration - Server Functions
 * Documentation: https://documenter.getpostman.com/view/6715320/UyxepTv1
 *
 * Note: Pesapal API uses snake_case for property names.
 * These types match the external API exactly.
 *
 * Using TanStack Start server functions to handle Pesapal API calls server-side
 * This avoids CORS issues and keeps credentials secure
 */

import { createServerFn } from "@tanstack/react-start";

// Helper to get environment variables (works in both server and client contexts)
const getEnvVar = (key: string): string | undefined => {
	// Server-side: try multiple sources
	if (typeof process !== "undefined") {
		// Try without VITE_ prefix first (for Cloudflare Workers .dev.vars)
		const directValue = process.env?.[key];
		if (directValue) {
			return directValue;
		}

		// Try with VITE_ prefix (for standard .env files)
		const viteValue = process.env?.[`VITE_${key}`];
		if (viteValue) {
			return viteValue;
		}
	}

	// Client-side: use import.meta.env with VITE_ prefix
	if (typeof import.meta !== "undefined" && import.meta.env) {
		return import.meta.env[`VITE_${key}`] as string | undefined;
	}
};

const PESAPAL_BASE_URL =
	getEnvVar("PESAPAL_BASE_URL") || "https://cybqa.pesapal.com/pesapalv3";

const CONSUMER_KEY = getEnvVar("PESAPAL_CONSUMER_KEY");
const CONSUMER_SECRET = getEnvVar("PESAPAL_CONSUMER_SECRET");

export type PesapalEnvironment = "sandbox" | "live";

// Types - matching Pesapal API structure exactly
export type PesapalAuthResponse = {
	token: string;
	expiryDate: string;
	error: string | null;
	status: string;
	message: string;
};

export type PesapalIPN = {
	url: string;
	ipn_id: string;
	created_date: string;
	ipn_notification_type: string;
	ipn_status: string;
	error: string | null;
	status: string;
};

export type PesapalOrderRequest = {
	id: string; // Unique merchant reference
	currency: string;
	amount: number;
	description: string;
	callback_url: string;
	notification_id: string; // IPN ID
	billing_address: {
		email_address: string;
		phone_number: string;
		country_code: string;
		first_name: string;
		middle_name?: string;
		last_name: string;
		line_1?: string;
		line_2?: string;
		city?: string;
		state?: string;
		postal_code?: string;
		zip_code?: string;
	};
};

export type PesapalOrderResponse = {
	order_tracking_id: string;
	merchant_reference: string;
	redirect_url: string;
	error: string | null;
	status: string;
};

export type PesapalTransactionStatus = {
	payment_method: string;
	amount: number;
	created_date: string;
	confirmation_code: string;
	payment_status_description: string;
	description: string;
	message: string;
	payment_account: string;
	call_back_url: string;
	status_code: number;
	merchant_reference: string;
	payment_status_code: string;
	currency: string;
	error: string | null;
	status: string;
};

/**
 * Get Pesapal OAuth token
 * Server function - runs on server to avoid CORS and protect credentials
 */
export async function getPesapalToken(): Promise<string> {
	"use server";

	// Validate credentials exist
	if (!(CONSUMER_KEY && CONSUMER_SECRET)) {
		throw new Error(
			"Pesapal credentials not configured. Please check environment variables."
		);
	}

	// Trim credentials to remove any whitespace
	const consumerKey = CONSUMER_KEY?.trim();
	const consumerSecret = CONSUMER_SECRET?.trim();

	console.log("Requesting Pesapal token from:", PESAPAL_BASE_URL);
	console.log("Consumer Key length:", consumerKey?.length);
	console.log("Consumer Key (first 10 chars):", consumerKey?.substring(0, 10));
	console.log("Consumer Secret length:", consumerSecret?.length);

	const requestBody = {
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
	};

	console.log("Request body:", JSON.stringify(requestBody, null, 2));

	// Note: In development with Cloudflare Workers runtime, we may need to handle SSL differently
	// The workerd runtime may have issues with some SSL certificates
	try {
		const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => response.statusText);
			console.error("Pesapal token request failed:", {
				status: response.status,
				statusText: response.statusText,
				error: errorText,
			});
			throw new Error(
				`Failed to get Pesapal token: ${response.status} ${response.statusText} - ${errorText}`
			);
		}

		const data: PesapalAuthResponse = await response.json();
		console.log("Pesapal token response:", {
			hasToken: !!data.token,
			status: data.status,
			message: data.message,
			error: data.error,
			fullResponse: data,
		});

		if (data.error || !data.token) {
			const errorMsg =
				data.error || data.message || "Failed to get Pesapal token";
			console.error("Pesapal token error details:", {
				error: data.error,
				message: data.message,
				status: data.status,
			});
			throw new Error(`Pesapal API Error: ${errorMsg}`);
		}

		return data.token;
	} catch (error) {
		// Check if it's an SSL certificate error
		if (
			error instanceof Error &&
			(error.message.includes("certificate") ||
				error.message.includes("TLS") ||
				error.message.includes("SSL"))
		) {
			throw new Error(
				"SSL Certificate Error: Unable to connect to Pesapal API. " +
					"This is a known issue with Cloudflare Workers in development. " +
					"The application will work correctly in production. " +
					"For local testing, consider using the 4by4-final workspace which uses a different runtime."
			);
		}
		throw error;
	}
}

/**
 * Register IPN (Instant Payment Notification) URL
 * Server function - runs on server to avoid CORS
 */
export const registerIPN = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { url: string; ipn_notification_type: "GET" | "POST" }) => data
	)
	.handler(async ({ data }) => {
		"use server";

		const token = await getPesapalToken();

		const response = await fetch(
			`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					url: data.url,
					ipn_notification_type: data.ipn_notification_type,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to register IPN: ${response.statusText}`);
		}

		const responseData: PesapalIPN = await response.json();

		if (responseData.error) {
			throw new Error(responseData.error);
		}

		return responseData;
	});

/**
 * Get list of registered IPNs
 * Server function - runs on server to avoid CORS
 */
export async function getRegisteredIPNs(): Promise<PesapalIPN[]> {
	"use server";

	const token = await getPesapalToken();

	const response = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/GetIpnList`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to get IPNs: ${response.statusText}`);
	}

	return await response.json();
}

/**
 * Submit an order request to Pesapal
 * Server function - runs on server to avoid CORS
 */
export const submitOrder = createServerFn({ method: "POST" })
	.inputValidator((data: PesapalOrderRequest) => data)
	.handler(async ({ data }) => {
		"use server";

		const token = await getPesapalToken();

		// Validate required fields
		if (!data.notification_id) {
			throw new Error(
				"IPN notification_id is required. Please register an IPN first."
			);
		}

		console.log("Submitting order to Pesapal:", {
			id: data.id,
			amount: data.amount,
			currency: data.currency,
			hasNotificationId: !!data.notification_id,
		});

		const response = await fetch(
			`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			}
		);

		const responseText = await response.text();
		console.log("Pesapal order response:", {
			status: response.status,
			ok: response.ok,
			response: responseText,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to submit order to Pesapal: ${response.status} - ${responseText}`
			);
		}

		const responseData: PesapalOrderResponse = JSON.parse(responseText);

		if (responseData.error) {
			throw new Error(`Pesapal order error: ${responseData.error}`);
		}

		return responseData;
	});

/**
 * Get transaction status
 * Server function - runs on server to avoid CORS
 */
export const getTransactionStatus = createServerFn({ method: "GET" })
	.inputValidator((orderTrackingId: string) => orderTrackingId)
	.handler(async ({ data: orderTrackingId }) => {
		"use server";

		const token = await getPesapalToken();

		const response = await fetch(
			`${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(
				`Failed to get transaction status: ${response.statusText}`
			);
		}

		const data: PesapalTransactionStatus = await response.json();

		if (data.error) {
			throw new Error(data.error);
		}

		return data;
	});

/**
 * Calculate booking amount based on days and car price
 */
export function calculateBookingAmount(
	pricePerDay: number,
	pickupDate: Date,
	returnDate: Date,
	protectionPlanPrice = 0
): number {
	const days = Math.ceil(
		(returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
	);
	const totalDays = days < 1 ? 1 : days;
	return pricePerDay * totalDays + protectionPlanPrice;
}

/**
 * Generate unique merchant reference
 */
export function generateMerchantReference(): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 9);
	return `BK-${timestamp}-${random}`.toUpperCase();
}
