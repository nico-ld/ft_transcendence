"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { UpdateUserState } from "@/types/User";

export async function updateUser(
	target: number | "me",
	_prev: UpdateUserState,
	formData: FormData
): Promise<UpdateUserState>
{
	const payload: Record<string, unknown> = {
		firstName: formData.get("firstname"),
		lastName: formData.get("lastName"),
		username: formData.get("username")
	};

	if (formData.has("job"))
		payload.job = formData.get("job") || null;

	const res = await backendFetch(`/users/${target}`, {
		method: "PATCH",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(payload)
	});
	if (!res.ok)
		return {ok: false, error: "updateFailed"};

	revalidatePath("/", "layout");
	return {ok: true};
}
