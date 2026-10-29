import { Role } from "@/types/User";

export const ROLE_HOME: Record<Role, string> = {
	[Role.ADMIN]: "/admin",
	[Role.USER]: "/user",
	[Role.GUEST]: "/guest"
};

export { cn } from "cn"
