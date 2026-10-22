"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NewUserForm } from "@/actions/NewUserForm";
import { RemoveUser } from "@/actions/RemoveUser";
import { ModifyUser } from "@/actions/ModifyUser";
import { UserBadge } from "../layout/CustomBadge";
import * as React from "react"
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

import type { User, SortKey } from "@/types/User"
import { useTranslations } from "next-intl";


function sortUsers(list: User[], key: SortKey) {
	return [...list].sort((a, b) =>
			key === "date"
					? b.createdAt.localeCompare(a.createdAt)
					: a[key].localeCompare(b[key], undefined, {sensitivity: "base"})
	);
}

function UserList({ users, onSelect }: {users:User[]; onSelect: (user: User) => void }) {
	if (users.length === 0) {
		return <p className="p-4 text-center text-sm text-muted-foreground">No user found</p>
	}
	return (
		<ItemGroup className="max-w-md">
			{users.map((person) => (
				<Item 
					key={person.username} 
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
							<AvatarImage src={person.avatar} />
							<AvatarFallback>{person.username.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
					</ItemMedia>
					<ItemContent className="gap-1">
						<ItemTitle>{person.username}</ItemTitle>
						<ItemDescription>{person.email}</ItemDescription>
					</ItemContent>
					<ItemActions onClick={(e) => e.stopPropagation()}>
						<UserBadge job={person.job} />
						<RemoveUser user={person} />
					</ItemActions>
				</Item>
			))}
		</ItemGroup>
	);
}

function Filter({ sortBy, onSortChange }: { sortBy: SortKey; onSortChange: (k: SortKey) => void }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="ghost" className="rounded-full hover:text-primary"><Funnel /></Button>} />
			<DropdownMenuContent className="w-32">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Sort By</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => onSortChange(v as SortKey)}>
						<DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="username">Name</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function UserManagement({ users }: { users: User[] }) {
	const [query, setQuery] = React.useState("");
	const [sortBy, setSortBy] = React.useState<SortKey>("username");
	const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
	const [open, setOpen] = React.useState(false);

	function handleSelect(user: User) {
		setSelectedUser(user);
		setOpen(true);
	}

	const visibleUsers = React.useMemo(() => {
		const q = query.trim().toLowerCase();
		const filtered = q
			? users.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
			: users;
		return sortUsers(filtered, sortBy);
	}, [users, query, sortBy]);

	const t = useTranslations("Users");

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
				<UserList users={visibleUsers} onSelect={handleSelect}/>
			</ScrollArea>

			{selectedUser && (
				<ModifyUser
					user={selectedUser}
					open={open}
					onOpenChange={setOpen}
				/>
			)}
		</div>
	);
}
