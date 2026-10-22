import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function WorkspaceLink({href, label}: {href: string; label: string}) {
	return (
		<Link
			href={href}
			className="group h-25 flex items-center gap-4 rounded-xl border border-highlight px-8 py text-lg font-medium text-highlight transition hover:-translate-y-0.5 hover:bg-highlight hover:text-highlight-foreground"
		>
			{label}
			<ArrowRight className="transition-transform group-hover:translate-x-2" />
		</Link>
	);
}