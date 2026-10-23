import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LegalFooter() {
	const t = useTranslations("Legal");

	return (
		<>
		<Link href="#" className="hover:underline">{t("privacy")}</Link>
			<span aria-hidden="true"> - </span>
		<Link href="#" className="hover:underline">{t("terms")}</Link>
		</>
	);
}
