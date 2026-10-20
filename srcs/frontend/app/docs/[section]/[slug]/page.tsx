import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/docs/docs-pager";
import { 
	getDoc, 
	getDocEntries,
	getAdjacentDocs, 
	DOC_SECTIONS 
} from "@/lib/docs";

type Props = {
	params: Promise<{section: string; slug: string}>;
};

export function generateStaticparams() {
	return DOC_SECTIONS.flatMap(( {id} ) =>
		getDocEntries(id).map(({slug}) => ({section: id, slug}))
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { section, slug} = await params;
	const doc = await getDoc(section, slug);
	if (!doc)
		return {};

	return {
		title: doc.frontmatter.title,
		description: doc.frontmatter.description
	};
}

async function DocContent({params}: Props) {
	const {section, slug} = await params;
	const doc = await getDoc(section, slug);
	if (!doc)
		notFound();

	const {Content, frontmatter} = doc;
	const {prev, next} = getAdjacentDocs(section, slug);

	return (
		<div>
			<header className="mb-8 border-b pb-6">
				<h1 className="text-4xl font-bold tracking-tight">
					{frontmatter.title}
				</h1>
				{frontmatter.description && (
					<p className="mt-2 text-lg text-muted-foreground">
						{frontmatter.description}
					</p>
				)}
			</header>

			<article className="prose max-w-none">
				<Content />
			</article>
			<DocsPager prev={prev} next={next} />
		</div>
	);
}

export default function DocPage({params}: Props) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DocContent params={params} />
		</Suspense>
	);
}
