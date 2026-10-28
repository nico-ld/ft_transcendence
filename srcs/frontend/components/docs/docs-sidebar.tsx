import { Suspense } from "react";
import { getDocNav } from "@/lib/docs";
import { DocsNav } from "./docs-nav";
import { getLocale, getTranslations } from "next-intl/server";

export async function DocsSidebar() {
	const [locale, t] = await Promise.all([getLocale(), getTranslations("Docs")]);
	const sections = getDocNav(locale);

	return (
		<nav aria-label={t("documentation")}>
			<Suspense fallback={null}>
				<DocsNav sections={sections} />
			</Suspense>
		</nav>
	);
}
