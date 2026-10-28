// Where the workspace terminal's at. The closed ones are keys of Workspace.states in messages/*.json */
export type TerminalState =
	| "connecting"
	| "open"
	| "noJob"
	| "unavailable"
	| "loggedOut"
	| "ended"
	| "error"
	| "lost"
	| "unreachable";

export type ClosedState = Exclude<TerminalState, "connecting" | "open">;

// Why the terminal's WebSocket closed (see backend app/routers/websocket.py)
export function closedState(code: number, wasOpen: boolean): ClosedState {
	if (code === 4009)
		return "noJob";
	if (code === 4503)
		return "unavailable";
	if (code === 4401)
		return "loggedOut";
	if (code === 1000)
		return "ended";
	if (code === 1011)
		return "error";
	// the browser hides why a connection was refused (no session, wrong origin, backend down)
	return wasOpen ? "lost" : "unreachable";
}
