export type Role = "admin" | "user"

// TMP FUNCTION : wait for back-end
export async function login(email: string, password: string): Promise<{ role: Role } | null> {
	if (email === "admin@test.com" && password === "admin")
		return {role: "admin"};
	if (email === "user@test.com" && password == "user")
		return {role: "user"};
	return null;
}
