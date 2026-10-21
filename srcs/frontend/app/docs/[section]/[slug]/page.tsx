import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc } from "@/components/docs/docs-toc";
import { 
	getDoc, 
	getDocEntries,
	getAdjacentDocs,
	DOC_SECTIONS 
} from "@/lib/docs";
import { DocPageProps } from "@/types/Doc";

export function generateStaticparams() {
	return DOC_SECTIONS.flatMap(( {id} ) =>
		getDocEntries(id).map(({slug}) => ({section: id, slug}))
	);
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
	const { section, slug} = await params;
	const doc = await getDoc(section, slug);
	if (!doc)
		return {};

	return {
		title: doc.frontmatter.title,
		description: doc.frontmatter.description
	};
}

async function DocContent({params}: DocPageProps) {
	const {section, slug} = await params;
	const doc = await getDoc(section, slug);
	if (!doc)
		notFound();

	const {Content, frontmatter, toc} = doc;
	const {prev, next} = getAdjacentDocs(section, slug);

	return (
		<div className="flex gap-20">
			<div className="min-w-0 max-w-3xl flex-1">
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
			{toc.length > 0 && (
				<aside className="hidden w-52 shrink-0 xl:block">
					<div className="sticky top-12">
						<DocsToc items={toc} />
					</div>
				</aside>
			)}
		</div>
	);
}

export default function DocPage({params}: DocPageProps) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DocContent params={params} />
		</Suspense>
	);
}
