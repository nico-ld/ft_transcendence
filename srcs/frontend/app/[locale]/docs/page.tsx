import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getDocNav } from "@/lib/docs";

export default async function DocsIndexPage() {
	const locale = await getLocale();
	const first = getDocNav(locale).find((s) => s.items.length > 0)?.items[0];
	redirect({href: first ? first.href : "/", locale});
}
