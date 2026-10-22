import { LegalFooter } from "./LegalFooter";

export function LandingFooter() {
	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<p>© 2026 Silk Space</p>
				<nav aria-label="Legal" className="flex gap-4">
					<LegalFooter />
				</nav>
			</div>
		</footer>
	);
}
