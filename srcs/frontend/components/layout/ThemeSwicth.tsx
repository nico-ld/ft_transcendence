"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"

const noSubscribe = () => () => {};

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const t = useTranslations("Header");
	// the theme is only known in the browser: false on the server and while hydrating, then true
	const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

	if (!mounted)
		return <div className="h-5 w-22" />
	
	const isDark = resolvedTheme === "dark"

	return (
		<div className="flex items-center gap-2 text-muted-foreground">
			<Sun className="size-4" />
			<Switch
				checked={isDark}
				onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
				aria-label={t("dark")}
			/>
			<Moon className="size-4" />
		</div>
	);
}
