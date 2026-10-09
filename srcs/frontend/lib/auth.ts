export type Role = "admin" | "user"
export type LoginPayload = {email: string; password: string };
export const ROLE_HOME: Record<Role, string> = {
	admin: "/admin",
	user: "/dashboard"
};

// TMP FUCNTION : replace with real call once the back-end is ready
export async function login(payload: LoginPayload): Promise<{role: Role }| null> {
	await new Promise((r) => setTimeout(r, 500));
	if (payload.email === "admin@test.com" && payload.password === "admin")
		return {role: "admin"};
	if (payload.email === "user@test.com" && payload.password === "user")
		return {role: "user"};
	return null;
}
