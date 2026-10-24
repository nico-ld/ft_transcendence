"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/docs";
import { useTranslations } from "next-intl";

export function DocsToc({items}: {items: TocItem[]}) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const t = useTranslations("Docs");

	useEffect(() => {
		const headings = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting);
				if (visible.length > 0)
					setActiveId(visible[0].target.id);
			},
			{rootMargin: "0px 0px -70% 0px"}
		);

		headings.forEach((heading) => observer.observe(heading));
		return () => observer.disconnect();
	}, [items]);

	return (
		<nav aria-label="On this page">
			<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				{t("tocLabel")}
			</h2>
			<ul className="flex flex-col gap-2 text-sm">
				{items.map((item) => (
					<li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
						<a
							href={`#${item.id}`}
							aria-current={activeId === item.id ? "location" : undefined}
							className={cn(
								"block transition-colors hover:text:text-foreground",
								activeId === item.id
									? "font-medium text-foreground"
									: "text-muted-foreground"
							)}
						>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
