// Type declarations for Cloudflare Workers runtime
// See: https://developers.cloudflare.com/workers/runtime-apis/bindings/

declare module "cloudflare:workers" {
	export const env: {
		PESAPAL_BASE_URL?: string;
		PESAPAL_CONSUMER_KEY?: string;
		PESAPAL_CONSUMER_SECRET?: string;
		PESAPAL_IPN_ID?: string;
		[key: string]: string | undefined;
	};

	export function withEnv<T>(
		envOverrides: Record<string, unknown>,
		callback: () => T
	): T;
}
