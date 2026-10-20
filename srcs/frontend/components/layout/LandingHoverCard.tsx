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
				<div className="font-semibold">Documentations</div>
				<div>Content not available here, please check another git branch</div>
				<div className="mt-1 text-xs text-muted-foreground">
					Someone told me my PR was to big..
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
