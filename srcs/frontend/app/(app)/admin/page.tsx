"use client";

import { Header } from "@/components/layout/Header"
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRoundX, UserRoundPlus, Funnel } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/Dropdown-menu";
import { 
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger
 } from "@/components/ui/alert-dialog"

type User = { username: string; avatar: string; email: string; createdAt: string };
type SortKey = "date" | "username" | "email";

// REPLACE BY REAL USERS
const users: User[] = [
	{
		username: "Nico",
		avatar: "https://github.com/nico-ld.png",
		email: "nico@email.com",
		createdAt: "2026-01-01"
	},
	{
		username: "Alexandre",
		avatar: "https://github.com/0verLighT.png",
		email: "alexandre@email.com",
		createdAt: "2026-01-02"
	},
	{
		username: "Titouan",
		avatar: "https://github.com/Tisaan.png",
		email: "titouan@email.com",
		createdAt: "2026-01-02"
	},
	{
		username: "Mathis",
		avatar: "https://github.com/xth24.png",
		email: "mathis@email.com",
		createdAt: "2026-01-03"
	},
	{
		username: "User1",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-04"
	},
	{
		username: "User2",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-05"
	},
	{
		username: "User3",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-06"
	},
	{
		username: "User4",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-07"
	},
	{
		username: "User5",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-08"
	},
	{
		username: "User6",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-09"
	}
]

function sortUsers(list: User[], key: SortKey) {
	return [...list].sort((a, b) =>
		key === "date" 
			? b.createdAt.localeCompare(a.createdAt)
			: a[key].localeCompare(b[key], undefined, { sensitivity: "base"})
	);
}

function RemoveUser({ user }: {user: User}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="ghost" size="icon" className="rounded-full text-red-500"><UserRoundX /></Button>}
			/>
			<AlertDialogContent size="sm">
			<AlertDialogHeader>
			<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
				<UserRoundX />
			</AlertDialogMedia>
			<AlertDialogTitle>Delete {user.username} profil</AlertDialogTitle>
			<AlertDialogDescription>
				This will permanently delete this user and his data. 
				Be sure you save every sensitives data.
			</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
				<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
	);
}


function UserList({ users }: {users:User[] }) {
	if (users.length === 0) {
		return <p className="p-4 text-center text-sm text-muted-foreground">No user found</p>
	}
	return (
		<ItemGroup className="max-w-sm">
			{users.map((person) => (
				<Item key={person.username} className="bg-muted/50" variant="outline">
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
					<ItemActions>
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
			<DropdownMenuTrigger render={<Button variant="ghost"><Funnel /></Button>} />
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

export default function AdminPage() {
	return (
		<>
			{/* SIMULATION USERNAME */}
			<Header role="admin" username="nico" />
			<main className="min-h-screen">
			</main>
		</>
	);
}