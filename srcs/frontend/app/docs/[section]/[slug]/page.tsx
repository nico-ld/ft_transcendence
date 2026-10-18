import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDocEntries } from "@/lib/docs";

const SECTIONS = ["user"];

type Props = {
	params: Promise<{section: string; slug: string}>;
};

export function generateStaticparams() {
	return SECTIONS.flatMap((section) =>
		getDocEntries(section).map(({slug}) => ({section, slug}))
	);
}

async function DocContent({params}: Props) {
	const {section, slug} = await params;

	const entry = getDocEntries(section).find((e) => e.slug === slug);
	if (!entry)
		notFound();

	const {default: Content} = await import(`@/content/docs/${section}/${entry.file}.mdx`);

	return (
		<article>
			<Content />
		</article>
	);
}

export default function DocPage({params}: Props) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DocContent params={params} />
		</Suspense>
	);
}
