import { LegalFooter } from "./LegalFooter";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";

export function LandingFooter() {
	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<div className="flex flex-row gap-5 items-center">
					<p>© 2026 Silk Space</p>
					<LanguageSwitcher />
				</div>
				<nav aria-label="Legal" className="flex gap-4">
					<LegalFooter />
				</nav>
			</div>
		</footer>
	);
}
