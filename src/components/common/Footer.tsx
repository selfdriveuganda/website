import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import type React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="mt-20 bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
			<div className="container mx-auto grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
				{/* Column 1: Company Info & Copyright */}
				<div className="flex flex-col md:col-span-1">
					<div className="mb-6">
						{" "}
						{/* Company Info Wrapper */}
						<div className="mb-5 space-y-1 font-medium text-xs leading-[18px]">
							<p className="mb-1 font-bold text-sm">Self Drive 4x4 Uganda</p>
							<p>Najja Shopping Center, Entebbe Road - Kampala Uganda</p>
							<p>+256 7748 73278</p>
						</div>
						<div className="flex gap-5">
							<a
								aria-label="Facebook"
								className="transition-opacity hover:opacity-75"
								href="#"
							>
								<Facebook size={16} />
							</a>
							<a
								aria-label="Twitter"
								className="transition-opacity hover:opacity-75"
								href="#"
							>
								<Twitter size={16} />
							</a>
							<a
								aria-label="LinkedIn"
								className="transition-opacity hover:opacity-75"
								href="#"
							>
								<Linkedin size={16} />
							</a>
							<a
								aria-label="Instagram"
								className="transition-opacity hover:opacity-75"
								href="#"
							>
								<Instagram size={16} />
							</a>
						</div>
					</div>
				</div>

				{/* Columns 2 & 3 combined for links: Spans 2 columns on md and up */}
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
					{/* Link Column 1: Primary Pages */}
					<div className="space-y-3">
						<p className="mb-1 font-medium text-xs leading-[18px]">
							Primary Pages
						</p>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/cars"
						>
							All Cars
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/services"
						>
							Our Services
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/contact"
						>
							Contact Us
						</Link>
					</div>
					{/* Link Column 2: Listing */}
					<div className="space-y-3">
						<p className="mb-1 font-medium text-xs leading-[18px]">Listing</p>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/cars?type=4x4"
						>
							4x4 Vehicles
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/cars?type=exotic"
						>
							Exotic Cars
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/cars?type=safari"
						>
							Safari Vehicles
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/blogs"
						>
							Our Blog
						</Link>
					</div>
					{/* Link Column 3: Overview & Details */}
					<div className="space-y-3">
						<p className="mb-1 font-medium text-xs leading-[18px]">
							Overview & Details
						</p>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/how-it-works"
						>
							How Our Rentals Work
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/terms-and-conditions"
						>
							Terms & Conditions
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/privacy-policy"
						>
							Privacy Policy
						</Link>
						<Link
							className="block font-bold text-sm leading-[21px] transition-colors hover:underline"
							to="/faq"
						>
							FAQs
						</Link>
					</div>
				</div>
			</div>
			<div className="mt-auto flex justify-center pt-10 font-medium text-xs">
				<p>© 2025 Self Drive 4x4 Uganda. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
