import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { ComponentType } from "react";
import { DocEntry, DocFrontmatter, DocNavSection, TocItem} from "@/types/Doc";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export const DOC_SECTIONS = [
	{id: "users", label: "User guide"},
	{id: "developers", label: "Developer guide"}
] as const;


export function getDocEntries(section: string): DocEntry[] {
	const dir = path.join(DOCS_DIR, section);

	if (!fs.existsSync(dir))
		return [];

	return fs
		.readdirSync(dir)
		.filter((name) => name.endsWith(".mdx"))
		.sort()
		.map((name) => {
			const file = name.replace(/\.mdx$/, "");
			return {file, slug: file.replace(/^\d+-/, "")};
		});
}

export async function getDoc(section: string, slug: string) {
	const entry = getDocEntries(section).find((e) => e.slug == slug);
	if (!entry)
		return null;

	const mod = await import(`@/content/docs/${section}/${entry.file}.mdx`);

	const raw = fs.readFileSync(
		path.join(DOCS_DIR, section, `${entry.file}.mdx`),
		"utf8"
	);
	const toc = extractToc(matter(raw).content);

	return {
		Content: mod.default as ComponentType,
		frontmatter: mod.frontmatter as DocFrontmatter,
		toc
	};
}

export function getDocNav(): DocNavSection[] {
	return DOC_SECTIONS.map(({id, label}) => ({
		id,
		label,
		items: getDocEntries(id).map(({file, slug}) => {
			const raw = fs.readFileSync(
				path.join(DOCS_DIR, id, `${file}.mdx`),
				"utf8"
			);
			const {data} = matter(raw);
			return {
				slug,
				title: (data.title as string) ?? slug,
				href: `/docs/${id}/${slug}`
			};
		})
	}));
}

export function getAdjacentDocs(section: string, slug: string) {
	const items = getDocNav().find((s) => s.id === section)?.items ?? [];
	const index = items.findIndex((item) => item.slug === slug);

	if (index === -1)
		return {prev: null, next: null};

	return {
		prev: items[index - 1] ?? null,
		next: items[index + 1] ?? null
	};
}

export function extractToc(source: string): TocItem[] {
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
