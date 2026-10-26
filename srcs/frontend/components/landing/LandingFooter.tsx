import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";
import { legalInfo } from "../legal/LegalInfo";

export function LandingFooter() {
	const t = useTranslations("Legal");

	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<div className="flex flex-row gap-5 items-center">
					{t("studentProject", { project: legalInfo.projectName, school: legalInfo.school })}
				</div>
				<LanguageSwitcher />
			</div>
		</footer>
	);
}
