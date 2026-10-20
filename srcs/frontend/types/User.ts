export type User = {
	lastname: string;
	name: string;
	username: string;
	avatar: string;
	email: string;
	job: string;
	createdAt: string;
};

export type Role = "admin" | "user";

export type SortKey = "date" | "username" | "email";

