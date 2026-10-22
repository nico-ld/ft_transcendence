import { useTranslations } from "next-intl";
import { 
	Tooltip, 
	TooltipContent,
	TooltipTrigger
} from "../ui/tooltip";

const DAYS = ["M", "T", "W", "T", "F", "S",  "S"]

export function WeekChart({ data }: {data: number[]}) {
	const max = Math.max(...data, 1);
	const t = useTranslations("Stats");

	return (
		<div>
			<p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{t("weekLabel")}</p>
			<div className="flex h-16 items-end gap-2">
				{data.map((hours, i) => (
				<Tooltip key={i}>
						<TooltipTrigger render={<div
							key={i}
							className="flex-1 rounded-md bg-primary border"
							style={{ height: `${(hours / max) * 100}%`}}
						/>} />
						<TooltipContent>
							<p className="font-bold">{`${hours}h`}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</div>
			<div className="mt-1 flex gap-2 text-[10px] text-muted-foreground">
				{data.map((_, i) => (
					<span key={i} className="flex-1 text-center">{DAYS[i]}</span>
				))}
			</div>
		</div>
	);
}
