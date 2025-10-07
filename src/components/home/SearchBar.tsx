import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { Search, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { fetchCarsQuery } from "@/hooks/carsHook";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

const SearchBar = () => (
	<div className="flex w-full justify-center">
		<div className="mx-auto w-full max-w-md rounded-lg bg-white shadow-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
			<SearchDialog />
		</div>
	</div>
);

const searchSchema = z.object({
	query: z
		.string()
		.min(2, {
			message: "Search query must be at least 2 characters",
		})
		.max(50, {
			message: "Search query must be between 2 and 50 characters",
		}),
});

export function SearchDialog() {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: allCars } = useSuspenseQuery(fetchCarsQuery);

	const form = useForm({
		defaultValues: {
			query: "",
		},
	});

	// Configure Fuse.js for fuzzy search
	const fuse = useMemo(() => {
		const options = {
			keys: ["name"], // Search in the 'name' field
			threshold: 0.4, // Lower = more strict, higher = more fuzzy
			includeScore: true,
			minMatchCharLength: 1,
		};
		return new Fuse(allCars, options);
	}, [allCars]);

	// Filter cars based on search query
	const filteredCars = useMemo(() => {
		if (!searchQuery.trim()) {
			return [];
		}
		const results = fuse.search(searchQuery);
		return results.map((result) => result.item);
	}, [searchQuery, fuse]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6 sm:py-4">
					<p className="mr-2 truncate text-gray-600 text-xs sm:text-sm">
						Enter car brand or model to search
					</p>
					<Button
						className="size-8 flex-shrink-0 sm:size-10"
						size="icon"
						variant="default"
					>
						<Search className="h-4 w-4 sm:h-5 sm:w-5" />
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="-translate-x-1/2 -translate-y-1/2 fixed top-1/3 left-1/2 w-[calc(100%-2rem)] transform p-2 px-0 sm:w-[448px] md:w-[512px] lg:w-[768px] xl:w-[896px] [&>button]:hidden">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="flex items-center gap-4 px-4 sm:gap-6 sm:px-6">
						<div className="flex w-full items-center gap-2">
							<SearchIcon
								className="flex-shrink-0 sm:h-[18px] sm:w-[18px]"
								size={16}
							/>
							<form.Field
								name="query"
								validators={{
									onChange: searchSchema.shape.query,
								}}
							>
								{(field) => (
									<Input
										autoFocus
										className="flex-1 border-none text-sm shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
										onChange={(e) => {
											field.handleChange(e.target.value);

											// Always update searchQuery to clear results when empty
											if (e.target.value.trim() === "") {
												setSearchQuery("");
											} else {
												// check if the input is valid
												if (
													searchSchema.safeParse({ query: e.target.value })
														.success
												) {
													form.setFieldValue("query", e.target.value);
													setSearchQuery(e.target.value);
												}
											}
										}}
										placeholder="Type car brand or model"
										value={field.state.value}
									/>
								)}
							</form.Field>
						</div>
					</div>
					{filteredCars.length > 0 && (
						<div className="flex max-h-[40dvh] flex-col overflow-y-auto border-t sm:max-h-[50dvh]">
							{filteredCars.map((car) => (
								<Link
									className="px-4 py-2 transition-colors hover:cursor-pointer hover:bg-gray-100 sm:px-6 sm:py-3"
									key={car.slug}
									onClick={() => {
										form.setFieldValue("query", car.name);
										setSearchQuery(car.name);
										form.handleSubmit();
									}}
									params={{ carSlug: car.slug }}
									to="/cars/$carSlug"
								>
									<div className="font-semibold text-sm">{car.name}</div>
									<p className="truncate text-muted-foreground text-xs sm:text-sm">
										cars/{car.slug}
									</p>
								</Link>
							))}
						</div>
					)}
					{searchQuery.trim() && filteredCars.length === 0 && (
						<div className="border-t px-4 py-3 text-center text-muted-foreground text-xs sm:px-6 sm:text-sm">
							No cars found matching "{searchQuery}"
						</div>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default SearchBar;
