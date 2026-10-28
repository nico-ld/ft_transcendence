"use server";

import { backendFetch } from "@/lib/backend";
import type { ChangePasswordState } from "@/types/User";

/** The logged-in user's new password (PATCH /auth/me/password); the backend logs out their other browsers. */
export async function changePassword(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState>
{
	const currentPassword = String(formData.get("currentPassword") ?? "");
	const newPassword = String(formData.get("newPassword") ?? "");

	if (newPassword !== formData.get("confirmPassword"))
		return {ok: false, error: "mismatch"};
	if (newPassword === currentPassword)
		return {ok: false, error: "same"};

	const res = await backendFetch("/auth/me/password", {
		method: "PATCH",
		body: JSON.stringify({currentPassword, newPassword})
	});
	if (res.ok)
		return {ok: true};
	// the other two 400s can't happen from here: same password is checked above, 42-only accounts get no form
	if (res.status === 400)
		return {ok: false, error: "wrongCurrent"};
	if (res.status === 422)
		return {ok: false, error: "invalid"};
	if (res.status === 401)
		return {ok: false, error: "notAllowed"};
	return {ok: false, error: "generic"};
}
