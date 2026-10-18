import Link from "next/link";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown } from "lucide-react";

function DocElem({title}: {title: string}) {
	return (
		<Link
			href="#"
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

export function LandingHoverCard() {
	return (
		<HoverCard>
			<HoverCardTrigger delay={10} closeDelay={100} render={
				<Button variant="ghost">
					<span>Resources</span>
					<ChevronDown />
				</Button>
			}/>
			<HoverCardContent className="flex w-75 flex-row gap-5">
				<article className="flex w-34 flex-col gap-3">
					<div className="text-muted-foreground">USAGE</div>
					<DocElem title="Overview"/>
					<DocElem title="Getting started"/>
					<DocElem title="Account & setting"/>
					<DocElem title="FAQ"/>
				</article>

				<article className="flex w-30 flex-col gap-3">
					<div className="text-muted-foreground">DOC</div>
					<DocElem title="Overview"/>
					<DocElem title="Structure"/>
					<DocElem title="API & Back-end"/>
					<DocElem title="Troubleshooting"/>
				</article>
			</HoverCardContent>
		</HoverCard>
	);
}
