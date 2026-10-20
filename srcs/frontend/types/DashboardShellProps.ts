import type { Role } from "@/types/User";

export type DashboardShellProps = {
	role: Role;
	username: string;
	avatarUrl?: string;
	sidebar?: React.ReactNode;
	children: React.ReactNode;
};
