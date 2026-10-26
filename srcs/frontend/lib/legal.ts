import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { routing } from "@/i18n/routing";
import { extractToc } from "@/lib/docs";
import type { DocFrontmatter } from "@/types/Doc";

export type LegalSlug = "privacy" | "terms";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

/** A legal page in the given language (English if missing), with its contents list. */
export async function getLegalDoc(locale: string, slug: LegalSlug) {
	const lang = fs.existsSync(path.join(LEGAL_DIR, locale, `${slug}.mdx`)) ? locale : routing.defaultLocale;
	const mod = await import(`@/content/legal/${lang}/${slug}.mdx`);
	const raw = fs.readFileSync(path.join(LEGAL_DIR, lang, `${slug}.mdx`), "utf8");

	return {
		Content: mod.default as ComponentType,
		frontmatter: mod.frontmatter as DocFrontmatter,
		toc: extractToc(raw).filter((item) => item.level === 2)
	};
}
