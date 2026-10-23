import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown } from "lucide-react";
import { DocNavSection } from "@/types/Doc";

function DocElem({title, href}: {title: string; href: string}) {
	return (
		<Link
			href={href}
			className="relative w-fit font-semibold
						after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current
						after:origin-right hover:after:origin-left after:scale-x-0
						after:transition-transform after:duration-300 after:ease-out
						hover:after:scale-x-100 focus-visible:after:scale-x-100"
		>
			{title}
		</Link>
	);
}

export function LandingHoverCard({sections}: {sections: DocNavSection[]}) {
	const t = useTranslations("Landing");

	return (
		<HoverCard>
			<HoverCardTrigger delay={10} closeDelay={100} render={
				<Button variant="ghost">
					<span>{t("resources")}</span>
					<ChevronDown />
				</Button>
			}/>
			<HoverCardContent className="flex w-auto flex-row gap-5">
				{sections.map((section) => (
					<article key={section.id} className="flex min-w-32 flex-col gap-3">
						<div className="uppercase text-muted-foreground">
							{section.label}
						</div>
						{section.items.map((item) => (
							<DocElem key={item.href} title={item.title} href={item.href} />
						))}
					</article>
				))}
			</HoverCardContent>
		</HoverCard>
	);
}
