import { ChevronDownIcon } from "lucide-react";
import React from "react";
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

export const HeroSearchForm = () => (
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
				<Button className="w-full bg-primary py-6 text-white hover:bg-primary/90 lg:py-4">
					Search
				</Button>
			</div>
		</div>
	</div>
);

function PickUpLocation() {
	return (
		<div className="flex flex-col gap-3">
			<Label className="px-1 text-xs">Pickup Location</Label>
			<Select>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a timezone" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>North America</SelectLabel>
						<SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
						<SelectItem value="cst">Central Standard Time (CST)</SelectItem>
						<SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
						<SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
						<SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
						<SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Europe & Africa</SelectLabel>
						<SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
						<SelectItem value="cet">Central European Time (CET)</SelectItem>
						<SelectItem value="eet">Eastern European Time (EET)</SelectItem>
						<SelectItem value="west">
							Western European Summer Time (WEST)
						</SelectItem>
						<SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
						<SelectItem value="eat">East Africa Time (EAT)</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Asia</SelectLabel>
						<SelectItem value="msk">Moscow Time (MSK)</SelectItem>
						<SelectItem value="ist">India Standard Time (IST)</SelectItem>
						<SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
						<SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
						<SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
						<SelectItem value="ist_indonesia">
							Indonesia Central Standard Time (WITA)
						</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Australia & Pacific</SelectLabel>
						<SelectItem value="awst">
							Australian Western Standard Time (AWST)
						</SelectItem>
						<SelectItem value="acst">
							Australian Central Standard Time (ACST)
						</SelectItem>
						<SelectItem value="aest">
							Australian Eastern Standard Time (AEST)
						</SelectItem>
						<SelectItem value="nzst">
							New Zealand Standard Time (NZST)
						</SelectItem>
						<SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>South America</SelectLabel>
						<SelectItem value="art">Argentina Time (ART)</SelectItem>
						<SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
						<SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
						<SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

export function PickupDate() {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
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
							onSelect={(date) => {
								setDate(date);
								setOpen(false);
							}}
							selected={date}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="time-picker">
					Time
				</Label>
				<Input
					className="w-24 appearance-none bg-background sm:w-20 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					defaultValue="10:30:00"
					id="time-picker"
					step="1"
					type="time"
				/>
			</div>
		</div>
	);
}

export function DropoffDate() {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(undefined);
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
							onSelect={(date) => {
								setDate(date);
								setOpen(false);
							}}
							selected={date}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label className="px-1 text-xs" htmlFor="time-picker">
					Time
				</Label>
				<Input
					className="w-24 appearance-none bg-background sm:w-20 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					defaultValue="10:30:00"
					id="time-picker"
					step="1"
					type="time"
				/>
			</div>
		</div>
	);
}
