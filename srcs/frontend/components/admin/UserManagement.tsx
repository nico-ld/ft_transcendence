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
import { UserPagination } from "./UserPagination";

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
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { JOBS } from "@/types/jobs";
import { ROLES, type JobFilter, type RoleFilter, type SortKey, type SortOrder } from "@/types/User"
import type { BackendUser } from "@/lib/backend";
import type { Viewer } from "@/types/Viewer";

type Filters = { query: string; role: RoleFilter; job: JobFilter };
type Sort = { key: SortKey; order: SortOrder };

const NO_FILTERS: Filters = { query: "", role: "all", job: "all" };
const PAGE_SIZE = 10;
// the direction each sort starts with: newest accounts first, names from A to Z
const DEFAULT_ORDER: Record<SortKey, SortOrder> = { date: "desc", username: "asc", email: "asc" };

// case and accents ignored: "elodie" finds "Élodie"
function fold(text: string) {
	return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matches(user: BackendUser, { query, role, job }: Filters) {
	if (role !== "all" && user.role !== role)
		return false;
	if (job !== "all" && (user.job ?? "none") !== job)
		return false;
	const q = fold(query.trim());
	if (!q)
		return true;
	const fields = [user.username, user.email, `${user.firstName} ${user.lastName}`, `${user.lastName} ${user.firstName}`];
	return fields.some((field) => fold(field).includes(q));
}

function sortUsers(list: BackendUser[], { key, order }: Sort) {
	const sign = order === "asc" ? 1 : -1;
	// the id breaks ties, so the list never reshuffles between two renders
	return [...list].sort((a, b) =>
		sign * (key === "date"
			? a.createdAt.localeCompare(b.createdAt)
			: a[key].localeCompare(b[key], undefined, {sensitivity: "base"}))
		|| a.id - b.id
	);
}

function UserList({ users, viewerId, onSelect }: {users: BackendUser[] | null; viewerId: number; onSelect: (user: BackendUser) => void }) {
	const t = useTranslations("Users");

	if (users == null || users.length === 0) {
		return <p className="p-4 text-center text-sm text-muted-foreground">{t("noUsers")}</p>
	}

	return (
		<ItemGroup>
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

type FilterSubProps<T extends string> = {
	label: string;
	value: T;
	options: readonly T[];
	labelOf: (option: T) => string;
	countOf: (option: T) => number;
	onChange: (option: T) => void;
};

// one filter as a submenu: each choice with the number of users it would show
function FilterSub<T extends string>({ label, value, options, labelOf, countOf, onChange }: FilterSubProps<T>) {
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				{label}
				<span className="ml-auto pl-3 text-muted-foreground">{labelOf(value)}</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="min-w-44">
				<DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as T)}>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option} value={option}>
							{labelOf(option)}
							<span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">{countOf(option)}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}

type FilterProps = {
	sort: Sort;
	onSortChange: (sort: Sort) => void;
	filters: Filters;
	onFiltersChange: (change: Partial<Filters>) => void;
	count: (change: Partial<Filters>) => number;
};

function Filter({ sort, onSortChange, filters, onFiltersChange, count }: FilterProps) {
	const t = useTranslations("Users");
	const s = useTranslations("Users.sort");
	const f = useTranslations("Users.filter");
	const h = useTranslations("Header");
	const active = filters.role !== "all" || filters.job !== "all";

	const roleLabel = (role: RoleFilter) => role === "all" ? f("all") : h(role);
	const jobLabel = (job: JobFilter) => job === "all" ? f("all") : job === "none" ? t("noJob") : t(`jobList.${job}`);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" className="relative rounded-full hover:text-primary" aria-label={f("label")}>
						<Funnel />
						{active && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
					</Button>
				}
			/>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{s("label")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={sort.key} onValueChange={(v) => onSortChange({ key: v as SortKey, order: DEFAULT_ORDER[v as SortKey] })}>
						<DropdownMenuRadioItem value="date">{s("date")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="username">{s("username")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="email">{s("email")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>{s("order")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={sort.order} onValueChange={(v) => onSortChange({ ...sort, order: v as SortOrder })}>
						<DropdownMenuRadioItem value="asc">{s("asc")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="desc">{s("desc")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>{f("title")}</DropdownMenuLabel>
					<FilterSub
						label={f("role")}
						value={filters.role}
						options={["all", ...ROLES]}
						labelOf={roleLabel}
						countOf={(role) => count({ role })}
						onChange={(role) => onFiltersChange({ role })}
					/>
					<FilterSub
						label={f("job")}
						value={filters.job}
						options={["all", ...JOBS, "none"]}
						labelOf={jobLabel}
						countOf={(job) => count({ job })}
						onChange={(job) => onFiltersChange({ job })}
					/>
				</DropdownMenuGroup>
				{active && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onFiltersChange({ role: "all", job: "all" })}>{f("clear")}</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function UserManagement({ users, viewer }: { users: BackendUser[] | null; viewer: Viewer }) {
	const t = useTranslations("Users");
	const f = useTranslations("Users.filter");
	const [filters, setFilters] = React.useState<Filters>(NO_FILTERS);
	const [sort, setSort] = React.useState<Sort>({ key: "username", order: "asc" });
	const [page, setPage] = React.useState(1);
	const [selectedUser, setSelectedUser] = React.useState<BackendUser | null>(null);
	const [open, setOpen] = React.useState(false);

	function handleSelect(user: BackendUser) {
		setSelectedUser(user);
		setOpen(true);
	}

	// a new search, filter or sort starts again from the first page
	function changeFilters(change: Partial<Filters>) {
		setFilters((current) => ({ ...current, ...change }));
		setPage(1);
	}

	function changeSort(next: Sort) {
		setSort(next);
		setPage(1);
	}

	// how many users a filter choice would show, with the other filters kept
	const count = (change: Partial<Filters>) =>
		(users ?? []).filter((user) => matches(user, { ...filters, ...change })).length;

	const visibleUsers = React.useMemo(() => {
		if (users == null)
				return null;
		return sortUsers(users.filter((user) => matches(user, filters)), sort);
	}, [users, filters, sort]);
	const nothingMatches = users != null && users.length > 0 && visibleUsers?.length === 0;
	const total = visibleUsers?.length ?? 0;
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	// after a deletion empties the last page, the one before is shown
	const current = Math.min(page, pages);
	const pageUsers = visibleUsers?.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE) ?? null;

	return (
		<div className="flex h-150 w-full max-w-125 flex-col rounded-xl border bg-card p-2">
			<ItemGroup className="bg-card">
				<Item variant="muted">
					<ItemContent>
						<ItemTitle>
							<form onSubmit={(e) => e.preventDefault()} className="w-full">
								<Field orientation="horizontal">
									<Filter
										sort={sort}
										onSortChange={changeSort}
										filters={filters}
										onFiltersChange={changeFilters}
										count={count}
									/>
									<Input
										type="search"
										placeholder={t("searchBar")}
										value={filters.query}
										onChange={(e) => changeFilters({ query: e.target.value })}
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

			{/* keyed by page: a new page starts at the top of the list */}
			<ScrollArea key={current} className="min-h-0 flex-1">
				{nothingMatches ? (
					<div className="flex flex-col items-center gap-3 p-4 text-center text-sm text-muted-foreground">
						<p>{t("noMatch")}</p>
						<Button variant="outline" size="sm" onClick={() => changeFilters(NO_FILTERS)}>{f("clear")}</Button>
					</div>
				) : (
					<UserList users={pageUsers} viewerId={viewer.id} onSelect={handleSelect}/>
				)}
			</ScrollArea>
			{total > 0 && <UserPagination page={current} pages={pages} total={total} onPageChange={setPage} />}

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
