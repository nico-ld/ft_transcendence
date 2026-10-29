import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import GithubSlugger from "github-slugger";
import { routing } from "@/i18n/routing";
import type { DocFrontmatter, TocItem } from "@/types/Doc";

export type LegalSlug = "privacy" | "terms";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

function extractToc(source: string): TocItem[] {
	const slugger = new GithubSlugger();
	const items: TocItem[] = [];
	let inFence = false;

	for (const line of source.split("\n")) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			continue ;
		}
		if (inFence)
			continue ;

		const match = /^(#{2,3})\s+(.+?)(?:\s+#+)?\s*$/.exec(line);
		if (!match)
			continue ;

		const text = match[2]
			.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
			.replace(/[`*~]/g, "")
			.trim();

		items.push({
			id: slugger.slug(text),
			text,
			level: match[1].length as 2 | 3
		});
	}

	return items;
}

// legal page in the given language
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
