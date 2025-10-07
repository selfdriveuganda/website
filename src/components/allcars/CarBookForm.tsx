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

	return (
		<Card className="w-full max-w-md border-0 bg-white py-4 shadow-none">
			<CardContent>
				<div className="mb-6">
					<h3 className="">{car?.name}</h3>
					{/* <h2 className="mb-1 font-bold text-2xl">Book your car</h2> */}
					<p className="text-gray-600 text-sm">
						Please fill in the details to book your car
					</p>
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
						<div className="grid grid-cols-3 gap-3">
							<div className="col-span-2">
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
												initialFocus
												mode="single"
												onSelect={setPickupDate}
												selected={pickupDate}
											/>
										</PopoverContent>
									</Popover>
									<FieldDescription>
										Select your desired pickup date
									</FieldDescription>
								</Field>
							</div>
							<Field>
								<FieldLabel htmlFor="time-picker">Time</FieldLabel>
								<Input id="time-picker" required type="time" />
								<FieldDescription>Time</FieldDescription>
							</Field>
						</div>

						{/* Submit Button */}
						<div className="flex flex-col gap-2 pt-4">
							<Button type="submit">
								Book Self Drive @ USD {car.price_per_day} /day
							</Button>
							<Button onClick={onClose} type="button" variant="outline">
								Book with Driver @ USD {car.price_per_day_with_driver} /day
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
