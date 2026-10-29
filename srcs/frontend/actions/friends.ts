"use server";

import { refresh } from "next/cache";
import { backendFetch } from "@/lib/backend";

async function friendRequest(userId: number, method: "POST" | "DELETE"): Promise<boolean> {
	// an action can be called with anything, and the id goes in the URL
	if (!Number.isInteger(userId))
		return false;
	const res = await backendFetch(`/friends/${userId}`, { method });
	refresh();
	return res.ok;
}

/** Send a friend request, or accept theirs (POST /friends/{id}) */
export async function addFriend(userId: number): Promise<boolean> {
	return friendRequest(userId, "POST");
}

/** Remove a friend, decline their request or cancel yours (DELETE /friends/{id}) */
export async function removeFriend(userId: number): Promise<boolean> {
	return friendRequest(userId, "DELETE");
}
