"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages, ChevronUp } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/types/Locale";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const LANGUAGE_NAMES: Record<Locale, string> = {
	en: "English",
	fr: "Français",
	es: "Español"
};

function LanguageOptions() {
	const t = useTranslations("Language");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	return (
		<DropdownMenuGroup>
			<DropdownMenuRadioGroup
				value={locale}
				onValueChange={(next) => router.replace(pathname, {locale: next as Locale})}
			>
				{routing.locales.map((code) => (
					<DropdownMenuRadioItem key={code} value={code}>
						{LANGUAGE_NAMES[code]}
					</DropdownMenuRadioItem>
				))}
			</DropdownMenuRadioGroup>
		</DropdownMenuGroup>
	);
}

function SubmenuLanguage() {
	const t = useTranslations("Language");

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Languages /> {t("language")}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent side="left" className="w-32">
				<LanguageOptions />
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}

function ButtonLanguage() {
	const t = useTranslations("Language");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger 
				render={<Button variant="ghost"><Languages /> {t("language")} <ChevronUp /></Button>}
			/>
			<DropdownMenuContent className="w-32">
				<LanguageOptions />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function LanguageSwitcher({variant = "button"}: {variant?: "button" | "submenu"}) {
	return (variant === "button" ? <ButtonLanguage /> : <SubmenuLanguage />);
}
