"use client";

// Content of the /workspace page: the app Header, "<username> workspace - <role>" title
// and terminal filling the rest of the screen.

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ROLE_HOME } from "@/lib/utils";
import type { TerminalState } from "@/types/Terminal";
import type { Role } from "@/types/User";
import { TerminalOverlay } from "./TerminalOverlay";
import { WorkspaceTerminal } from "./WorkspaceTerminal";

// the fields used here from GET /api/auth/me (backend schemas.py UserOut, camelCase JSON)
type Me = {
	username: string;
	role: Role;
	avatar: string | null;
};

export function WorkspaceView() {
	const [me, setMe] = useState<Me | null>(null);
	const [state, setState] = useState<TerminalState>("connecting");
	// a new key mounts a new terminal: fresh screen, new shell
	const [attempt, setAttempt] = useState(0);

	// who is logged in (asked from the browser)
	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then((res) => (res.ok ? res.json() : null))
			.then((data: Me | null) => setMe(data))
			.catch(() => {});
		// hypothesis : page left before the answer -> cancel the request
		return () => controller.abort();
	}, []);

	function reconnect() {
		setState("connecting");
		setAttempt((n) => n + 1);
	}

	return (
		<>
			<Header
				role={me?.role ?? "user"}
				username={me?.username ?? ""}
				avatarUrl={me?.avatar ?? undefined}
			/>
			{/* fills the space between the Header and the footer; a div */}
			<div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 md:px-6">
				<h1 className="text-lg font-semibold">
					{/* non-breaking space while loading, keeps the line's height */}
					{me ? `${me.username} workspace - ${me.role}` : " "}
				</h1>
				{/* the terminal fills this box absolutely, so it gets a real height to fit its rows to */}
				<div className="relative min-h-0 flex-1">
					<WorkspaceTerminal key={attempt} className="absolute inset-0" onState={setState} />
					<TerminalOverlay state={state} home={ROLE_HOME[me?.role ?? "user"]} onRetry={reconnect} />
				</div>
			</div>
		</>
	);
}
