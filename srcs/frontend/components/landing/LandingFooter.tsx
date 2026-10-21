import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LandingFooter() {
	const t = useTranslations("Legal");

	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<p>© 2026 Silk Space</p>
				<nav aria-label="Legal" className="flex gap-4">
					<Link href="#" className="hover:underline">{t("privacy")}</Link>
					<span aria-hidden="true"> - </span>
					<Link href="#" className="hover:underline">{t("terms")}</Link>
				</nav>
			</div>
		</footer>
	);
}
