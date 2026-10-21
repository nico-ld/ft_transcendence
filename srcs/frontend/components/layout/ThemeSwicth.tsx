"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted)
		return <div className="h-5 w-22" />
	
	const isDark = resolvedTheme === "dark"

	return (
		<div className="flex items-center gap-2 text-muted-foreground">
			<Sun className="size-4" />
			<Switch
				checked={isDark}
				onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
				aria-label="Toggle dark mode"
			/>
			<Moon className="size-4" />
		</div>
	);
}
