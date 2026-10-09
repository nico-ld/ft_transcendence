export type Role = "admin" | "user"
export type LoginPayload = {email: string; password: string };
export const ROLE_HOME: Record<Role, string> = {
	admin: "/admin",
	user: "/dashboard"
};

export { cn } from "cn"
