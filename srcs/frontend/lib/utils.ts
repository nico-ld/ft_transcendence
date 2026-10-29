import { Role } from "@/types/User";

export const ROLE_HOME: Record<Role, string> = {
	[Role.ADMIN]: "/admin",
	[Role.USER]: "/user",
	[Role.GUEST]: "/guest"
};

// same rules as the backend (srcs/backend/app/schemas.py)
// "-" escaped: browsers compile pattern with the v flag, where a bare "-" in [] is invalid
export const USERNAME_PATTERN = "[a-zA-Z0-9_\\-]{3,20}";
export const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";
export const NAME_MAX_LENGTH = 100;

export { cn } from "cn"
