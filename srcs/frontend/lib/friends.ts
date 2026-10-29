import "server-only";
import { backendFetch } from "./backend";
import type { Friends, UserSearchResult } from "@/types/Friends";

const NO_FRIENDS: Friends = { friends: [], incoming: [], outgoing: [] };

/** Friends and requests of the logged in user */
export async function getFriends(): Promise<Friends> {
	const res = await backendFetch("/friends");
	return res.ok ? ((await res.json()) as Friends) : NO_FRIENDS;
}

/** q needs 2 chars */
export async function searchUsers(q: string): Promise<UserSearchResult[]> {
	const res = await backendFetch(`/friends/search?q=${encodeURIComponent(q)}`);
	return res.ok ? ((await res.json()) as UserSearchResult[]) : [];
}
