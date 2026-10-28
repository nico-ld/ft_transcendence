"use client";

import * as React from "react";
import { Funnel } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModifyUser } from "@/components/users/ModifyUser";

import { NewUserForm } from "@/actions/NewUserForm";
import { RemoveUser } from "@/actions/RemoveUser";

import { AdminBadge, UserBadge } from "../layout/CustomBadge";
import { useTranslations } from "next-intl";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
 } from "@/components/ui/avatar";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle
} from "@/components/ui/item";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import type { SortKey } from "@/types/User"
import type { BackendUser } from "@/lib/backend";
import type { Viewer } from "@/types/Viewer";

function sortUsers(list: BackendUser[], key: SortKey) {
	return [...list].sort((a, b) =>
			key === "date"
					? b.createdAt.localeCompare(a.createdAt)
					: a[key].localeCompare(b[key], undefined, {sensitivity: "base"})
	);
}

function UserList({ users, viewerId, onSelect }: {users: BackendUser[] | null; viewerId: number; onSelect: (user: BackendUser) => void }) {
	const t = useTranslations("Users");

	if (users == null || users.length === 0) {
		return <p className="p-4 text-center text-sm text-muted-foreground">{t("noUsers")}</p>
	}

	return (
		<ItemGroup className="max-w-md">
			{users.map((person) => (
				<Item
					key={person.id}
					className="bg-muted/50 transition hover:bg-popover"
					variant="outline"
					role="button"
					tabIndex={0}
					onClick={() => onSelect(person)}
					onKeyDown={(e) => {
						if (e.target !== e.currentTarget)
							return ;
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onSelect(person);
						}
					}}
				>
					<ItemMedia>
						<Avatar>
							<AvatarImage src={person.avatar ?? undefined} />
							<AvatarFallback>{person.username.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
					</ItemMedia>
					<ItemContent className="gap-1">
						<ItemTitle>
							{person.username}
							{person.role === "admin" && <AdminBadge />}
						</ItemTitle>
						<ItemDescription>{person.email}</ItemDescription>
					</ItemContent>
					<ItemActions onClick={(e) => e.stopPropagation()}>
						<UserBadge job={person.job ? t(`jobList.${person.job}`) : t("noJob")} />
						{/* the backend refuses to delete the admin's own account */}
						{person.id !== viewerId && <RemoveUser user={person} />}
					</ItemActions>
				</Item>
			))}
		</ItemGroup>
	);
}

function Filter({ sortBy, onSortChange }: { sortBy: SortKey; onSortChange: (k: SortKey) => void }) {
	const t = useTranslations("Users.sort");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="ghost" className="rounded-full hover:text-primary"><Funnel /></Button>} />
			<DropdownMenuContent className="w-32">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => onSortChange(v as SortKey)}>
						<DropdownMenuRadioItem value="date">{t("date")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="username">{t("username")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="email">{t("email")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function UserManagement({ users, viewer }: { users: BackendUser[] | null; viewer: Viewer }) {
	const t = useTranslations("Users");
	const [query, setQuery] = React.useState("");
	const [sortBy, setSortBy] = React.useState<SortKey>("username");
	const [selectedUser, setSelectedUser] = React.useState<BackendUser | null>(null);
	const [open, setOpen] = React.useState(false);

	function handleSelect(user: BackendUser) {
		setSelectedUser(user);
		setOpen(true);
	}

	const visibleUsers = React.useMemo(() => {
		if (users == null)
				return null;
		const q = query.trim().toLowerCase();
		const filtered = q
			? users.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
			: users;
		return sortUsers(filtered, sortBy);
	}, [users, query, sortBy]);

	return (
		<div className="flex h-150 w-full max-w-125 flex-col rounded-xl border bg-card p-2 shadow-glow">
			<ItemGroup className="max-w-md bg-card">
				<Item variant="muted">
					<ItemContent>
						<ItemTitle>
							<form onSubmit={(e) => e.preventDefault()} className="w-full">
								<Field orientation="horizontal">
									<Filter sortBy={sortBy} onSortChange={setSortBy} />
									<Input
										type="search"
										placeholder={t("searchBar")}
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										/>
									<Button type="submit">{t("search")}</Button>
								</Field>
							</form>
						</ItemTitle>
					</ItemContent>

					<ItemActions>
						<NewUserForm />
					</ItemActions>
				</Item>
				<ItemSeparator className="my-0 mb-2" />
			</ItemGroup>

			<ScrollArea className="min-h-0 flex-1">
				<UserList users={visibleUsers} viewerId={viewer.id} onSelect={handleSelect}/>
			</ScrollArea>

			{selectedUser && (
				<ModifyUser
					user={selectedUser}
					viewer={viewer}
					open={open}
					onOpenChange={setOpen}
				/>
			)}
		</div>
	);
}
