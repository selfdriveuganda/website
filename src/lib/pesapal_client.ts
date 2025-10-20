import { createServerFn } from '@tanstack/react-start';
import { Pesapal } from 'pesapal-v3';
import { z } from 'zod';

// Get environment variables from import.meta.env (Vite convention)
const getEnvVar = (key: string): string => {
	const value = import.meta.env[key];
	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return String(value).trim();
};

// Test authentication
export const testPesapalAuth = createServerFn().handler(async () => {
	try {
		const consumerKey = getEnvVar('VITE_PESAPAL_CONSUMER_KEY');
		const consumerSecret = getEnvVar('VITE_PESAPAL_CONSUMER_SECRET');

		const pesapal = new Pesapal({
			consumerKey,
			consumerSecret,
			environment: 'sandbox',
		});

		const token = await pesapal.getAuthToken();

		return {
			success: true,
			message: 'Authentication successful',
			tokenPreview: `${token.substring(0, 20)}...`,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Authentication failed';

		return {
			success: false,
			error: errorMessage,
		};
	}
});

// Zod schema for order data validation
const OrderDataSchema = z.object({
	id: z.string().min(1, 'Order ID is required'),
	currency: z.string().length(3, 'Currency must be 3 characters'),
	amount: z.number().positive('Amount must be positive'),
	description: z.string().min(1, 'Description is required'),
	callback_url: z.string().url('Callback URL must be valid'),
	billing_address: z.object({
		email_address: z.string().email('Valid email is required'),
		phone_number: z.string().min(1, 'Phone number is required'),
		country_code: z.string().optional(),
		first_name: z.string().min(1, 'First name is required'),
		last_name: z.string().min(1, 'Last name is required'),
		city: z.string().optional(),
	}),
});

// Type for order data (inferred from Zod schema)
export type OrderData = z.infer<typeof OrderDataSchema>;

// Create payment - accepts order data with validation
export const createPayment = createServerFn({ method: 'POST' })
	.inputValidator(OrderDataSchema)
	.handler(async ({ data }) => {
		try {
			const consumerKey = getEnvVar('VITE_PESAPAL_CONSUMER_KEY');
			const consumerSecret = getEnvVar('VITE_PESAPAL_CONSUMER_SECRET');
			const ipnId = getEnvVar('VITE_PESAPAL_IPN_ID');

			const pesapal = new Pesapal({
				consumerKey,
				consumerSecret,
				environment: 'sandbox',
			});

			const response = await pesapal.submitOrder({
				...data,
				notification_id: ipnId,
			});

			return { success: true, data: response };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Payment creation failed';

			return {
				success: false,
				error: errorMessage,
			};
		}
	});