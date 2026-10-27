"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { Role } from "@/types/User";
import { LoginPayload } from "@/types/LoginPayload";
import { backendFetch, SESSION_COOKIE, sessionFromResponse } from "@/lib/backend";
import { BACKEND_SIGNUP_ERRORS, type SignupError } from "@/types/SignupErrors";

export async function Logout(locale: string) {
	// end the session on the backend first. If the backend can't be reached,
	// still log out locally
	await backendFetch("/auth/logout", { method: "POST" }).catch(() => null);
	(await cookies()).delete(SESSION_COOKIE);
	redirect({href: "/login", locale});
}

export async function Login(payload: LoginPayload): Promise<{role: Role }| null> {
	const res = await backendFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email: payload.email, password: payload.password }),
	});
	// 401: wrong email or password, 422: not a valid email
	if (res.status === 401 || res.status === 422)
		return null;
	if (!res.ok)
		throw new Error(`Login failed (${res.status})`);

	// the backend's Set-Cookie came to this server, give the cookie to the browser
	// with the same settings as the backend's (security.py set_session_cookie)
	const session = sessionFromResponse(res);
	if (!session)
		throw new Error("Login answer without a session cookie");
	(await cookies()).set(SESSION_COOKIE, session.value, {
		httpOnly: true, // page scripts can't read it
		secure: true, // https only
		sameSite: "lax",
		path: "/",
		maxAge: session.maxAge,
	});

	const user = await res.json();
	return { role: user.role };
}

export async function Signup(input: {
	email : string;
	username: string;
	password: string;
}) : Promise<SignupError> {
	let res: Response;
	try {
		res = await backendFetch("/auth/register", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(input)
		});
	} catch {
		return "generic";
	}

	if (res.status === 201)
		return "";

	const body = await res.json().catch(() => null);
	const code = body?.code;
	return BACKEND_SIGNUP_ERRORS.includes(code) ? code : "generic";
}
