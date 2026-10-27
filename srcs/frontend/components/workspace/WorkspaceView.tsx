"use client";

// Content of the /workspace page: the app Header, "<username>'s workspace" title with the job,
// and terminal filling the rest of the screen.

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { UserBadge } from "@/components/layout/CustomBadge";
import type { BackendUser } from "@/lib/backend";
import { ROLE_HOME } from "@/lib/utils";
import type { TerminalState } from "@/types/Terminal";
import { TerminalOverlay } from "./TerminalOverlay";
import { WorkspaceTerminal } from "./WorkspaceTerminal";

type WorkspaceViewProps = {
	user: Pick<BackendUser, "username" | "role" | "avatar" | "job">;
};

export function WorkspaceView({ user }: WorkspaceViewProps) {
	const t = useTranslations("Workspace");
	const u = useTranslations("Users");
	// without a job there is no workspace, so no terminal to open
	const [state, setState] = useState<TerminalState>(user.job ? "connecting" : "noJob");
	// a new key mounts a new terminal: fresh screen, new shell
	const [attempt, setAttempt] = useState(0);

	function reconnect() {
		setState("connecting");
		setAttempt((n) => n + 1);
	}

	return (
		<>
			<Header role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined} />
			{/* fills the space between the Header and the footer */}
			<div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 md:px-6">
				<h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
					{t("title", { username: user.username })}
					{user.job && <UserBadge job={u(`jobList.${user.job}`)} />}
				</h1>
				{/* the terminal fills this box absolutely */}
				<div className="relative min-h-0 flex-1">
					{user.job && <WorkspaceTerminal key={attempt} className="absolute inset-0" onState={setState} />}
					<TerminalOverlay state={state} home={ROLE_HOME[user.role]} onRetry={reconnect} />
				</div>
			</div>
		</>
	);
}
