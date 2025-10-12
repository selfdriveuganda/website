"use client";

import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchAllLocationsQuery } from "@/hooks/locationHook";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/bookingStore";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

type CarBookFormProps = {
	onClose?: () => void;
	car: SanityDocument | null;
};

export function CarBookForm({ onClose, car }: CarBookFormProps) {
	const [pickupDate, setPickupDate] = useState<Date>();
	const [pickupLocation, setPickupLocation] = useState<string>("");

	const { data: locations } = useSuspenseQuery(fetchAllLocationsQuery);
	const {
		setPickupLocation: savePickupLocation,
		setPickupDate: savePickupDate,
	} = useBookingStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (pickupLocation && pickupDate) {
			savePickupLocation(pickupLocation);
			savePickupDate(pickupDate);
			onClose?.();
		}
	};

	if (!car) {
		return null;
	}

	return (
		<Card className="h-full w-full border-0 bg-white py-4 shadow-none sm:max-w-md lg:rounded-xl lg:px-2">
			<CardContent className="px-4 sm:px-6">
				<div className="mb-4 sm:mb-6">
					<h3 className="font-bold text-lg sm:text-xl">{car.name}</h3>
				</div>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						{/* Pickup Location */}
						<Field>
							<FieldLabel htmlFor="pickup-location">Pickup Location</FieldLabel>
							<Select onValueChange={setPickupLocation} value={pickupLocation}>
								<SelectTrigger className="" id="pickup-location">
									<SelectValue placeholder="Select pickup location" />
								</SelectTrigger>
								<SelectContent>
									{locations.map((location) => (
										<SelectItem key={location._id} value={location._id}>
											{location.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldDescription>
								Choose where you'd like to pick up the car
							</FieldDescription>
						</Field>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="sm:col-span-2">
								<Field>
									<FieldLabel>Pickup Date</FieldLabel>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												className={cn(
													"w-full justify-start text-left font-normal",
													!pickupDate && "text-muted-foreground"
												)}
												variant={"outline"}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{pickupDate ? (
													format(pickupDate, "PPP")
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
												mode="single"
												onSelect={setPickupDate}
												selected={pickupDate}
											/>
										</PopoverContent>
									</Popover>
								</Field>
							</div>
							<Field>
								<FieldLabel htmlFor="time-picker">Time</FieldLabel>
								<Input id="time-picker" required type="time" />
							</Field>
						</div>

						{/* Submit Button */}
						<div className="flex flex-col gap-2 pt-4">
							<Button className="w-full text-sm sm:text-base" type="submit">
								Book Self Drive @ USD {car.price_per_day} /day
							</Button>
							<Button
								className="w-full border-0 bg-accent/50 text-sm shadow-none sm:text-base"
								onClick={onClose}
								type="button"
								variant="outline"
							>
								Book with Driver @ USD {car.price_per_day_with_driver} /day
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
