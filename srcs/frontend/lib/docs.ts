import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ComponentType } from "react";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export const DOC_SECTIONS = [
	{id: "users", label: "User guide"},
	// {id: "dev", label: "Developer guide"}
] as const;

export type DocEntry = {
	file: string;
	slug: string;
};

export type DocFrontmatter = {
	title: string;
	description?: string;
};

export type DocNavItem = {
	slug: string;
	title: string;
	href: string;
};

export type DocNavSection = {
	id: string;
	label: string;
	items: DocNavItem[];
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
