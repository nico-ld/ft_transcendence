"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/types/Locale";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Languages } from "lucide-react";
import {
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger
} from "../ui/dropdown-menu";

const LANGUAGE_NAMES: Record<Locale, string> = {
	en: "English",
	fr: "Français",
	es: "Español"
};

export function SelectLanguage() {
	const t = useTranslations("Language");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Languages /> {t("language")}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-32">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={locale} 
						onValueChange={(next) => 
							router.replace(pathname, { locale: next as Locale })
						}
					>
						{routing.locales.map((code) => (
							<DropdownMenuRadioItem key={code} value={code}>
								{LANGUAGE_NAMES[code]}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
