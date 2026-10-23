import { Suspense } from "react";
import { getDocNav } from "@/lib/docs";
import { DocsNav } from "./docs-nav";
import { getLocale } from "next-intl/server";

export async function DocsSidebar() {
	const sections = getDocNav(await getLocale());

	return (
		<nav aria-label="Documentation">
			<Suspense fallback={null}>
				<DocsNav sections={sections} />
			</Suspense>
		</nav>
	);
}
