import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FriendButton } from "@/components/friends/FriendButton";
import { FriendRow } from "@/components/friends/FriendRow";
import { FriendSearch } from "@/components/friends/FriendSearch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { getCurrentUser } from "@/lib/backend";
import { getFriends, searchUsers } from "@/lib/friends";
import type { UserSearchResult } from "@/types/Friends";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("friends");
}

type FriendsPageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function FriendsPage({ searchParams }: FriendsPageProps) {
	return (
		<Suspense fallback={null}>
			<FriendsList searchParams={searchParams} />
		</Suspense>
	);
}

// reads the session, so it renders at request time, inside the Suspense above.
// The lists update when something changes: the buttons' actions and the
// realtime events both refresh the page (components/layout/RealtimeProvider.tsx)
async function FriendsList({ searchParams }: FriendsPageProps) {
	const { q } = await searchParams;
	const query = typeof q === "string" ? q.trim() : "";
	const [user, locale, t, { friends, incoming, outgoing }, results] = await Promise.all([
		getCurrentUser(),
		getLocale(),
		getTranslations("Friends"),
		getFriends(),
		// the backend wants at least 2 characters
		query.length >= 2 ? searchUsers(query) : null
	]);

	if (!user)
		return redirect({ href: "/login", locale });

	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			<div className="flex w-full max-w-2xl flex-col gap-5">
				<Card className="ring-border">
					<CardHeader>
						<CardTitle>{t("title")}</CardTitle>
						<CardDescription>{t("description")}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<FriendSearch defaultValue={query} />
						{results && (results.length === 0
							? <p className="text-sm text-muted-foreground">{t("noResults")}</p>
							: (
								<ItemGroup className="gap-2">
									{results.map((found) => (
										<FriendRow key={found.id} user={found}>
											<SearchAction user={found} t={t} />
										</FriendRow>
									))}
								</ItemGroup>
							))}
					</CardContent>
				</Card>

				{incoming.length > 0 && (
					<Card className="ring-border">
						<CardHeader>
							<CardTitle>{t("requests")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ItemGroup className="gap-2">
								{incoming.map((other) => (
									<FriendRow key={other.id} user={other}>
										<FriendButton userId={other.id} action="add" variant="default">{t("accept")}</FriendButton>
										<FriendButton userId={other.id} action="remove">{t("decline")}</FriendButton>
									</FriendRow>
								))}
							</ItemGroup>
						</CardContent>
					</Card>
				)}

				<Card className="ring-border">
					<CardHeader>
						<CardTitle>{t("friends")}</CardTitle>
					</CardHeader>
					<CardContent>
						{friends.length === 0
							? <p className="text-sm text-muted-foreground">{t("noFriends")}</p>
							: (
								<ItemGroup className="gap-2">
									{friends.map((friend) => (
										<FriendRow key={friend.id} user={friend} showOnline>
											<FriendButton
												userId={friend.id}
												action="remove"
												variant="ghost"
												success={t("removed", { username: friend.username })}
											>
												{t("remove")}
											</FriendButton>
										</FriendRow>
									))}
								</ItemGroup>
							)}
					</CardContent>
				</Card>

				{outgoing.length > 0 && (
					<Card className="ring-border">
						<CardHeader>
							<CardTitle>{t("sent")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ItemGroup className="gap-2">
								{outgoing.map((other) => (
									<FriendRow key={other.id} user={other}>
										<FriendButton userId={other.id} action="remove">{t("cancel")}</FriendButton>
									</FriendRow>
								))}
							</ItemGroup>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardShell>
	);
}

// what can be done with a search result, depending on what they already are to us
function SearchAction({ user, t }: {
	user: UserSearchResult;
	t: Awaited<ReturnType<typeof getTranslations<"Friends">>>;
}) {
	if (user.relation === "friend")
		return <Badge variant="secondary">{t("isFriend")}</Badge>;
	if (user.relation === "outgoing")
		return <Badge variant="outline">{t("pending")}</Badge>;
	return (
		<FriendButton userId={user.id} action="add" variant={user.relation === "incoming" ? "default" : "outline"}>
			{user.relation === "incoming" ? t("accept") : t("add")}
		</FriendButton>
	);
}
