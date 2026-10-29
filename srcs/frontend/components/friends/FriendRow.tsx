"use client";

import { useTranslations } from "next-intl";
import { useIsOnline } from "@/components/layout/RealtimeProvider";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { PublicUser } from "@/types/Friends";

// One user in a list with the buttons as children
// showOnline: friends only
export function FriendRow({ user, showOnline = false, children }: {
	user: PublicUser;
	showOnline?: boolean;
	children?: React.ReactNode;
}) {
	const online = useIsOnline(user.id);
	const t = useTranslations("Friends");

	return (
		<Item variant="outline" className="bg-muted/50">
			<ItemMedia>
				<Avatar>
					<AvatarImage src={user.avatar ?? undefined} alt="" />
					<AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
					{showOnline && online && <AvatarBadge className="bg-green-500" />}
				</Avatar>
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{user.username}</ItemTitle>
				{showOnline && <ItemDescription>{t(online ? "online" : "offline")}</ItemDescription>}
			</ItemContent>
			<ItemActions>{children}</ItemActions>
		</Item>
	);
}
