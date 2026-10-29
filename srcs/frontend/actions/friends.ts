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

export async function addFriend(userId: number): Promise<boolean> {
	return friendRequest(userId, "POST");
}

export async function removeFriend(userId: number): Promise<boolean> {
	return friendRequest(userId, "DELETE");
}
