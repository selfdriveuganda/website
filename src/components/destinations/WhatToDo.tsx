import { PortableText, type PortableTextBlock } from "@portabletext/react";
import type { SanityDocument } from "@sanity/client";

type WhatToDoProps = {
	destination: SanityDocument;
};

type Activity = {
	name: string;
	description?: PortableTextBlock[];
};

function WhatToDo({ destination }: WhatToDoProps) {
	return (
		<div className="w-full bg-gray-50 py-16 md:py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-bold text-2xl text-gray-900 md:text-3xl lg:text-4xl">
					What to do in <span className="capitalize">{destination.name}</span>
				</h2>

				<div className="space-y-6 pt-4 md:space-y-8">
					{destination.whatToDo?.activities?.length > 0 ? (
						(destination.whatToDo.activities as Activity[]).map(
							(activity, index) => (
								<div className="space-y-2" key={activity.name}>
									<h3 className="font-semibold text-base text-gray-900">
										{index + 1}. {activity.name}
									</h3>
									{activity.description ? (
										<div className="prose prose-sm max-w-4xl text-gray-600">
											<PortableText value={activity.description} />
										</div>
									) : (
										<p className="max-w-4xl text-gray-600 text-sm leading-relaxed">
											No description available
										</p>
									)}
								</div>
							)
						)
					) : (
						<p className="text-center text-gray-600 text-sm">
							No activities available for this destination.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default WhatToDo;
