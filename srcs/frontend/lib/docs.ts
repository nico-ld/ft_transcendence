import fs from "node:fs";
import path from "node:path";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type DocEntry = {
	file: string;
	slug: string;
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
