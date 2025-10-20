import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	calculateBookingAmount,
} from "@/lib/pesapal";
import { useBookingStore } from "@/stores/bookingStore";
import { createPayment } from "@/lib/pesapal_client";

const bookingSearchSchema = z.object({
	carId: z.string().optional(),
	withDriver: z.boolean().optional().default(false),
});

export const Route = createFileRoute("/_all/booking")({
	component: RouteComponent,
	validateSearch: bookingSearchSchema,
});

function RouteComponent() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const { car, pickup_date, return_date, selectedProtectionPlan } =
		useBookingStore();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form state for guest details
	const [guestDetails, setGuestDetails] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		countryCode: "UG",
		city: "",
	});

	// Calculate total amount
	const withDriver = "withDriver" in search ? search.withDriver : false;
	const pricePerDay = withDriver
		? car?.price_per_day_with_driver || 0
		: car?.price_per_day || 0;

	const protectionPlanPrice =
		car?.protectionPlans?.find(
			(plan: { name: string; price: number }) =>
				plan.name === selectedProtectionPlan
		)?.price || 0;

	const totalAmount =
		pickup_date && return_date
			? calculateBookingAmount(
					pricePerDay,
					pickup_date,
					return_date,
					protectionPlanPrice
				)
			: 0;

	const handleInputChange = (field: string, value: string) => {
		setGuestDetails((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			if (!car) {
				throw new Error("Missing car information");
			}
			if (!pickup_date) {
				throw new Error("Missing pickup date");
			}
			if (!return_date) {
				throw new Error("Missing return date");
			}

			// Prepare order data for Pesapal
			const orderData = {
				id: `ORDER_${Date.now()}`,
				currency: "USD",
				amount: totalAmount,
				description: `Car Rental: ${car.name} (${withDriver ? "with driver" : "self-drive"})`,
				// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
				callback_url: `${window.location.origin}/booking/callback`,
				// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
				billing_address: {
					// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
					email_address: guestDetails.email,
					// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
					phone_number: guestDetails.phone,
					// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
					country_code: guestDetails.countryCode,
					// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
					first_name: guestDetails.firstName,
					// biome-ignore lint/style/useNamingConvention: Pesapal API requires snake_case
					last_name: guestDetails.lastName,
					city: guestDetails.city,
				},
			};

			// Submit order to Pesapal via server function
			const response = await createPayment({ data: orderData });
			
			if (!response.success) {
				throw new Error(response.error || "Payment creation failed");
			}

			// Store payment info in booking store
			useBookingStore.getState().setPaymentInfo({
				orderTrackingId: response.data.order_tracking_id,
				merchantReference: response.data.merchant_reference,
				amount: totalAmount,
				currency: "USD",
			});

			// Store booking data
			useBookingStore.getState().setBookingData({
				...guestDetails,
				withDriver,
			});

			// Redirect to Pesapal payment page
			if (response.data.redirect_url) {
				window.location.href = response.data.redirect_url;
			} else {
				throw new Error("No redirect URL received from payment gateway");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to process payment";
			setError(errorMessage);
			setIsSubmitting(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!car) {
		return (
			<div className="container mx-auto px-4 py-16">
				<Card className="border-0 shadow-none">
					<CardContent className="py-16 text-center">
						<h2 className="mb-4 font-bold text-2xl">No Car Selected</h2>
						<p className="mb-6 text-muted-foreground">
							Please select a car before proceeding to booking.
						</p>
						<Button onClick={() => navigate({ to: "/cars" })}>
							Browse Cars
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<h1 className="mb-8 font-bold text-3xl md:text-4xl">
					Complete Your Booking
				</h1>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Booking Summary */}
					<div className="lg:col-span-1">
						<Card className="bg-white shadow-none">
							<CardHeader>
								<CardTitle>Booking Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="font-semibold text-muted-foreground text-sm">
										Vehicle
									</p>
									<p className="font-semibold">{car.name}</p>
								</div>

								<div>
									<p className="font-semibold text-muted-foreground text-sm">
										Rental Type
									</p>
									<p>{withDriver ? "With Driver" : "Self-Drive"}</p>
								</div>

								{pickup_date && return_date && (
									<div>
										<p className="font-semibold text-muted-foreground text-sm">
											Duration
										</p>
										<p>
											{new Date(pickup_date).toLocaleDateString()} -{" "}
											{new Date(return_date).toLocaleDateString()}
										</p>
									</div>
								)}

								{selectedProtectionPlan && (
									<div>
										<p className="font-semibold text-muted-foreground text-sm">
											Protection Plan
										</p>
										<p>{selectedProtectionPlan}</p>
									</div>
								)}

								<div className="border-t pt-4">
									<div className="flex justify-between font-bold text-lg">
										<span>Total Amount</span>
										<span>${totalAmount}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Guest Details Form */}
					<div className="lg:col-span-2">
						<Card className="bg-white shadow-none">
							<CardHeader>
								<CardTitle>Guest Information</CardTitle>
								<p className="text-muted-foreground text-sm">
									No account required. Enter your details to proceed.
								</p>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit}>
									<FieldGroup>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<Field>
												<FieldLabel htmlFor="firstName">First Name</FieldLabel>
												<Input
													id="firstName"
													onChange={(e) =>
														handleInputChange("firstName", e.target.value)
													}
													required
													value={guestDetails.firstName}
												/>
											</Field>

											<Field>
												<FieldLabel htmlFor="lastName">Last Name</FieldLabel>
												<Input
													id="lastName"
													onChange={(e) =>
														handleInputChange("lastName", e.target.value)
													}
													required
													value={guestDetails.lastName}
												/>
											</Field>
										</div>

										<Field>
											<FieldLabel htmlFor="email">Email Address</FieldLabel>
											<Input
												id="email"
												onChange={(e) =>
													handleInputChange("email", e.target.value)
												}
												required
												type="email"
												value={guestDetails.email}
											/>
											<FieldDescription>
												We'll send booking confirmation to this email
											</FieldDescription>
										</Field>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<Field>
												<FieldLabel htmlFor="countryCode">Country</FieldLabel>
												<Select
													onValueChange={(value) =>
														handleInputChange("countryCode", value)
													}
													value={guestDetails.countryCode}
												>
													<SelectTrigger id="countryCode">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="UG">Uganda</SelectItem>
														<SelectItem value="KE">Kenya</SelectItem>
														<SelectItem value="TZ">Tanzania</SelectItem>
														<SelectItem value="RW">Rwanda</SelectItem>
														<SelectItem value="US">United States</SelectItem>
														<SelectItem value="GB">United Kingdom</SelectItem>
														<SelectItem value="OTHER">Other</SelectItem>
													</SelectContent>
												</Select>
											</Field>

											<Field>
												<FieldLabel htmlFor="phone">Phone Number</FieldLabel>
												<Input
													id="phone"
													onChange={(e) =>
														handleInputChange("phone", e.target.value)
													}
													placeholder="+256 700 000 000"
													required
													type="tel"
													value={guestDetails.phone}
												/>
											</Field>
										</div>

										<Field>
											<FieldLabel htmlFor="city">City</FieldLabel>
											<Input
												id="city"
												onChange={(e) =>
													handleInputChange("city", e.target.value)
												}
												placeholder="Kampala"
												value={guestDetails.city}
											/>
										</Field>

										{error && (
											<div className="rounded-md bg-destructive/10 p-4 text-destructive">
												{error}
											</div>
										)}

										<Button
											className="w-full"
											disabled={isSubmitting}
											size="lg"
											type="submit"
										>
											{isSubmitting
												? "Processing..."
												: `Pay $${totalAmount} with Pesapal`}
										</Button>

										<p className="text-center text-muted-foreground text-sm">
											Secure payment powered by Pesapal
										</p>
									</FieldGroup>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
