export type RealtimeEvent =
	| { type: "presence"; online: number[] }
	| { type: "online" | "offline"; userId: number }
	| { type: "friend_request" | "friend_accepted"; userId: number; username: string }
	| { type: "friend_removed"; userId: number };
