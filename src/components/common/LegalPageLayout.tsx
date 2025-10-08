import { PortableText, type PortableTextBlock } from "@portabletext/react";
import type { SanityDocument } from "@sanity/client";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

type LegalPageLayoutProps = {
	page: SanityDocument | null;
	fallbackTitle: string;
};

const portableTextComponents = {
	block: {
		h1: ({ children }: { children?: React.ReactNode }) => (
			<h1 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
				{children}
			</h1>
		),
		h2: ({ children }: { children?: React.ReactNode }) => (
			<h2 className="mt-8 mb-3 font-bold text-2xl text-gray-900 md:text-3xl">
				{children}
			</h2>
		),
		h3: ({ children }: { children?: React.ReactNode }) => (
			<h3 className="mt-6 mb-2 font-semibold text-gray-900 text-xl md:text-2xl">
				{children}
			</h3>
		),
		h4: ({ children }: { children?: React.ReactNode }) => (
			<h4 className="mt-4 mb-2 font-semibold text-gray-900 text-lg md:text-xl">
				{children}
			</h4>
		),
		normal: ({ children }: { children?: React.ReactNode }) => (
			<p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
		),
		blockquote: ({ children }: { children?: React.ReactNode }) => (
			<blockquote className="my-6 border-gray-300 border-l-4 pl-4 text-gray-600 italic">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }: { children?: React.ReactNode }) => (
			<ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
				{children}
			</ul>
		),
		number: ({ children }: { children?: React.ReactNode }) => (
			<ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }: { children?: React.ReactNode }) => (
			<li className="leading-relaxed">{children}</li>
		),
		number: ({ children }: { children?: React.ReactNode }) => (
			<li className="leading-relaxed">{children}</li>
		),
	},
	marks: {
		strong: ({ children }: { children?: React.ReactNode }) => (
			<strong className="font-semibold text-gray-900">{children}</strong>
		),
		em: ({ children }: { children?: React.ReactNode }) => (
			<em className="italic">{children}</em>
		),
		link: ({
			children,
			value,
		}: {
			children?: React.ReactNode;
			value?: { href: string };
		}) => (
			<a
				className="text-blue-600 underline hover:text-blue-800"
				href={value?.href}
				rel="noopener noreferrer"
				target="_blank"
			>
				{children}
			</a>
		),
	},
};

function LegalPageLayout({ page, fallbackTitle }: LegalPageLayoutProps) {
	if (!page) {
		return (
			<div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<h1 className="font-bold text-3xl text-gray-900">{fallbackTitle}</h1>
				<p className="mt-4 text-gray-600">
					Content not available at this time.
				</p>
			</div>
		);
	}

	return (
		<div className="pt-16 sm:pt-18 md:pt-20">
			{/* Hero Section */}
			<div className="bg-gray-50 py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="font-bold text-4xl text-gray-900 md:text-5xl lg:text-6xl">
						{page.title || fallbackTitle}
						{page.version && (
							<span className="ml-3 text-2xl text-gray-500 md:text-3xl">
								v{page.version}
							</span>
						)}
					</h1>
					{page.shortDescription && (
						<p className="mt-4 text-base text-gray-700 md:text-lg">
							{page.shortDescription}
						</p>
					)}
					<div className="mt-4 flex flex-wrap gap-4 text-gray-600 text-sm md:text-base">
						{page.effectiveDate && (
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span>
									Effective:{" "}
									{format(new Date(page.effectiveDate), "MMMM d, yyyy")}
								</span>
							</div>
						)}
						{page.lastUpdated && (
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span>
									Last Updated:{" "}
									{format(new Date(page.lastUpdated), "MMMM d, yyyy")}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="bg-white py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="prose prose-lg mx-auto max-w-4xl">
						{page.content && (
							<PortableText
								components={portableTextComponents}
								value={page.content as PortableTextBlock[]}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LegalPageLayout;
