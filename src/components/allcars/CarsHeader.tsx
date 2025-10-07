import SearchBar from "../home/SearchBar";

const CarsHeader = () => (
	<div
		className="flex h-[230px] flex-col items-center justify-center gap-4 px-4 text-center md:h-[270px]"
		style={{
			backgroundImage:
				"linear-gradient(to right, white 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.3) 70%, transparent 100%), url('/images/bg.png')",
			backgroundSize: "auto, cover",
			backgroundPosition: "left center, right center",
			backgroundRepeat: "no-repeat, no-repeat",
		}}
	>
		<div className="typography absolute top-28 w-full space-y-2 rounded-md px-4 md:top-38">
			<h1 className="text-center font-extrabold text-3xl md:text-[60px]">
				View our fleet
			</h1>
			<SearchBar />
		</div>
	</div>
);

export default CarsHeader;
