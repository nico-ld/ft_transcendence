"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { userError, type UpdateUserState } from "@/types/User";

/** The logged-in user's avatar as a data URL, or null to go back to the initials (PATCH /auth/me). */
export async function updateAvatar(avatar: string | null): Promise<UpdateUserState>
{
	const res = await backendFetch("/auth/me", {
		method: "PATCH",
		body: JSON.stringify({ avatar })
	});
	if (!res.ok)
		return {ok: false, error: userError(res.status)};

	revalidatePath("/", "layout");
	return {ok: true};
}
