import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import LegalPageLayout from "@/components/common/LegalPageLayout";
import { fetchLegalDocumentQuery } from "@/hooks/legalPagesHook";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/_all/terms-and-conditions")({
	component: RouteComponent,
	head: () => ({
		meta: [
			...seo({
				title: "Terms and Conditions | Self Drive 4x4 Uganda",
				description:
					"Read our terms and conditions for Self Drive 4x4 Uganda car rental services. Learn about rental agreements, insurance coverage, payment terms, and policies.",
				keywords: [
					"terms and conditions",
					"car rental terms Uganda",
					"rental agreement",
					"self drive terms",
					"4x4 rental policy",
					"Uganda car hire terms",
				],
				type: "article",
			}),
		],
	}),
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(
			fetchLegalDocumentQuery("terms-and-conditions")
		);
	},
});

function RouteComponent() {
	const { data: page } = useSuspenseQuery(
		fetchLegalDocumentQuery("terms-and-conditions")
	);

	return <LegalPageLayout fallbackTitle="Terms and Conditions" page={page} />;
}
