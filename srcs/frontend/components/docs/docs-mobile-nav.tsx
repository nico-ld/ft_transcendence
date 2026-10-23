"use client";

import { usePathname } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { DocNavSection } from "@/lib/docs";
import { DocsNav } from "./docs-nav";
import { useTranslations } from "next-intl";

export function DocsMobileNav({sections}: {sections: DocNavSection[]}) {
	const pathname = usePathname();
	const t = useTranslations("Docs");

	return (
		<details
			key={pathname}
			className="group mb-8 rounded-md border md:hidden"
		>
			<summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
				{t("documentation")}
				<ChevronDown className="size-4 transition-transform group-open:rotate-180" />
			</summary>
			<div className="border-t p-4">
				<DocsNav sections={sections} />
			</div>
		</details>
	);
}
