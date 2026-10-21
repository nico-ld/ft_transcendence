import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, House } from "lucide-react";
import type { DocNavItem } from "@/lib/docs";

const cardClass = "flex flex-col gap-1 rounded-md border p-4 transition-colors hover:bg-muted";

export function DocsPager({prev, next}: {prev: DocNavItem | null; next: DocNavItem | null})
{
	return (
		<nav
			aria-label="Pagination"
			className="mt-16 grid grid-cols-3 gap-4 border-t pt-6 sm:grid-cols-1[fr_auto_1fr]"
		>
			{/* Previous Page */}
			{prev ? (
				<Link href={prev.href} className={cardClass}>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<ChevronLeft className="size-3" /> Previous
					</span>
					<span className="font-medium">{prev.title}</span>
				</Link>
			) : (<span/>)}

			{/* Landing Page */}
			<Link
				href="/"
				className="order-last col-span-2 flex items-center justify-center gap-2 rounded-md border p-4 text-sm font-medium transition-colors hover:bg-muted sm:order-0 sm:col-span-1"
			>
				<House className="size-4" /> Home
			</Link>

			{/* Next Page */}
			{next ? (
				<Link href={next.href} className={`${cardClass} items-end text-right`}>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						Next <ChevronRight className="size-3" />
					</span>
					<span className="font-medium">{next.title}</span>
				</Link>
			) : (<span />)}
		</nav>
	);
}
