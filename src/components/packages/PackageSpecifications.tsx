import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { CalendarFold, Clock, MapPin, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSinglePackageQuery } from "@/hooks/packagesHook";
import RecommendedGridCar from "../allcars/RecommendedGridCar";

type SafetyTip = {
	key: string;
	value: string;
};

function PackageSpecifications() {
	const params = useParams({ strict: false });
	const packageSlug = "packageSlug" in params ? params.packageSlug : "";

	const { data: packageData } = useSuspenseQuery(
		fetchSinglePackageQuery(packageSlug as string)
	);

	if (!packageData) {
		return (
			<div className="bg-white py-8 md:py-16">
				<div className="container mx-auto px-4">
					<div className="text-center text-red-500">Package not found</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white py-8 md:py-16">
			<div className="container mx-auto px-4">
				<h4 className="mb-6 font-bold text-2xl md:mb-8 md:text-3xl">
					{packageData?.name || "Package Specifications"}
				</h4>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 gap-6 lg:gap-8">
					{/* Main Content - Full width */}
					<div className="space-y-6">
						{/* Package Info Header */}
						<div className="mb-3 flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-2">
								<CalendarFold className="h-5 w-5 text-gray-500" />
								<span className="font-medium text-gray-600 text-sm">
									{packageData?.duration || "N/A"} Day
									{packageData?.duration > 1 ? "s" : ""}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-gray-500" />
								<span className="font-medium text-gray-600 text-sm capitalize">
									{packageData?.destination?.location?.country || "N/A"}/
									{packageData?.destination?.location?.nearestCity || "N/A"}
								</span>
							</div>
							{packageData?.difficulty && (
								<div className="flex items-center gap-2">
									<Star className="h-5 w-5 text-gray-500" />
									<span className="font-medium text-gray-600 text-sm capitalize">
										{packageData.difficulty} Level
									</span>
								</div>
							)}
						</div>

						{/* Description */}
						<div className="prose prose-gray max-w-none">
							<p className="text-gray-700 text-sm leading-relaxed">
								{packageData.description}
							</p>
						</div>

						{packageData?.features && packageData.features.length > 0 && (
							<Card className="border-0 shadow-none">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Clock className="h-5 w-5 text-green-600" />
										Key Features
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
										{(packageData.features as string[]).map((feature) => (
											<div className="flex items-center gap-2" key={feature}>
												<div className="h-1.5 w-1.5 rounded-full bg-green-600" />
												<span className="text-gray-700 text-sm capitalize">
													{feature}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Recommended Cars */}
						{packageData?.recommendedCars &&
							packageData.recommendedCars.length > 0 && (
								<div className="mb-16">
									<h5 className="py-8">Recommended Vehicles</h5>
									<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
										{(packageData.recommendedCars as SanityDocument[]).map(
											(car, index) => (
												<RecommendedGridCar car={car} key={car._id || index} />
											)
										)}
									</div>
								</div>
							)}

						{packageData?.travelTips && (
							<Card className="border-0 shadow-none">
								<CardContent>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										{/* Best Time to Visit */}
										{packageData.travelTips.bestTimeToVisit && (
											<div>
												<h5 className="mb-3 font-semibold text-gray-800">
													Best Time to Visit
												</h5>
												{packageData.travelTips.bestTimeToVisit.season && (
													<p className="mb-2 text-gray-600 text-sm">
														<strong>Season:</strong>{" "}
														{packageData.travelTips.bestTimeToVisit.season}
													</p>
												)}
												{packageData.travelTips.bestTimeToVisit.weather && (
													<p className="mb-2 text-gray-600 text-sm">
														<strong>Weather:</strong>{" "}
														{packageData.travelTips.bestTimeToVisit.weather}
													</p>
												)}
												{packageData.travelTips.bestTimeToVisit.crowds && (
													<p className="text-gray-600 text-sm">
														<strong>Crowds:</strong>{" "}
														{packageData.travelTips.bestTimeToVisit.crowds}
													</p>
												)}
											</div>
										)}

										{packageData.travelTips.safetyTips &&
											packageData.travelTips.safetyTips.length > 0 && (
												<div>
													<h5 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
														<Shield className="h-4 w-4 text-green-600" />
														Safety & Security Tips
													</h5>
													<div className="space-y-3">
														{(
															packageData.travelTips.safetyTips as SafetyTip[]
														).map((tip, index) => (
															<div
																className="border-green-500 border-l-2 pl-3"
																key={tip.key || index}
															>
																<h6 className="font-medium text-gray-800 text-sm">
																	{tip.key}
																</h6>
																<p className="mt-1 text-gray-600 text-sm">
																	{tip.value}
																</p>
															</div>
														))}
													</div>
												</div>
											)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PackageSpecifications;
