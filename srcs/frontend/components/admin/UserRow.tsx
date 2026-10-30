import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RemoveUser } from "@/actions/RemoveUser";
import { GuestBadge, UserBadge } from "@/components/layout/CustomBadge";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";

import type { UserRowProps } from "@/types/UserList";
import { Role } from "@/types/User";

export function UserRow({user, viewerId, onSelect}: UserRowProps) {
	const t = useTranslations("Users");

	return (
		<Item
			className="bg-muted/50 transition hover:bg-popover"
			variant="outline"
			role="button"
			tabIndex={0}
			onClick={() => onSelect(user)}
			onKeyDown={(e) => {
				if (e.target !== e.currentTarget)
					return ;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(user);
				}
			}}
		>
			<ItemMedia>
				<Avatar>
					<AvatarImage src={user.avatar ?? undefined} />
					<AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
			</ItemMedia>
			<ItemContent className="gap-1">
				<ItemTitle>
					{user.username}
				</ItemTitle>
				<ItemDescription>{user.email}</ItemDescription>
			</ItemContent>
			<ItemActions onClick={(e) => e.stopPropagation()}>
				{
					user.role === Role.GUEST
					? <GuestBadge />
					: <UserBadge job={user.job ? t(`jobList.${user.job}`) : t("noJob")} />
				}
				{user.id !== viewerId && <RemoveUser user={user} />}
			</ItemActions>
		</Item>
	);
}
