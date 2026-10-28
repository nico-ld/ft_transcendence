export type DocPageProps = {
	params: Promise<{section: string; slug: string}>;
};

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
	items: DocNavItem[];
};

export type TocItem ={
	id: string;
	text: string;
	level: 2 | 3;
};
