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
