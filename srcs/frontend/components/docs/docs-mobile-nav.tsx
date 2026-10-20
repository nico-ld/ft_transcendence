"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DocNavSection } from "@/lib/docs";
import { DocsNav } from "./docs-nav";

export function DocsMobileNav({sections}: {sections: DocNavSection[]}) {
	const pathname = usePathname();

	return (
		<details
			key={pathname}
			className="group mb-8 rounded-md border md:hidden"
		>
			<summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
				Documentation
				<ChevronDown className="size-4 transition-transform group-open:rotate-180" />
			</summary>
			<div className="border-t p-4">
				<DocsNav sections={sections} />
			</div>
		</details>
	);
}
