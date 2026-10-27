"use client";

/*
 * The web terminal: xterm.js draws the terminal, a WebSocket carries the bytes
 * to and from a bash shell in the user's workspace container.
 *
 *   this component <--wss--> nginx (/api/ws/) <--> backend app/routers/websocket.py <--> bash
 *
 * Messages exchanged with the backend:
 *   page -> backend   binary: keystrokes, as raw bytes
 *   page -> backend   text:   {"type": "resize", "cols": 120, "rows": 32}
 *   backend -> page   binary: terminal output, as raw bytes
 * The backend knows who we are from the session cookie (sent automatically,
 * same origin), so no user or workspace id is sent.
 * When the socket closes, onState tells the page why (types/Terminal.ts).
 */

import { useEffect, useEffectEvent, useRef } from "react";
import type { ITheme } from "@xterm/xterm";
import { closedState, type TerminalState } from "@/types/Terminal";
import "@xterm/xterm/css/xterm.css";

// nginx forwards /api/ws/ to the backend's /ws/ with WebSocket support (nginx.conf)
const SOCKET_PATH = "/api/ws/terminal";

// Always dark, matching the app's dark theme (globals.css .dark)
const THEME: ITheme = {
	background: "#0b1015", // --background
	foreground: "#d6e3ee", // --foreground
	cursor: "#00bcff", // --primary
	cursorAccent: "#0b1015",
	selectionBackground: "#00bcff40", // --primary, 25% opacity
	black: "#1b2530",
	red: "#ff6467", // --destructive
	green: "#3fd07f",
	yellow: "#f5c451",
	blue: "#4ea1ff",
	magenta: "#c792ea",
	cyan: "#00bcff",
	white: "#d6e3ee",
	brightBlack: "#7b92a6", // --muted-foreground
	brightRed: "#ff8a8c",
	brightGreen: "#7ee2a8",
	brightYellow: "#ffd479",
	brightBlue: "#82bdff",
	brightMagenta: "#dcb0ff",
	brightCyan: "#5fd4ff",
	brightWhite: "#ffffff",
};

const FONT_SIZE = 14;

/**
 * The app's Geist Mono font (loaded by next/font in app/layout.tsx).
 * xterm.js measures the font once to size its grid, so the font must be loaded
 * before the terminal is created, or the letters won't line up.
 */
async function monoFont(): Promise<string> {
	const geist = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
	const family = geist ? `${geist}, monospace` : "monospace";
	try {
		await document.fonts.load(`${FONT_SIZE}px ${family}`);
	} catch {
		// keep going with whatever font the browser has
	}
	return family;
}

// Terminal connected to the logged-in user's workspace. One shell per page, ends when the page closes.
export function WorkspaceTerminal({ className = "", onState }: {
	className?: string;
	onState: (state: TerminalState) => void;
}) {
	// the <div> xterm.js draws into
	const hostRef = useRef<HTMLDivElement>(null);
	// always calls the latest onState
	const report = useEffectEvent(onState);

	// runs in browser once the page is shown,
	// cleanup runs when the page closes or is hidden.
	useEffect(() => {
		const host = hostRef.current;
		if (!host)
			return;
		// set by cleanup, checked after the awaits below,
		// in case the page went away while xterm.js and the font were loading
		let disposed = false;
		// replaced below, if something to clean up
		let teardown = () => {};

		(async () => {
			// load xterm.js
			const [{ Terminal }, { FitAddon }, fontFamily] = await Promise.all([
				import("@xterm/xterm"),
				import("@xterm/addon-fit"),
				monoFont(),
			]);
			if (disposed)
				return;

			// create terminal and size it
			const term = new Terminal({
				cursorBlink: true,
				fontFamily,
				fontSize: FONT_SIZE,
				scrollback: 5000, // lines kept when scrolling up
				theme: THEME,
			});
			// computes how many columns/rows fit in the box
			const fit = new FitAddon();
			term.loadAddon(fit);
			term.open(host);
			fit.fit();

			// connect to the backend
			const scheme = window.location.protocol === "https:" ? "wss" : "ws";
			const socket = new WebSocket(`${scheme}://${window.location.host}${SOCKET_PATH}`);
			socket.binaryType = "arraybuffer";
			const encoder = new TextEncoder();
			let wasOpen = false;
			let started = false;
			report("connecting");

			const isOpen = () => socket.readyState === WebSocket.OPEN;
			// give backend the terminal size
			const sendSize = () => {
				if (isOpen())
					socket.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
			};

			socket.onopen = () => {
				wasOpen = true;
				sendSize();
				term.focus();
			};
			// backend -> terminal: write the shell's output.
			socket.onmessage = (event) => {
				if (!(event.data instanceof ArrayBuffer))
					return;
				if (!started) {
					started = true;
					report("open");
				}
				term.write(new Uint8Array(event.data));
			};
			// connection over case: tell the page why, and stop accepting input
			socket.onclose = (event) => {
				report(closedState(event.code, wasOpen));
				term.options.disableStdin = true;
				term.options.cursorBlink = false;
			};

			// terminal -> backend: what the user types, and size changes
			const subscriptions = [
				// typed keys, pasted text, Ctrl-C
				term.onData((data) => {
					if (isOpen())
						socket.send(encoder.encode(data));
				}),
				// a few mouse reports are not valid UTF-8,
				// so they need to go as raw bytes
				term.onBinary((data) => {
					if (isOpen())
						socket.send(Uint8Array.from(data, (c) => c.charCodeAt(0) & 0xff));
				}),
				// needed to resize after fit() changed the number of columns/rows
				term.onResize(sendSize),
			];

			// refit when the box changes size
			let frame = 0;
			const observer = new ResizeObserver(() => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => fit.fit());
			});
			observer.observe(host);

			// cleanup logic
			teardown = () => {
				cancelAnimationFrame(frame);
				observer.disconnect();
				subscriptions.forEach((s) => s.dispose());
				socket.onclose = null; // no message, the terminal is going away
				socket.close(); // the backend then hangs up the shell
				term.dispose();
			};
		})();

		return () => {
			disposed = true;
			teardown();
		};
	}, []);

	// Outer box: background and padding.
	return (
		<div
			className={`overflow-hidden rounded-xl border p-2 ${className}`}
			style={{ background: THEME.background }}
		>
			<div ref={hostRef} className="h-full w-full" />
		</div>
	);
}
