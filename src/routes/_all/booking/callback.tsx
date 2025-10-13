import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionStatus } from "@/lib/pesapal";
import { useBookingStore } from "@/stores/bookingStore";
import { seo } from "@/utils/seo";

const callbackSearchSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: Pesapal API returns PascalCase
	OrderTrackingId: z.string().optional(),
	// biome-ignore lint/style/useNamingConvention: Pesapal API returns PascalCase
	OrderMerchantReference: z.string().optional(),
});

export const Route = createFileRoute("/_all/booking/callback")({
	component: RouteComponent,
	validateSearch: callbackSearchSchema,
	head: () => ({
		meta: [
			...seo({
				title: "Payment Status | Self Drive 4x4 Uganda",
				description: "Payment confirmation for your car rental booking.",
			}),
		],
	}),
});

type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

type TransactionInfo = {
	status: PaymentStatus;
	amount: number;
	currency: string;
	paymentMethod?: string;
	merchantReference?: string;
	message?: string;
};

function getPaymentStatus(statusDescription: string): PaymentStatus {
	const lower = statusDescription.toLowerCase();
	if (lower === "completed") {
		return "success";
	}
	if (lower === "failed") {
		return "failed";
	}
	if (lower === "cancelled") {
		return "cancelled";
	}
	return "pending";
}

function RouteComponent() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const { car, paymentInfo } = useBookingStore();

	const [isVerifying, setIsVerifying] = useState(true);
	const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
		status: "pending",
		amount: paymentInfo?.amount || 0,
		currency: paymentInfo?.currency || "USD",
	});

	useEffect(() => {
		const verifyPayment = async () => {
			try {
				const orderTrackingId =
					("OrderTrackingId" in search
						? (search.OrderTrackingId as string)
						: undefined) || paymentInfo?.orderTrackingId;

				if (!orderTrackingId) {
					setTransactionInfo({
						status: "failed",
						amount: 0,
						currency: "USD",
						message: "No order tracking ID found",
					});
					setIsVerifying(false);
					return;
				}

				const status = await getTransactionStatus({ data: orderTrackingId });

				setTransactionInfo({
					status: getPaymentStatus(status.payment_status_description),
					amount: status.amount,
					currency: status.currency,
					paymentMethod: status.payment_method,
					merchantReference: status.merchant_reference,
					message: status.message,
				});
				setIsVerifying(false);
			} catch (error) {
				setTransactionInfo({
					status: "failed",
					amount: paymentInfo?.amount || 0,
					currency: paymentInfo?.currency || "USD",
					message:
						error instanceof Error ? error.message : "Failed to verify payment",
				});
				setIsVerifying(false);
			}
		};

		verifyPayment();
	}, [search, paymentInfo]);

	const handleContinue = () => {
		if (transactionInfo.status === "success") {
			useBookingStore.getState().setBookingData(null);
			navigate({ to: "/" });
		} else {
			navigate({ to: "/cars" });
		}
	};

	if (isVerifying) {
		return (
			<div className="typography pt-16 sm:pt-18 md:pt-20">
				<div className="container mx-auto px-4 py-16">
					<Card>
						<CardContent className="flex flex-col items-center py-16">
							<Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
							<h2 className="mb-2 font-bold text-2xl">Verifying Payment</h2>
							<p className="text-center text-muted-foreground">
								Please wait while we confirm your payment...
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="typography pt-16 sm:pt-18 md:pt-20">
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-2xl">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								{transactionInfo.status === "success" && (
									<>
										<CheckCircle2 className="h-8 w-8 text-green-500" />
										<span>Payment Successful!</span>
									</>
								)}
								{transactionInfo.status === "failed" && (
									<>
										<XCircle className="h-8 w-8 text-red-500" />
										<span>Payment Failed</span>
									</>
								)}
								{transactionInfo.status === "cancelled" && (
									<>
										<XCircle className="h-8 w-8 text-orange-500" />
										<span>Payment Cancelled</span>
									</>
								)}
								{transactionInfo.status === "pending" && (
									<>
										<Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
										<span>Payment Pending</span>
									</>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{transactionInfo.status === "success" && (
								<div className="rounded-lg bg-green-50 p-4 text-green-800">
									<p className="font-semibold">
										Your booking has been confirmed!
									</p>
									<p className="text-sm">
										We've sent a confirmation email with your booking details.
									</p>
								</div>
							)}

							{transactionInfo.status === "failed" && (
								<div className="rounded-lg bg-red-50 p-4 text-red-800">
									<p className="font-semibold">
										Your payment could not be processed
									</p>
									<p className="text-sm">
										{transactionInfo.message ||
											"Please try again or contact support if the problem persists."}
									</p>
								</div>
							)}

							{transactionInfo.status === "cancelled" && (
								<div className="rounded-lg bg-orange-50 p-4 text-orange-800">
									<p className="font-semibold">You cancelled the payment</p>
									<p className="text-sm">
										Your booking was not completed. You can try again when
										ready.
									</p>
								</div>
							)}

							<div className="space-y-4">
								{car && (
									<div>
										<p className="font-semibold text-muted-foreground text-sm">
											Vehicle
										</p>
										<p className="font-semibold">{car.name}</p>
									</div>
								)}

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="font-semibold text-muted-foreground text-sm">
											Amount
										</p>
										<p className="font-semibold">
											{transactionInfo.currency} {transactionInfo.amount}
										</p>
									</div>

									{transactionInfo.paymentMethod && (
										<div>
											<p className="font-semibold text-muted-foreground text-sm">
												Payment Method
											</p>
											<p className="capitalize">
												{transactionInfo.paymentMethod}
											</p>
										</div>
									)}
								</div>

								{transactionInfo.merchantReference && (
									<div>
										<p className="font-semibold text-muted-foreground text-sm">
											Reference Number
										</p>
										<p className="font-mono text-sm">
											{transactionInfo.merchantReference}
										</p>
									</div>
								)}
							</div>

							<div className="flex gap-4">
								{transactionInfo.status === "success" ? (
									<Button className="w-full" onClick={handleContinue} size="lg">
										Return to Home
									</Button>
								) : (
									<>
										<Button
											className="w-full"
											onClick={() => navigate({ to: "/" })}
											size="lg"
											variant="outline"
										>
											Go to Home
										</Button>
										<Button
											className="w-full"
											onClick={handleContinue}
											size="lg"
										>
											Try Again
										</Button>
									</>
								)}
							</div>

							{transactionInfo.status === "success" && (
								<p className="text-center text-muted-foreground text-sm">
									Need help? Contact us at{" "}
									<a
										className="text-primary underline"
										href="mailto:info@selfdrive4x4uganda.com"
									>
										info@selfdrive4x4uganda.com
									</a>
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
