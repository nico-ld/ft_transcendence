"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// puts the search in the URL (/friends?q=bob), the page reads it and searches
export function FriendSearch({ defaultValue }: { defaultValue: string }) {
	const router = useRouter();
	const t = useTranslations("Friends");

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
		router.replace({ pathname: "/friends", query: q ? { q } : {} });
	}

	return (
		<form onSubmit={onSubmit} className="flex gap-2">
			<Input
				name="q"
				type="search"
				defaultValue={defaultValue}
				placeholder={t("searchPlaceholder")}
				aria-label={t("searchPlaceholder")}
				minLength={2}
				maxLength={20}
			/>
			{/* h-auto: stretches to the input's height (the button is h-8 by default) */}
			<Button type="submit" className="h-auto px-4">{t("search")}</Button>
		</form>
	);
}
