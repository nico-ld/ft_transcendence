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
 * When the socket closes, its reason is printed in the terminal.
 */

import { useEffect, useRef } from "react";
import type { ITheme } from "@xterm/xterm";
// xterm.js's own styles (cursor, selection, scrollbar...)
import "@xterm/xterm/css/xterm.css";

// nginx forwards /api/ws/ to the backend's /ws/ with WebSocket support (nginx.conf)
const SOCKET_PATH = "/api/ws/terminal";

// Always dark, matching the app's dark theme (globals.css .dark), converted from
// oklch to hex because xterm.js only understands hex/rgb colors.
// The 16 ANSI colors are what programs use (ls, git, the prompt...).
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

/** The line printed in the terminal when the connection ends. */
function closeMessage(event: CloseEvent, wasOpen: boolean): string {
	// the backend explains itself: "Session ended", "No workspace is assigned...", ...
	if (event.reason)
		return event.reason;
	// refused before opening: not logged in, or the site opened at the wrong address
	if (!wasOpen)
		return "Could not connect to your workspace. Are you logged in?";
	return "Connection to your workspace lost";
}

/** Terminal connected to the logged-in user's workspace. One shell per page; it ends when the page closes. */
export function WorkspaceTerminal({ className = "" }: { className?: string }) {
	// the <div> xterm.js draws into
	const hostRef = useRef<HTMLDivElement>(null);

	// Everything happens in this effect: it runs in the browser once the page is
	// shown, and its cleanup (at the end) runs when the page closes or is hidden.
	useEffect(() => {
		const host = hostRef.current;
		if (!host)
			return;
		// set by the cleanup; checked after the awaits below, in case the page
		// went away while xterm.js and the font were loading
		let disposed = false;
		// replaced below, once there is something to clean up
		let teardown = () => {};

		(async () => {
			// 1. load xterm.js (it needs the browser, so never during server rendering)
			const [{ Terminal }, { FitAddon }, fontFamily] = await Promise.all([
				import("@xterm/xterm"),
				import("@xterm/addon-fit"),
				monoFont(),
			]);
			if (disposed)
				return;

			// 2. create the terminal and size it to its box
			const term = new Terminal({
				cursorBlink: true,
				fontFamily,
				fontSize: FONT_SIZE,
				scrollback: 5000, // lines kept when scrolling up
				theme: THEME,
			});
			// the fit addon computes how many columns/rows fit in the box
			const fit = new FitAddon();
			term.loadAddon(fit);
			term.open(host);
			fit.fit();

			// 3. connect to the backend (same host as the page, so the cookie is sent)
			const scheme = window.location.protocol === "https:" ? "wss" : "ws";
			const socket = new WebSocket(`${scheme}://${window.location.host}${SOCKET_PATH}`);
			// receive binary frames as ArrayBuffer (the default is Blob, slower to read)
			socket.binaryType = "arraybuffer";
			const encoder = new TextEncoder(); // string -> UTF-8 bytes
			let wasOpen = false;

			const isOpen = () => socket.readyState === WebSocket.OPEN;
			// tells the backend the terminal size, so the shell wraps lines correctly
			const sendSize = () => {
				if (isOpen())
					socket.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
			};

			socket.onopen = () => {
				wasOpen = true;
				sendSize();
				term.focus();
			};
			// 4. backend -> terminal: write the shell's output.
			// bytes, not strings: a frame can end in the middle of a UTF-8 character
			// (é, emoji...), xterm.js puts it back together only when given a Uint8Array
			socket.onmessage = (event) => {
				if (event.data instanceof ArrayBuffer)
					term.write(new Uint8Array(event.data));
			};
			// connection over: print why, and stop accepting input
			socket.onclose = (event) => {
				// \x1b[2m ... \x1b[0m = dim text, then back to normal
				term.write(`\r\n\x1b[2m[${closeMessage(event, wasOpen)}]\x1b[0m\r\n`);
				term.options.disableStdin = true;
				term.options.cursorBlink = false;
			};

			// 5. terminal -> backend: what the user types, and size changes
			const subscriptions = [
				// typed keys, pasted text, Ctrl-C (sent as the \x03 character)...
				term.onData((data) => {
					if (isOpen())
						socket.send(encoder.encode(data));
				}),
				// a few mouse reports (e.g. clicking in vim) are not valid UTF-8,
				// they go as raw bytes, one byte per character
				term.onBinary((data) => {
					if (isOpen())
						socket.send(Uint8Array.from(data, (c) => c.charCodeAt(0) & 0xff));
				}),
				// fires after fit() changed the number of columns/rows
				term.onResize(sendSize),
			];

			// 6. refit when the box changes size (window resized...). Once per frame
			// at most, as a resize fires the observer many times
			let frame = 0;
			const observer = new ResizeObserver(() => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => fit.fit());
			});
			observer.observe(host);

			// 7. what the cleanup undoes
			teardown = () => {
				cancelAnimationFrame(frame);
				observer.disconnect();
				subscriptions.forEach((s) => s.dispose());
				socket.onclose = null; // no message, the terminal is going away
				socket.close(); // the backend then hangs up the shell
				term.dispose();
			};
		})();

		// Cleanup: runs when the page closes, and when a navigation hides the page
		// (Cache Components keeps pages hidden instead of removing them).
		// In dev, React also runs effects twice on purpose; this handles it.
		return () => {
			disposed = true;
			teardown();
		};
	}, []);

	// Outer box: background and padding. The padding is on the outer box and not on
	// the xterm <div>, otherwise the fit addon counts it as space for text.
	return (
		<div
			className={`overflow-hidden rounded-xl border p-2 ${className}`}
			style={{ background: THEME.background }}
		>
			<div ref={hostRef} className="h-full w-full" />
		</div>
	);
}
