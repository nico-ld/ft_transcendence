import { useTranslations } from "next-intl";
import { ItemGroup } from "@/components/ui/item";
import { UserRow } from "@/components/admin/UserRow";
import type { UserListProps } from "@/types/UserList";

export function UserList({users, viewerId, onSelect}: UserListProps) {
	const t = useTranslations("Users");

	if (users == null || users.length === 0)
		return <p className="p-4 text-center text-sm text-muted-foreground">{t("noUsers")}</p>;

	return (
		<ItemGroup>
			{users.map((user) => (
				<UserRow key={user.id} user={user} viewerId={viewerId} onSelect={onSelect} />
			))}
		</ItemGroup>
	);
}
