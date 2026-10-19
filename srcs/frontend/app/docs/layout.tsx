import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-12">
			<aside className="hidden w-56 shrink-0 md:block">
				<div className="sticky top-12">
					<DocsSidebar />
				</div>
			</aside>
			<main className="min-w-0 max-w-3xl flex-1">{children}</main>
		</div>
	);
}
