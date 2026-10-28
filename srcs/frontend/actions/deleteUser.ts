"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { userError, type UserError } from "@/types/User";

/** Admin deletion of another account and its workspace (DELETE /users/{id}). */
export async function deleteUser(userId: number): Promise<{ ok: boolean; error?: UserError }> {
	const res = await backendFetch(`/users/${userId}`, { method: "DELETE" });
	// 502: Docker couldn't remove the workspace, so the backend kept the user
	if (!res.ok)
		return {ok: false, error: res.status === 502 ? "workspace" : userError(res.status)};

	revalidatePath("/", "layout");
	return {ok: true};
}
