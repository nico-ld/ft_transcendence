"use client";

/*
 * Content of the /workspace page: the app Header, the title
 * "<username> workspace - <role>", and the terminal filling the rest of the screen.
 */

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import type { Role } from "@/lib/utils";
import { WorkspaceTerminal } from "./WorkspaceTerminal";

// the fields used here from GET /api/auth/me (backend schemas.py UserOut, camelCase JSON)
type Me = {
	username: string;
	role: Role;
	avatar: string | null;
};

export function WorkspaceView() {
	// null until /api/auth/me answers (or if not logged in)
	const [me, setMe] = useState<Me | null>(null);

	// who is logged in: asked from the browser, so the session cookie goes with it
	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then((res) => (res.ok ? res.json() : null))
			.then((data: Me | null) => setMe(data))
			.catch(() => {});
		// page left before the answer: cancel the request
		return () => controller.abort();
	}, []);

	return (
		<>
			{/* rendered right away with empty values, so the layout doesn't jump when /me answers */}
			<Header
				role={me?.role ?? "user"}
				username={me?.username ?? ""}
				avatarUrl={me?.avatar ?? undefined}
			/>
			{/* full screen height minus the Header (h-14 = 3.5rem) */}
			<main className="flex h-[calc(100dvh-3.5rem)] flex-col gap-3 px-4 py-4 md:px-6">
				<h1 className="text-lg font-semibold">
					{/* non-breaking space while loading, keeps the line's height */}
					{me ? `${me.username} workspace - ${me.role}` : " "}
				</h1>
				{/* flex-1 + min-h-0: the terminal takes all the remaining height */}
				<WorkspaceTerminal className="min-h-0 flex-1" />
			</main>
		</>
	);
}
