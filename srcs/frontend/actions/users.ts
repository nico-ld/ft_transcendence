"use server";

import { backendFetch } from "@/lib/backend";
import { Role, userError, type UserError } from "@/types/User";

// Admin actions on users, called by the admin components. The backend checks that
// the caller is a logged-in admin (users.py), from the forwarded session cookie.

/** What a form action returns: a key of Users.errors, or "" when success. */
export type ActionResult = { error: UserError | ""; done: boolean };

/** NewUserForm: create an account (POST /users), as a user or an admin. */
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
			role: form.get("role") || Role.USER,
		}),
	});
	if (res.ok)
		return { error: "", done: true };
	return { error: userError(res.status), done: false };
}
