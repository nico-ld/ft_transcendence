import fs from "node:fs";
import path from "node:path";
import { ComponentType } from "react";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type DocEntry = {
	file: string;
	slug: string;
};

export type DocFrontmatter = {
	title: string;
	description?: string;
};

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
	return {
		Content: mod.default as ComponentType,
		frontmatter: mod.frontmatter as DocFrontmatter
	};
}
