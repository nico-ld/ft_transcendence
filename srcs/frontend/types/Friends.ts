// What other users see of an account (backend schemas.py PublicUserOut)
export type PublicUser = {
	id: number;
	username: string;
	avatar: string | null;
};

// What a user is to the logged in user (schemas.py Relation)
export type Relation = "friend" | "incoming" | "outgoing";

export type Friends = {
	friends: PublicUser[];
	// requests to accept or decline
	incoming: PublicUser[];
	// requests waiting for the other user
	outgoing: PublicUser[];
};

export type UserSearchResult = PublicUser & { relation: Relation | null };
