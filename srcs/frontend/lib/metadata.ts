import "server-only";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

// where nginx serves the site, for the absolute links search engines need
// (canonical and language links). Read at build time; SITE_URL can override it
export const SITE_URL = new URL(process.env.SITE_URL ?? "https://localhost:6767");

// the pages behind a login, kept out of search engines: noindex in the (app)
// layout, disallowed in robots.txt, left out of the sitemap
export const PRIVATE_PATHS = ["/admin", "/user", "/guest", "/profile", "/workspace", "/friends"];

/** The pages with their own title and description, under Metadata.pages in messages/*.json */
export type PageKey = "login" | "signup" | "user" | "admin" | "guest" | "profile" | "workspace" | "friends";

/**
 * A page's title and description, in the page's language. The root layout's
 * title template adds the site's name after the title.
 * With the page's path (without the language, e.g. "/login"), also its
 * canonical and language links: only for the public pages.
 * The language comes from the route (next/root-params), not from the request,
 * so the metadata doesn't stop a page from being prerendered.
 */
export async function pageMetadata(page: PageKey, path?: string): Promise<Metadata> {
	const t = await getTranslations("Metadata.pages");

	return {
		title: t(`${page}.title`),
		description: t(`${page}.description`),
		...(path && { alternates: await languageAlternates(path) })
	};
}

/** A path in one language: "/login" → "/fr/login", "/" → "/fr" */
export function localizedPath(locale: string, path: string) {
	return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * The same page in every language (hreflang), for the pages and the sitemap.
 * x-default is the path without a language: from there, the proxy sends
 * visitors to their browser's language.
 */
export function languageLinks(path: string): Record<string, string> {
	return {
		...Object.fromEntries(routing.locales.map((lang) => [lang, localizedPath(lang, path)])),
		"x-default": path
	};
}

/** The canonical link of a public page, in the page's language, and its language links */
export async function languageAlternates(path: string): Promise<Metadata["alternates"]> {
	const locale = await getLocale();

	return { canonical: localizedPath(locale, path), languages: languageLinks(path) };
}
