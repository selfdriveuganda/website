import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import LegalPageLayout from "@/components/common/LegalPageLayout";
import { fetchLegalDocumentQuery } from "@/hooks/legalPagesHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/privacy-policy")({
	component: RouteComponent,
	head: () => ({
		meta: [
			...seo({
				title: "Privacy Policy | Self Drive 4x4 Uganda",
				description:
					"Learn how Self Drive 4x4 Uganda protects your privacy. Read our privacy policy to understand how we collect, use, and safeguard your personal information.",
				keywords: [
					"privacy policy",
					"data protection",
					"personal information",
					"self drive Uganda privacy",
					"car rental privacy",
					"GDPR compliance",
				],
				type: "article",
			}),
		],
	}),
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(
			fetchLegalDocumentQuery("privacy-policy")
		);
	},
});

function RouteComponent() {
	const { data: page } = useSuspenseQuery(
		fetchLegalDocumentQuery("privacy-policy")
	);

	return <LegalPageLayout fallbackTitle="Privacy Policy" page={page} />;
}
