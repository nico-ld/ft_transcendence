import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChevronDown } from "lucide-react";
import { DocNavSection } from "@/types/Doc";

export function LandingHoverCard({sections}: {sections: DocNavSection[]}) {
	const t = useTranslations("Landing");
	const d = useTranslations("Docs.sections");

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
							{d(section.id)}
						</div>
						{section.items.map((item) => (
							<Link key={item.href} href={item.href} className="group w-full font-semibold">
								<span
									className="relative inline-block
										after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current
										after:origin-right after:scale-x-0
										after:transition-transform after:duration-300 after:ease-out
										group-hover:after:origin-left group-hover:after:scale-x-100
										group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100
										motion-reduce:after:transition-none"
								>
									{item.title}
								</span>
							</Link>
						))}
					</article>
				))}
			</HoverCardContent>
		</HoverCard>
	);
}
