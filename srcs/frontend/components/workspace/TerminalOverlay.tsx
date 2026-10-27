"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ClosedState, TerminalState } from "@/types/Terminal";

type Action = "dashboard" | "login" | "retry" | "newTerminal" | "reconnect";

// the way out of each closed state: a link for the first two, a new terminal for the others
const ACTIONS: Record<ClosedState, Action> = {
	noJob: "dashboard",
	loggedOut: "login",
	unavailable: "retry",
	unreachable: "retry",
	ended: "newTerminal",
	error: "reconnect",
	lost: "reconnect"
};

type TerminalOverlayProps = {
	state: TerminalState;
	// the user's dashboard, where a "noJob" case sends them back
	home: string;
	onRetry: () => void;
};

// What covers the terminal while it starts or once it closed
export function TerminalOverlay({ state, home, onRetry }: TerminalOverlayProps) {
	const t = useTranslations("Workspace");

	if (state === "open")
		return null;

	if (state === "connecting") {
		return (
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<p role="status" className="flex items-center gap-2 text-sm text-white">
					<Spinner aria-hidden />
					{t("connecting")}
				</p>
			</div>
		);
	}

	const action = ACTIONS[state];
	const href = action === "login" ? "/login" : action === "dashboard" ? home : null;

	return (
		<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 p-4">
			<Card role="alert" className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>{t(`states.${state}.title`)}</CardTitle>
					<CardDescription>{t(`states.${state}.description`)}</CardDescription>
				</CardHeader>
				<CardFooter>
					{href ? (
						<Link href={href} className={buttonVariants({ className: "w-full" })} autoFocus>
							{t(`actions.${action}`)}
						</Link>
					) : (
						<Button className="w-full" onClick={onRetry} autoFocus>
							{t(`actions.${action}`)}
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
