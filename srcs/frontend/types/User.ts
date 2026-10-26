// a user's own fields (BackendUser in lib/backend.ts)
export type Role = "admin" | "user";

export type SortKey = "date" | "username" | "email";

export type UpdateUserState = {
	ok: boolean;
	error?: string;
} | null;
