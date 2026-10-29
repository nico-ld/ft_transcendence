import { Badge } from "../ui/badge";
import { Pin, Sword, User } from "lucide-react";
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

export function GuestBadge() {
	const t = useTranslations("Users");

	return (
		<Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
			<Pin className="size-3" />
			<User />
			{t("guest")}
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
