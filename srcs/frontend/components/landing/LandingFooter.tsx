import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { legalInfo } from "@/components/legal/LegalInfo";
import { LegalFooter } from "@/components/legal/LegalFooter";

export function LandingFooter() {
	const t = useTranslations("Legal");

	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<section className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<article className="flex flex-row gap-5 items-center">
					{t("studentProject", { project: legalInfo.projectName, school: legalInfo.school })}
				</article>
				<article className="flex flex-row gap-3 items-center">
					<LanguageSwitcher />
					<LegalFooter />
				</article>
			</section>
		</footer>
	);
}
