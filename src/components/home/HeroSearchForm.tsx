import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { fetchAllLocationsQuery } from "@/hooks/locationHook";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export const HeroSearchForm = () => {
	const navigate = useNavigate();
	const searchParams = useSearch({ strict: false });

	const handleSearch = () => {
		navigate({
			to: "/cars",
			search: searchParams,
		});
	};

	return (
		<div className="rounded-sm border bg-secondary/30 p-2">
			<div className="grid grid-cols-1 gap-2 bg-white p-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-12">
				<div className="col-span-1 sm:col-span-2 md:col-span-4">
					<PickUpLocation />
				</div>
				<div className="col-span-1 sm:col-span-1 md:col-span-3">
					<PickupDate />
				</div>
				<div className="col-span-1 sm:col-span-1 md:col-span-3">
					<DropoffDate />
				</div>
				<div className="col-span-1 flex items-end sm:col-span-2 md:col-span-2">
					<Button
						className="w-full bg-primary py-6 text-white hover:bg-primary/90 lg:py-4"
						onClick={handleSearch}
					>
						Search
					</Button>
				</div>
			</div>
		</div>
	);
};

function PickUpLocation() {
	const navigate = useNavigate();
	const { data: locations } = useSuspenseQuery(fetchAllLocationsQuery);

	// Group locations by type
	const groupedLocations = locations.reduce(
		(acc, location) => {
			const type = location.locationType || "Other";
			if (!acc[type]) {
				acc[type] = [];
			}
			acc[type].push(location);
			return acc;
		},
		{} as Record<string, typeof locations>
	);

	return (
		<div className="flex flex-col gap-3">
			<Label className="px-1 text-xs">Pickup Location</Label>
			<Select
				onValueChange={(value) =>
					navigate({ to: ".", search: (old) => ({ ...old, location: value }) })
				}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select pickup location" />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(groupedLocations).map(([type, locs]) => (
						<SelectGroup key={type}>
							<SelectLabel className="capitalize">{type}</SelectLabel>
							{locs.map((location) => (
								<SelectItem key={location._id} value={location._id}>
									{location.name}
									{location.address?.city && ` - ${location.address.city}`}
								</SelectItem>
							))}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export function PickupDate() {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const [time, setTime] = React.useState("10:30:00");

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);
		navigate({
			to: ".",
			search: (old) => ({
				...old,
				pickupTime: newTime,
			}),
		});
	};

	return (
		<div className="flex gap-2">
			<div className="flex flex-1 flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="date-picker">
					Pickup Date
				</Label>
				<Popover onOpenChange={setOpen} open={open}>
					<PopoverTrigger asChild>
						<Button
							className="w-full justify-between font-normal"
							id="date-picker"
							variant="outline"
						>
							{date ? date.toLocaleDateString() : "Select date"}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-auto overflow-hidden p-0">
						<Calendar
							captionLayout="dropdown"
							mode="single"
							onSelect={(selectedDate) => {
								setDate(selectedDate);
								if (selectedDate) {
									navigate({
										to: ".",
										search: (old) => ({
											...old,
											pickupDate: selectedDate.toISOString(),
										}),
									});
								}
								setOpen(false);
							}}
							selected={date}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="pickup-time-picker">
					Time
				</Label>
				<Input
					className="w-24 appearance-none bg-background sm:w-20 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					id="pickup-time-picker"
					onChange={handleTimeChange}
					step="1"
					type="time"
					value={time}
				/>
			</div>
		</div>
	);
}

export function DropoffDate() {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const [time, setTime] = React.useState("10:30:00");

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);
		navigate({
			to: ".",
			search: (old) => ({
				...old,
				dropoffTime: newTime,
			}),
		});
	};

	return (
		<div className="flex gap-2">
			<div className="flex flex-1 flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="date-picker">
					Dropoff Date
				</Label>
				<Popover onOpenChange={setOpen} open={open}>
					<PopoverTrigger asChild>
						<Button
							className="w-full justify-between font-normal"
							id="date-picker"
							variant="outline"
						>
							{date ? date.toLocaleDateString() : "Select date"}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-auto overflow-hidden p-0">
						<Calendar
							captionLayout="dropdown"
							mode="single"
							onSelect={(selectedDate) => {
								setDate(selectedDate);
								if (selectedDate) {
									navigate({
										to: ".",
										search: (old) => ({
											...old,
											dropoffDate: selectedDate.toISOString(),
										}),
									});
								}
								setOpen(false);
							}}
							selected={date}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="dropoff-time-picker">
					Time
				</Label>
				<Input
					className="w-24 appearance-none bg-background sm:w-20 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					id="dropoff-time-picker"
					onChange={handleTimeChange}
					step="1"
					type="time"
					value={time}
				/>
			</div>
		</div>
	);
}
