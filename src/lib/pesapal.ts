// biome-ignore-all lint/style/useNamingConvention: Pesapal API uses snake_case

import { createServerFn } from "@tanstack/react-start";
import {
	getPesapalService,
	initialize as initializePesapal,
} from "pesapal-node-sdk";

// Note: Environment variables are accessed dynamically via process.env inside server functions
// This works at runtime in TanStack Start for both dev and production

export type PesapalEnvironment = "sandbox" | "live";

// Declare regex literal at top level for performance
const RE_TRAILING_API = /\/?api\/?$/i;

// Re-export types from the package for convenience
export type PesapalOrderRequest = {
	id: string; // Unique merchant reference
	currency: string;
	amount: number;
	description: string;
	// SDK expects camelCase keys
	callbackUrl: string;
	notificationId?: string; // IPN ID (optional if configured via ipnUrl)
	billingAddress: {
		emailAddress: string;
		phoneNumber?: string;
		country?: string;
		countryCode?: string;
		firstName?: string;
		middleName?: string;
		lastName?: string;
		line1?: string;
		line2?: string;
		city?: string;
		state?: string;
		postalCode?: string;
		zipCode?: string;
	};
};

// Snake_case payload expected from the existing UI
export type PesapalOrderRequestSnake = {
	id: string;
	currency: string;
	amount: number;
	description: string;
	callback_url?: string;
	billing_address: {
		email_address: string;
		phone_number?: string;
		country_code?: string;
		first_name?: string;
		middle_name?: string;
		last_name?: string;
		line_1?: string;
		line_2?: string;
		city?: string;
		state?: string;
		postal_code?: string;
		zip_code?: string;
	};
};

/**
 * Get environment variable value
 * Access process.env as an object to work around TypeScript/bundler limitations
 */
function getEnv(key: string): string | undefined {
	// Access process.env dynamically as a record
	// This works at runtime in TanStack Start server functions
	return (process.env as Record<string, string | undefined>)[key];
}

/**
 * Initialize Pesapal client
 * Called internally by server functions
 * Uses process.env to access environment variables (TanStack Start pattern)
 */
function normalizeBaseUrl(url: string): string {
	return url.replace(RE_TRAILING_API, "");
}

type PesapalInitConfig = {
	consumerKey: string;
	consumerSecret: string;
	environment: "sandbox" | "production";
	apiUrl: string;
	callbackUrl?: string;
	ipnUrl?: string;
	ipnId?: string;
};

// Remove older buildConfig implementation (replaced by leaner version below)
const getEnvTrim = (key: string) => (getEnv(key) || "").trim();
const resolveRuntimeEnv = (v: string) =>
	v === "live" || v === "production" ? "production" : "sandbox";
const defaultBaseFor = (env: "sandbox" | "production") =>
	env === "production"
		? "https://pay.pesapal.com/v3"
		: "https://cybqa.pesapal.com/pesapalv3";

function buildConfig(): PesapalInitConfig {
	const consumerKey = getEnvTrim("PESAPAL_CONSUMER_KEY");
	const consumerSecret = getEnvTrim("PESAPAL_CONSUMER_SECRET");
	const runtimeEnv = resolveRuntimeEnv(
		(getEnv("PESAPAL_ENV") || "sandbox").toLowerCase()
	);
	const apiUrl = normalizeBaseUrl(
		getEnv("PESAPAL_BASE_URL") || defaultBaseFor(runtimeEnv)
	);
	const callbackUrl = getEnvTrim("PESAPAL_CALLBACK_URL");
	const ipnUrl = getEnvTrim("PESAPAL_IPN_URL");
	const ipnId = getEnvTrim("PESAPAL_IPN_ID") || undefined;

	if (!(consumerKey && consumerSecret)) {
		const allKeys = Object.keys(process.env).filter((k) =>
			k.startsWith("PESAPAL")
		);
		throw new Error(
			"Pesapal credentials not configured. " +
				`Keys: ${consumerKey ? "✓" : "✗"}, Secret: ${consumerSecret ? "✓" : "✗"}. ` +
				`Available PESAPAL vars: ${allKeys.join(", ")}`
		);
	}

	// For IPN, require at least one of ipnUrl or ipnId
	const hasIpn = Boolean(ipnUrl || ipnId);
	if (!hasIpn) {
		throw new Error(
			"Missing IPN configuration. Provide PESAPAL_IPN_URL or PESAPAL_IPN_ID."
		);
	}

	return {
		consumerKey,
		consumerSecret,
		environment: runtimeEnv,
		apiUrl,
		callbackUrl: callbackUrl || undefined,
		ipnUrl: ipnUrl || undefined,
		ipnId,
	};
}

function getPesapalClient() {
	const cfg = buildConfig();
	initializePesapal(cfg);
	return getPesapalService();
}

/**
 * Get Pesapal OAuth token
 * Server function - uses pesapal-v3 package
 */
// The new SDK handles auth internally; optional: simple ping by calling a lightweight method
// export const getPesapalToken = createServerFn({ method: "POST" }).handler(
// 	async () => {
// 		const client = getPesapalClient();
// 		// No direct token retrieval API exposed; perform a no-op by attempting a minimal call
// 		// We return a success object to indicate configuration is valid
// 		return { success: true } as const;
// 	}
// );

/**
 * Register IPN (Instant Payment Notification) URL
 * Server function - uses pesapal-v3 package
 */
// The SDK does not expose register IPN API directly; users should register via dashboard
// export const registerIPN = createServerFn({ method: "POST" })
// 	.inputValidator(
// 		(data: { url: string; ipn_notification_type: "GET" | "POST" }) => data
// 	)
// 	.handler(async () => {
// 		throw new Error(
// 			"IPN registration is not supported via SDK. Please register the IPN URL in Pesapal dashboard and set PESAPAL_IPN_ID."
// 		);
// 	});

/**
 * Get list of registered IPNs
 * Server function - uses pesapal-v3 package
 */
// export const getRegisteredIPNs = createServerFn({ method: "GET" })
// 	.inputValidator(() => ({})) // No input needed
// 	.handler(async () => {
// 		// Note: The pesapal-v3 package doesn't have this method yet
// 		// We'll need to implement it or wait for package update
// 		throw new Error(
// 			"getRegisteredIPNs not yet available in pesapal-v3 package"
// 		);
// 	});

/**
 * Submit an order request to Pesapal
 * Server function - uses pesapal-v3 package
 */
export const submitOrder = createServerFn({ method: "POST" })
	.inputValidator((data: PesapalOrderRequestSnake) => data)
	.handler(async ({ data }) => {
		// Read IPN ID if available (optional when IPN URL is configured in SDK)
		const ipnId = (getEnv("PESAPAL_IPN_ID") || "").trim();

		// Map fields from snake_case to camelCase for the new SDK
		const orderData: PesapalOrderRequest = {
			id: data.id,
			currency: data.currency,
			amount: data.amount,
			description: data.description,
			callbackUrl: data.callback_url || getEnv("PESAPAL_CALLBACK_URL") || "",
			notificationId: ipnId || undefined,
			billingAddress: {
				emailAddress: data.billing_address.email_address,
				phoneNumber: data.billing_address.phone_number,
				countryCode: data.billing_address.country_code,
				firstName: data.billing_address.first_name,
				middleName: data.billing_address.middle_name,
				lastName: data.billing_address.last_name,
				line1: data.billing_address.line_1,
				line2: data.billing_address.line_2,
				city: data.billing_address.city,
				state: data.billing_address.state,
				postalCode: data.billing_address.postal_code,
				zipCode: data.billing_address.zip_code,
			},
		};

		// Validate required fields
		if (
			!(
				orderData.id &&
				orderData.currency &&
				orderData.amount &&
				orderData.description
			)
		) {
			throw new Error(
				"Missing basic order information (id, currency, amount, description)"
			);
		}

		if (!orderData.callbackUrl) {
			throw new Error(
				"Missing callback_url. Provide in request or set PESAPAL_CALLBACK_URL env."
			);
		}

		if (!orderData.billingAddress) {
			throw new Error("Missing billing address");
		}

		const { billingAddress: billing_address } = orderData;
		if (
			!(
				billing_address.emailAddress &&
				billing_address.phoneNumber &&
				billing_address.firstName &&
				billing_address.lastName
			)
		) {
			throw new Error(
				"Missing required billing address fields (email, phone, firstName, lastName)"
			);
		}

		getPesapalClient();
		const res = await (
			getPesapalService() as unknown as {
				submitOrder: (req: PesapalOrderRequest) => Promise<{
					orderTrackingId: string;
					redirectUrl: string;
					status?: string;
				}>;
			}
		).submitOrder(orderData);
		// Normalize response back to previous shape used by caller
		return {
			order_tracking_id: res.orderTrackingId,
			merchant_reference: orderData.id,
			redirect_url: res.redirectUrl,
			error: null,
			status: res.status ?? "OK",
		};
	});

/**
 * Get transaction status
 * Server function - uses pesapal-v3 package
 */
export const getTransactionStatus = createServerFn({ method: "GET" })
	.inputValidator((orderTrackingId: string) => orderTrackingId)
	.handler(async ({ data: orderTrackingId }) => {
		getPesapalClient();
		const res = await (
			getPesapalService() as unknown as {
				getPaymentStatus: (orderId: string) => Promise<{
					paymentMethod: string;
					amount: number;
					createdDate: string;
					confirmationCode?: string;
					paymentStatus?: string;
					paymentStatusDescription?: string;
					description?: string;
					message?: string;
					paymentAccount?: string;
					callbackUrl?: string;
					statusCode?: number;
					merchantReference?: string;
					paymentStatusCode?: string;
					currency: string;
					error?: string | null;
					status?: string;
				}>;
			}
		).getPaymentStatus(orderTrackingId);
		// Normalize to previous snake_case to keep UI unchanged
		return {
			payment_method: res.paymentMethod,
			amount: res.amount,
			created_date: res.createdDate,
			confirmation_code: res.confirmationCode,
			payment_status_description:
				res.paymentStatus ?? res.paymentStatusDescription,
			description: res.description,
			message: res.message,
			payment_account: res.paymentAccount,
			call_back_url: res.callbackUrl,
			status_code: res.statusCode,
			merchant_reference: res.merchantReference ?? "",
			payment_status_code: res.paymentStatusCode,
			currency: res.currency,
			error: res.error ?? null,
			status: res.status ?? "OK",
		};
	});

/**
 * Calculate booking amount based on days and car price
 */
export function calculateBookingAmount(
	pricePerDay: number,
	pickupDate: Date | string,
	returnDate: Date | string,
	protectionPlanPrice = 0
): number {
	// Ensure dates are Date objects (handle string dates from storage)
	const pickup =
		typeof pickupDate === "string" ? new Date(pickupDate) : pickupDate;
	const returnD =
		typeof returnDate === "string" ? new Date(returnDate) : returnDate;

	const days = Math.ceil(
		(returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
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
