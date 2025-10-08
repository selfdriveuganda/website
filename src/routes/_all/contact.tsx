import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import CommonPageHero from "@/components/common/CommonPageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactInfo } from "@/hooks/siteSettingsHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/contact")({
	component: RouteComponent,
	head: () => ({
		meta: [
			...seo({
				title: "Contact Us | Self Drive 4x4 Uganda",
				description:
					"Get in touch with Self Drive 4x4 Uganda. Contact us for car rental inquiries, bookings, or any questions about our 4x4 vehicles and safari packages.",
				keywords: [
					"contact Uganda car rental",
					"4x4 rental contact",
					"Uganda safari contact",
					"car hire inquiries",
					"booking contact",
				],
			}),
		],
	}),
});

function RouteComponent() {
	const { contactInfo } = useContactInfo();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		const mailtoLink = `mailto:${contactInfo?.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
		window.location.href = mailtoLink;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen bg-background pt-16 sm:pt-18 md:pt-20">
			<CommonPageHero
				description="Get in touch with us for any inquiries or support."
				title="Contact Us"
			/>

			{/* Map Section */}
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-6xl overflow-hidden rounded-lg shadow-md">
					<iframe
						allowFullScreen
						className="h-96 w-full"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.756791436089!2d32.5!3d0.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMTgnMDAuMCJOIDMywrAzMCcwMC4wIkU!5e0!3m2!1sen!2sug!4v1234567890123!5m2!1sen!2sug"
						style={{ border: 0 }}
						title="Our location on the map"
					/>
				</div>
			</div>

			{/* Contact Details and Form Section */}
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
					{/* Contact Details */}
					<div>
						<h2 className="mb-8 font-bold text-2xl text-gray-900 md:text-3xl">
							Contact details
						</h2>

						<div className="space-y-6">
							{/* Address */}
							{contactInfo?.address && (
								<div className="flex gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<MapPin className="size-6" />
									</div>
									<div>
										<h3 className="mb-1 font-semibold text-gray-900 text-lg">
											Headquarter Office
										</h3>
										<p className="text-gray-600">{contactInfo.address}</p>
									</div>
								</div>
							)}

							{/* Phone */}
							{contactInfo?.phone && (
								<div className="flex gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Phone className="size-6" />
									</div>
									<div>
										<h3 className="mb-1 font-semibold text-gray-900 text-lg">
											{contactInfo.phone}
										</h3>
										<p className="text-gray-600">Call us</p>
									</div>
								</div>
							)}

							{/* Email */}
							{contactInfo?.email && (
								<div className="flex gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Mail className="size-6" />
									</div>
									<div>
										<h3 className="mb-1 font-semibold text-gray-900 text-lg">
											{contactInfo.email}
										</h3>
										<p className="text-gray-600">Send us an email</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Contact Form */}
					<div>
						<h2 className="mb-8 font-bold text-2xl text-gray-900 md:text-3xl">
							Send us a message
						</h2>

						<form className="space-y-6" onSubmit={handleSubmit}>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<Input
										name="name"
										onChange={handleChange}
										placeholder="Your Name"
										required
										type="text"
										value={formData.name}
									/>
								</div>
								<div>
									<Input
										name="email"
										onChange={handleChange}
										placeholder="Your Email"
										required
										type="email"
										value={formData.email}
									/>
								</div>
							</div>

							<div>
								<Input
									name="subject"
									onChange={handleChange}
									placeholder="Subject"
									required
									type="text"
									value={formData.subject}
								/>
							</div>

							<div>
								<Textarea
									className="min-h-[150px]"
									name="message"
									onChange={handleChange}
									placeholder="Your Message"
									required
									value={formData.message}
								/>
							</div>

							<Button className="w-full md:w-auto" size="lg" type="submit">
								<Send className="mr-2 size-5" />
								Send Message
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
