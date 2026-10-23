import { Role } from "./User";

export type HeaderProps = {
	role: Role;
	username: string;
	avatarUrl?: string;
};
