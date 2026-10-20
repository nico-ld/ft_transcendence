import { Suspense } from "react";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { getDocNav } from "@/lib/docs";

export default function DocsLayout({children}: {children: React.ReactNode}) {
	const sections = getDocNav();

	return (
		<div className="mx-auto flex w-full max-w-8xl gap-20 px-6 py-12">
			<aside className="hidden w-56 shrink-0 md:block">
				<div className="sticky top-12">
					<DocsSidebar />
				</div>
			</aside>
			<div className="min-w-0 flex-1">
				<Suspense fallback={null}>
					<DocsMobileNav sections={sections} />
				</Suspense>
				<main>{children}</main>
			</div>
		</div>
	);
}
