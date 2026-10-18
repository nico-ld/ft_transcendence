import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDocEntries, getDoc } from "@/lib/docs";

const SECTIONS = ["user"];

type Props = {
	params: Promise<{section: string; slug: string}>;
};

export function generateStaticparams() {
	return SECTIONS.flatMap((section) =>
		getDocEntries(section).map(({slug}) => ({section, slug}))
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

	return (
		<main className="mx-auto w-full max-w-3xl px-6 py-12">
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
		</main>
	);
}

export default function DocPage({params}: Props) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DocContent params={params} />
		</Suspense>
	);
}
