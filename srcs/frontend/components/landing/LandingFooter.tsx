import { LegalFooter } from "../legal/LegalFooter";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";
import { legalInfo } from "../legal/LegalInfo";

export function LandingFooter() {
	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<div className="flex flex-row gap-5 items-center">
					{legalInfo.projectName}, a student project at {legalInfo.school}
				</div>
				<nav aria-label="Legal" className="flex flex-row items-center gap-4">
					<LanguageSwitcher />
					<LegalFooter />
				</nav>
			</div>
		</footer>
	);
}
