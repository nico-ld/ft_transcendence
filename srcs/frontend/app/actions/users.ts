"use server";

import { backendFetch } from "@/lib/backend";

// Admin actions on users, called by the admin components. The backend checks that
// the caller is a logged-in admin (users.py), from the forwarded session cookie.

/** What a form action returns: an error to show, or "" when it worked. */
export type ActionResult = { error: string; done: boolean };

/** One readable line from a FastAPI error answer. */
async function errorMessage(res: Response, fallback: string): Promise<string> {
	const body = await res.json().catch(() => null);
	const detail = body?.detail;
	if (typeof detail === "string")
		return detail;
	// 422: [{loc: ["body", "password"], msg: "String should have at least 8 characters"}, ...]
	if (Array.isArray(detail) && detail.length > 0)
		return detail.map((d) => `${d.loc?.at(-1) ?? "field"}: ${d.msg}`).join(", ");
	return fallback;
}

/** NewUserForm: create an account (POST /users). New accounts get the "user" role. */
export async function CreateUser(_previous: ActionResult, form: FormData): Promise<ActionResult> {
	const job = String(form.get("job") ?? "");
	const res = await backendFetch("/users", {
		method: "POST",
		body: JSON.stringify({
			username: form.get("username"),
			firstName: form.get("name"),
			lastName: form.get("lastname"),
			email: form.get("email"),
			password: form.get("password"),
			job: job || null, // "Select a job" = no workspace
			role: "user",
		}),
	});
	if (res.ok)
		return { error: "", done: true };
	if (res.status === 401 || res.status === 403)
		return { error: "You must be logged in as an admin.", done: false };
	return { error: await errorMessage(res, "Could not create the user."), done: false };
}
