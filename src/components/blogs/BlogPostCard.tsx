import type { SanityDocument } from "@sanity/client";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "../../sanity/client";
import { Button } from "../ui/button";

export const BlogPostCard = ({ blog }: { blog: SanityDocument }) => (
	<Link
		className="group relative block h-[350px] w-full max-w-full overflow-hidden rounded-xl sm:h-[400px] sm:max-w-[358px] md:h-[460px]"
		params={{
			blogSlug: blog.slug.current,
		}}
		to="/blogs/$blogSlug"
	>
		{/* Background Image - Layer 1 */}
		<div
			className="absolute inset-0 z-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
			style={{
				backgroundImage: `url(${urlFor(blog.images[0]).url()})`,
			}}
		/>

		{/* Gradient Overlay - Layer 2 */}
		<div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

		{/* Content - Layer 3 */}
		<div className="relative z-20 flex h-full flex-col justify-between">
			{/* Top Right Button */}
			<div className="flex justify-end p-4 sm:p-5 md:p-6">
				<Button
					aria-label="View details"
					className="h-[36px] w-[36px] rounded-[8px] bg-black hover:bg-gray-800 sm:h-[40px] sm:w-[40px] sm:rounded-[10px] md:h-[46px] md:w-[46px]"
					size="icon"
					variant="default"
				>
					<ArrowUpRight className="text-white" size={16} />
				</Button>
			</div>

			{/* Bottom Content */}
			<div className="px-4 pb-[25px] text-white sm:px-6 sm:pb-[30px] md:px-8 md:pb-[37px]">
				<div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
					<p className="font-['Inter',_sans-serif] text-[12px] leading-tight sm:text-[14px] sm:leading-[21px]">
						{format(new Date(blog.publishedAt), "MMMM dd, yyyy")}
					</p>
					<div className="flex flex-col items-start gap-1">
						<h3 className="font-['Inter-Bold',_sans-serif] font-bold text-[18px] leading-tight sm:text-[20px] sm:leading-[28px]">
							{blog.title}
						</h3>
						<p className="line-clamp-3 h-[42px] overflow-hidden font-['Inter',_sans-serif] text-[12px] leading-tight sm:h-[63px] sm:text-[14px] sm:leading-[21px]">
							{blog.body[0].children[0].text}
						</p>
					</div>
				</div>
			</div>
		</div>
	</Link>
);
