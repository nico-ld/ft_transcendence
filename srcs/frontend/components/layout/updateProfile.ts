"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { userError, type UpdateUserState } from "@/types/User";

/** The logged-in user's edit of their own names (PATCH /auth/me); only an admin changes a job. */
export async function updateProfile(_prev: UpdateUserState, formData: FormData): Promise<UpdateUserState>
{
	const res = await backendFetch("/auth/me", {
		method: "PATCH",
		body: JSON.stringify({
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			username: formData.get("username")
		})
	});
	if (!res.ok)
		return {ok: false, error: userError(res.status)};

	revalidatePath("/", "layout");
	return {ok: true};
}
