import * as React from "react";
import { NO_FILTERS, PAGE_SIZE, Filters, Sort } from "@/types/UserList";
import type { BackendUser } from "./backend";

function fold(text: string) {
	return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function matches(user: BackendUser, {query, role, job}: Filters) {
	if (role !== "all" && user.role !== role)
		return false;
	if (job !== "all" && (user.job ?? "none") !== job)
		return false;

	const q = fold(query.trim());
	if (!q)
		return true;
	const fields = [
		user.username,
		user.email,
		`${user.firstName} ${user.lastName}`,
		`${user.lastName} ${user.firstName}`
	];
	return fields.some((field) => fold(field).includes(q));
}

export function sortUsers(list: BackendUser[], {key, order}: Sort) {
	const sign = order === "asc" ? 1 : -1;

	return [...list].sort((a, b) => 
	sign * (key === "date"
		? a.createdAt.localeCompare(b.createdAt)
		: a[key].localeCompare(b[key], undefined, {sensitivity: "base"}))
		|| a.id - b.id
	);
}

export function useUserList(users: BackendUser[] | null) {
	const [filters, setFilters] = React.useState<Filters>(NO_FILTERS);
	const [sort, setSort] = React.useState<Sort>({key: "username", order: "asc"});
	const [page, setPage] = React.useState(1);

	function changeFilters(change: Partial<Filters>) {
		setFilters((current) => ({...current, ...change}));
		setPage(1);
	}

	function changeSort(next: Sort) {
		setSort(next);
		setPage(1);
	}

	const count =(change: Partial<Filters>) =>
	(users ?? []).filter((user) => matches(user, {...filters, ...change})).length;

	const visibleUsers = React.useMemo(() => {
		if (users == null)
			return null;
		return sortUsers(users.filter((user) => matches(user, filters)), sort);
	}, [users, filters, sort]);

	const total = visibleUsers?.length ?? 0;
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const current = Math.min(page, pages);
	const pageUsers = visibleUsers?.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE) ?? null;
	const nothingMatches = users != null && users.length > 0 && total === 0;

	return {
		filters, changeFilters,
		sort, changeSort,
		count,
		pageUsers, total, pages, current, setPage,
		nothingMatches
	};
}
