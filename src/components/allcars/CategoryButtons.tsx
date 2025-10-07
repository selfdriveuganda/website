import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { fetchCarCategoriesQuery } from "@/hooks/carsHook";
import { Button } from "../ui/button";

const CategoryButtons = () => {
	const { data: categories } = useSuspenseQuery(fetchCarCategoriesQuery);

	const navigate = useNavigate();
	const searchParams = useSearch({ strict: false }) as { category?: string };
	const category = searchParams.category;

	const handleCategoryClick = (category: string | null) => {
		// If category is null, navigate to all cars
		if (category === null) {
			navigate({
				to: "/cars",
				search: {},
			});
			return;
		}
		navigate({
			to: "/cars",
			search: { category },
		});
	};

	return (
		<div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pt-4 sm:gap-3">
			{/* All Cars button */}
			<Button
				className={`mb-2 whitespace-nowrap rounded-full px-4 py-1.5 font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 sm:mb-0 sm:px-5 sm:py-2 ${
					category
						? "border-gray-300 text-black hover:border-black"
						: "bg-black text-white"
				}`}
				onClick={() => handleCategoryClick(null)}
				onTouchEnd={(e) => {
					e.currentTarget.style.opacity = "1";
				}}
				onTouchStart={(e) => {
					e.currentTarget.style.opacity = "0.8";
				}}
				variant={category ? "outline" : "default"}
			>
				All Cars
			</Button>
			{categories.map((cat) => (
				<Button
					className="rounded-full"
					key={cat._id}
					onClick={() => handleCategoryClick(cat.slug)}
					variant={category === cat.slug ? "default" : "outline"}
				>
					{cat.category}
				</Button>
			))}
		</div>
	);
};

export default CategoryButtons;
