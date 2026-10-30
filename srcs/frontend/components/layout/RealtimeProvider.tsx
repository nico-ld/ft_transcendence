"use client";

/*
 * One WebSocket per visit, open on every page of the app
 * who is online, and the friend requests as they come
 */

import { createContext, useContext, useEffect, useEffectEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/components/ui/toast";
import type { RealtimeEvent } from "@/types/Realtime";

const SOCKET_PATH = "/api/ws/events";
const LOGGED_OUT = 4401;
const MAX_RETRY_MS = 30_000;

const OnlineContext = createContext<ReadonlySet<number>>(new Set());

export function useIsOnline(userId: number): boolean {
	return useContext(OnlineContext).has(userId);
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
	const [online, setOnline] = useState<ReadonlySet<number>>(new Set());
	const router = useRouter();
	const t = useTranslations("Toast");

	const handle = useEffectEvent((event: RealtimeEvent) => {
		switch (event.type) {
			case "presence":
				setOnline(new Set(event.online));
				break;
			case "online":
				setOnline((prev) => new Set(prev).add(event.userId));
				break;
			case "offline":
				setOnline((prev) => {
					const next = new Set(prev);
					next.delete(event.userId);
					return next;
				});
				break;
			case "friend_request":
				toast.add({ type: "info", title: t("friendRequest", { username: event.username }) });
				router.refresh();
				break;
			case "friend_accepted":
				toast.add({ type: "success", title: t("friendAccepted", { username: event.username }) });
				router.refresh();
				break;
			case "friend_removed":
				router.refresh();
				break;
		}
	});

	const loggedOut = useEffectEvent(() => {
		toast.add({ type: "warning", title: t("loggedOut") });
		// the page sees there is no user anymore and redirects to login
		router.refresh();
	});

	useEffect(() => {
		let socket: WebSocket;
		let retry: ReturnType<typeof setTimeout> | undefined;
		let attempts = 0;

		function connect() {
			const scheme = window.location.protocol === "https:" ? "wss" : "ws";
			socket = new WebSocket(`${scheme}://${window.location.host}${SOCKET_PATH}`);
			socket.onopen = () => {
				attempts = 0;
			};
			socket.onmessage = (message) => handle(JSON.parse(message.data));
			socket.onclose = (event) => {
				// the next "presence" says who is online again
				setOnline(new Set());
				if (event.code === LOGGED_OUT)
					return loggedOut();
				// 1s up to 30s, so a restarting backend isnt flooded
				retry = setTimeout(connect, Math.min(1000 * 2 ** attempts, MAX_RETRY_MS));
				attempts++;
			};
		}

		connect();
		return () => {
			clearTimeout(retry);
			socket.onclose = null; // leaving the app on purpose, no reconnect
			socket.onmessage = null;
			// closing a socket still connecting is an error in the console (a
			// redirect to the login page or strict mode in dev) so we wait for it
			if (socket.readyState === WebSocket.CONNECTING)
				socket.onopen = () => socket.close();
			else
				socket.close();
		};
	}, []);

	return <OnlineContext value={online}>{children}</OnlineContext>;
}
