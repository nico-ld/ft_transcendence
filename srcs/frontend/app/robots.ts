import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PRIVATE_PATHS, SITE_URL, localizedPath } from "@/lib/metadata";

// /robots.txt: the public pages may be crawled, but not the API, Grafana and
// the pages behind a login, in any language
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/api/",
				"/grafana/",
				...PRIVATE_PATHS.flatMap((path) => [path, ...routing.locales.map((locale) => localizedPath(locale, path))])
			]
		},
		sitemap: new URL("/sitemap.xml", SITE_URL).href
	};
}
