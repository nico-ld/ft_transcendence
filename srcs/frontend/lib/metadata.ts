import "server-only";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/** The pages with their own title and description, under Metadata.pages in messages/*.json */
export type PageKey = "login" | "signup" | "user" | "admin" | "guest" | "profile" | "workspace" | "friends";

/**
 * A page's title and description, in the page's language.
 * The language comes from the route (next/root-params).
 */
export async function pageMetadata(page: PageKey): Promise<Metadata> {
	const t = await getTranslations("Metadata.pages");

	return {
		title: t(`${page}.title`),
		description: t(`${page}.description`)
	};
}
