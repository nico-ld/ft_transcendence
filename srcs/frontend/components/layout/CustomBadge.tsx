import { Badge } from "../ui/badge";
import { Sword } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdminBadge() {
	const t = useTranslations("Header");

	return (
		<Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
			<Sword />
			{t("admin")}
		</Badge>
	);
}

export function UserBadge( {job}: {job: string;}) {
	return (
		<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
			{job}
		</Badge>
	);
}
