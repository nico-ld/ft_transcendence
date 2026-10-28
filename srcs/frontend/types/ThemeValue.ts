import { Sun, Moon, Monitor } from "lucide-react";

export const THEMES = [
	{value: "light", icon: Sun},
	{value: "dark", icon: Moon},
	{value: "system", icon: Monitor}
] as const;

export type ThemeValue = (typeof THEMES)[number]["value"];
