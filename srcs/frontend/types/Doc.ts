export type DocFrontmatter = {
	title: string;
	description?: string;
};

export type TocItem ={
	id: string;
	text: string;
	level: 2 | 3;
};
