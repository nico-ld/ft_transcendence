import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, languageLinks, localizedPath } from "@/lib/metadata";

// the pages anyone can open, the ones behind a login are left out, see PRIVATE_PATHS
const PUBLIC_PATHS = ["/", "/login", "/signup", "/privacy", "/terms"];

const absolute = (path: string) => new URL(path, SITE_URL).href;

// /sitemap.xml: every public page in every language, each with its language links
export default function sitemap(): MetadataRoute.Sitemap {
	return PUBLIC_PATHS.flatMap((path) => {
		const languages = Object.fromEntries(
			Object.entries(languageLinks(path)).map(([lang, href]) => [lang, absolute(href)])
		);
		return routing.locales.map((locale) => ({
			url: absolute(localizedPath(locale, path)),
			alternates: { languages }
		}));
	});
}
