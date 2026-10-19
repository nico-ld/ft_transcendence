import { Suspense } from "react";
import { getDocNav } from "@/lib/docs";
import { DocsNav } from "./docs-nav";

export function DocsSidebar() {
	const sections = getDocNav();

	return (
		<nav aria-label="Documentation">
			<Suspense fallback={null}>
				<DocsNav sections={sections} />
			</Suspense>
		</nav>
	);
}
