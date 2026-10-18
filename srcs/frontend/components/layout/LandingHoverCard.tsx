import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown } from "lucide-react";

export function LandingHoverCard({name}: {name: string}) {
	return (
		<HoverCard>
			<HoverCardTrigger delay={10} closeDelay={100} render={
				<Button variant="ghost">
					<h3>{name}</h3>
					<ChevronDown />
				</Button>
			}/>
			<HoverCardContent className="flex w-64 flex-col gap-0.5">
				<div className="font-semibold">This is an example of title</div>
				<div>This is an example of text</div>
				<div className="mt-1 text-xs text-muted-foreground">
					This is an example of subtitle
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
