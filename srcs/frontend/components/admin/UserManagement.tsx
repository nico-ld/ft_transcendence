"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ModifyUser } from "../users/ModifyUser";
import { NO_FILTERS } from "@/types/UserList";
import { UserPagination } from "./UserPagination";
import { UserList } from "./UserList";
import { UserToolBar } from "./UserToolBar";
import { useUserList } from "@/lib/useUserList";

import type { BackendUser } from "@/lib/backend";
import type { Viewer } from "@/types/Viewer";

export function UserManagement({users, viewer}: {
	users: BackendUser[] | null;
	viewer: Viewer
}) {
	const t = useTranslations("Users");
	const list = useUserList(users);
	const [selectedUser, setSelectedUser] = React.useState<BackendUser | null>(null);
	const [open, setOpen] = React.useState(false);

	function handleSelect(user: BackendUser) {
		setSelectedUser(user);
		setOpen(true);
	}

	return (
		<div className="flex h-[75dvh] w-full lg:w-2/5 min-w-0 flex-col rounded-xl border bg-card p-2">
			<UserToolBar
				sort={list.sort}
				onSortChange={list.changeSort}
				filters={list.filters}
				onFiltersChange={list.changeFilters}
				count={list.count}
			/>

			<ScrollArea key={list.current} className="min-h-0 flex-1">
				{list.nothingMatches ? (
					<div className="flex flex-col items-center gap-3 p-4 text-center text-sm text-muted-foreground">
						<p>{t("noMatch")}</p>
						<Button variant="outline" size="sm" onClick={() => list.changeFilters(NO_FILTERS)}>
							{t("filter.clear")}
						</Button>
					</div>
				) : (
					<UserList users={list.pageUsers} viewerId={viewer.id} onSelect={handleSelect} />
				)}
			</ScrollArea>

			{list.total > 0 && (
				<UserPagination
					page={list.current}
					pages={list.pages}
					total={list.total}
					onPageChange={list.setPage}
				/>
			)}

			{selectedUser && (
				<ModifyUser user={selectedUser} viewer={viewer} open={open} onOpenChange={setOpen} />
			)}
		</div>
	);
}
