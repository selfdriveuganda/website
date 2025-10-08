import type { SanityDocument } from "@sanity/client";
import { queryOptions } from "@tanstack/react-query";
import { client } from "@/sanity/client";

const LEGAL_DOCUMENT_QUERY = `
  *[_type == "legalDocument" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    "slug": slug.current,
    documentType,
    shortDescription,
    content,
    effectiveDate,
    lastUpdated,
    version,
    isActive
  }
`;

export const fetchLegalDocumentQuery = (slug: string) =>
	queryOptions({
		queryKey: ["legal-document", slug],
		queryFn: async () => {
			try {
				return await client.fetch<SanityDocument>(LEGAL_DOCUMENT_QUERY, {
					slug,
				});
			} catch (_error) {
				return null;
			}
		},
	});
