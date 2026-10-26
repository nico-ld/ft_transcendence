import "server-only";
import { cookies } from "next/headers";
import type { Role } from "@/types/User";

// docker-compose service name and port (see nginx.conf). BACKEND_URL can override
// it, e.g. when running `bun dev` outside Docker.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://backend:8080";

// to match security.py
export const SESSION_COOKIE = "session";

/** User struct to match what backend sends (schemas.py UserOut, camelCase JSON). */
export type BackendUser = {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	avatar: string | null;
	job: string | null;
	role: Role;
	createdAt: string;
};

/** fetch() to the backend, with the browser's session cookie and a JSON body. */
export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	const headers = new Headers(init.headers);
	if (token)
		headers.set("cookie", `${SESSION_COOKIE}=${token}`);
	if (init.body && !headers.has("content-type"))
		headers.set("content-type", "application/json");
	// cache in "no-store" mode, so every answer depends on who is logged in
	return fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
}

 // The session cookie the backend reaches the Next server,
 // so the caller has to hand the cookie over with cookies().set.
export function sessionFromResponse(res: Response): { value: string; maxAge?: number } | null {
	for (const header of res.headers.getSetCookie()) {
		const [pair, ...attributes] = header.split(";");
		const [name, ...value] = pair.trim().split("=");
		if (name !== SESSION_COOKIE)
			continue;
		const maxAge = attributes
			.map((a) => a.trim().split("="))
			.find(([key]) => key.toLowerCase() === "max-age")?.[1];
		return { value: value.join("="), maxAge: maxAge ? Number(maxAge) : undefined };
	}
	return null;
}

/** The logged-in user (GET /auth/me), or null if nobody is logged in or the session is over. */
export async function getCurrentUser(): Promise<BackendUser | null> {
	if (!(await cookies()).has(SESSION_COOKIE))
		return null;
	const res = await backendFetch("/auth/me");
	return res.ok ? ((await res.json()) as BackendUser) : null;
}

/** Every account (GET /users), or null if the caller isn't an admin or the backend failed. */
export async function getUsers(): Promise<BackendUser[] | null> {
	const res = await backendFetch("/users");
	return res.ok ? ((await res.json()) as BackendUser[]) : null;
}
