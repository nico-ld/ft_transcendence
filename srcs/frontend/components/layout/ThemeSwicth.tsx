"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger
} from "@/components/ui/select";
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";

import { ThemeValue, THEMES } from "@/types/ThemeValue";

const noSubscribe = () => () => {};

export function ThemeSwitch({variant = "select"}: {variant?: "select" | "submenu"}) {
	const {theme, setTheme} = useTheme();
	const t = useTranslations("Header");
	const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

	if (!mounted)
		return variant === "select" ? <div className="h-8 w-14" /> : null;

	const current = THEMES.find((th) => th.value === theme) ?? THEMES[2];
	const CurrentIcon = current.icon;

	const handleChange = (value: string | null) => {
		if (value)
			setTheme(value as ThemeValue);
	};

	if (variant === "submenu")
		return (
			<DropdownMenuSub>
				<DropdownMenuSubTrigger className="flex items-center gap-2">
					<CurrentIcon />
					{t(`current.${current.value}`)}
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuRadioGroup value={current.value} onValueChange={handleChange} className="flex flex-col items-center gap-2">
						{THEMES.map(({value, icon: Icon}) => (
							<DropdownMenuRadioItem key={value} value={value}>
								<Icon />
								{t(value)}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		);

	return (
		<Select value={current.value} onValueChange={handleChange}>
			<SelectTrigger className="w-auto" aria-label={t("theme")}>
				<CurrentIcon className="size-4" />
			</SelectTrigger>
			<SelectContent className="flex flex-col w-auto p-2">
				{THEMES.map(({value, icon: Icon}) => (
					<SelectItem key={value} value={value} className="flex items-center gap-2">
						<Icon />
						{t(value)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
