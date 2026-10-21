"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { Role } from "@/types/User";
import { LoginPayload } from "@/types/LoginPayload";

export async function Logout(locale: string) {
	// TODO : manage cookies
	// ((await cookies()).delete("session"));
	redirect({href: "/login", locale});
}

// TMP FUCNTION : replace with real call once the back-end is ready
export async function Login(payload: LoginPayload): Promise<{role: Role }| null> {
	await new Promise((r) => setTimeout(r, 500));
	if (payload.email === "admin@test.com" && payload.password === "admin")
		return {role: "admin"};
	if (payload.email === "user@test.com" && payload.password === "user")
		return {role: "user"};
	return null;
}

