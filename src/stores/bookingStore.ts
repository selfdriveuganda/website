import type { SanityDocument } from "@sanity/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
	car: SanityDocument | null;
	carSetAt: number | null; // timestamp when car was set
	selectedProtectionPlan: string | null; // selected protection plan name or 'none'
	current_step: "location" | "car" | "payment" | "confirmation";
	pickup_location?: string;
	return_location?: string;
	pickup_date?: Date;
	return_date?: Date;
	pickup_time?: string;
	return_time?: string;
	paymentInfo?: {
		orderTrackingId: string;
		merchantReference: string;
		amount: number;
		currency: string;
	};
	bookingData?: any; // Store the complete booking form data
}

interface BookingActions {
	setCar: (car: SanityDocument | null) => void;
	getCar: () => SanityDocument | null; // getter that checks expiration
	clearExpiredCar: () => void;
	setSelectedProtectionPlan: (planName: string | null) => void;
	setCurrentStep: (
		step: "location" | "car" | "payment" | "confirmation"
	) => void;
	setPickupLocation: (location: string) => void;
	setReturnLocation: (location: string) => void;
	setPickupDate: (date: Date) => void;
	setReturnDate: (date: Date) => void;
	setPickupTime: (time: string) => void;
	setReturnTime: (time: string) => void;
	setPaymentInfo: (paymentInfo: {
		orderTrackingId: string;
		merchantReference: string;
		amount: number;
		currency: string;
	}) => void;
	setBookingData: (bookingData: any) => void;
}

const initialState: BookingState = {
	car: null,
	carSetAt: null,
	selectedProtectionPlan: null,
	current_step: "location",
	pickup_location: undefined,
	return_location: undefined,
	pickup_date: undefined,
	return_date: undefined,
	pickup_time: undefined,
	return_time: undefined,
	paymentInfo: undefined,
	bookingData: undefined,
};

const CAR_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useBookingStore = create<BookingState & BookingActions>()(
	persist(
		(set, get) => ({
			...initialState,
			setPickupTime: (time) =>
				set(() => ({
					pickup_time: time,
				})),
			setReturnTime: (time) =>
				set(() => ({
					return_time: time,
				})),
			setPickupDate: (date) =>
				set(() => ({
					pickup_date: date,
				})),
			setReturnDate: (date) =>
				set(() => ({
					return_date: date,
				})),
			setPickupLocation: (location) =>
				set(() => ({
					pickup_location: location,
				})),
			setReturnLocation: (location) =>
				set(() => ({
					return_location: location,
				})),
			setCurrentStep: (step) =>
				set(() => ({
					current_step: step,
				})),
			setCar: (car) =>
				set(() => ({
					car,
					carSetAt: car ? Date.now() : null,
				})),
			setSelectedProtectionPlan: (planName) =>
				set(() => ({
					selectedProtectionPlan: planName,
				})),
			getCar: () => {
				const state = get();
				if (!(state.car && state.carSetAt)) {
					return null;
				}

				const isExpired = Date.now() - state.carSetAt > CAR_EXPIRATION_TIME;
				if (isExpired) {
					// Clear expired car
					set(() => ({ car: null, carSetAt: null }));
					return null;
				}

				return state.car;
			},
			clearExpiredCar: () => {
				const state = get();
				if (
					state.carSetAt &&
					Date.now() - state.carSetAt > CAR_EXPIRATION_TIME
				) {
					set(() => ({ car: null, carSetAt: null }));
				}
			},
			setPaymentInfo: (paymentInfo) =>
				set(() => ({
					paymentInfo,
				})),
			setBookingData: (bookingData) =>
				set(() => ({
					bookingData,
				})),
		}),
		{ name: "bookingStore" }
	)
);
