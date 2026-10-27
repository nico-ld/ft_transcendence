"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import type { DocNavSection } from "@/types/Doc";

export function DocsNav({sections}: {sections: DocNavSection[]}) {
	const pathname = usePathname();
	const t = useTranslations("Docs.sections");

	return (
		<div className="flex flex-col gap-6">
			{sections.map((section) => (
				<div key={section.id}>
					<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{t(section.id)}
					</h2>
					<ul className="flex flex-col gap-1">
						{section.items.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									aria-current={pathname === item.href ? "page" : undefined}
									className={cn(
										"block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
										pathname === item.href
											? "bg-muted font-medium text-foreground"
											: "text-muted-foreground"
									)}
								>
									{item.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
