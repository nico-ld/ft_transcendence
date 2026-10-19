"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import type { DocNavSection } from "@/lib/docs";

export function DocsNav({sections}: {sections: DocNavSection[]}) {
	const pathname = usePathname();

	return (
		<div className="flex felx-col gap-6">
			{sections.map((section) => (
				<div key={section.id}>
					<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{section.label}
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
