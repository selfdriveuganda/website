// @ts-nocheck
/// <reference types="vite/client" />

// TypeScript declarations for environment variables
// Following TanStack Start pattern: https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
// Note: This file uses TypeScript declaration patterns (namespace, interface) which are standard for .d.ts files

// Server-side environment variables (accessed via process.env in server functions)
declare global {
	namespace NodeJs {
		interface ProcessEnv {
			readonly PESAPAL_CONSUMER_KEY: string;
			readonly PESAPAL_CONSUMER_SECRET: string;
			readonly PESAPAL_BASE_URL: string;
			readonly PESAPAL_IPN_ID: string;
			readonly NODE_ENV: "development" | "production" | "test";
		}
	}
}

export {};
