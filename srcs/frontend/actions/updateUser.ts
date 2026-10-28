"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { userError, type UpdateUserState } from "@/types/User";

/** Admin edit of any account, their own included (PATCH /users/{id}). */
export async function updateUser(
	userId: number,
	_prev: UpdateUserState,
	formData: FormData
): Promise<UpdateUserState>
{
	const res = await backendFetch(`/users/${userId}`, {
		method: "PATCH",
		body: JSON.stringify({
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			username: formData.get("username"),
			// "Select a job" = no workspace; the backend only restarts the workspace if the job changed
			job: formData.get("job") || null,
			// not sent for the admin's own account, whose role can't be changed
			role: formData.get("role") ?? undefined
		})
	});
	if (!res.ok)
		return {ok: false, error: userError(res.status)};

	revalidatePath("/", "layout");
	return {ok: true};
}
