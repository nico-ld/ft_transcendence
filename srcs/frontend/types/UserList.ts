import { BackendUser } from "@/lib/backend";
import type { JobFilter, RoleFilter, SortKey, SortOrder } from "./User";

export type Filters = {
	query: string;
	role: RoleFilter; 
	job: JobFilter;
};

export type Sort = {
	key: SortKey;
	order: SortOrder;
};

export type UserFilterProps = {
	sort: Sort;
	onSortChange: (sort: Sort) => void;
	filters: Filters;
	onFiltersChange: (change: Partial<Filters>) => void;
	count: (change: Partial<Filters>) => number;
};

export type FilterSubProps<T extends string> = {
	label: string;
	value: T;
	options: readonly T[];
	labelOf: (option: T) => string;
	countOf: (option: T) => number;
	onChange: (option: T) => void;
};

export type UserRowProps = {
	user: BackendUser;
	viewerId: number;
	onSelect: (user: BackendUser) => void;
};

export type UserListProps = {
	users: BackendUser[] | null;
	viewerId: number;
	onSelect: (user: BackendUser) => void;
};

export const NO_FILTERS: Filters = {
	query: "",
	role: "all",
	job: "all"
};

export const PAGE_SIZE = 10;

export const DEFAULT_ORDER: Record<SortKey, SortOrder> = {
	date: "desc",
	username: "asc",
	email: "asc"
};
