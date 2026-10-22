import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { StatsPanelProps } from "@/lib/stats";
import { MemoryRing } from "./MemoryRing";
import { WeekChart } from "./WeekChart";
import { useTranslations } from "next-intl";

function StatBlock({label, value}: {label: string; value: string}) {
	return (
		<div className="rounded-xl border p-3">
			<p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
			<p className="mt-1 text-xl font-semibold">{value}</p>
		</div>
	);
}

export function StatsPanel({stats, extras = []}: StatsPanelProps) {
	const t = useTranslations("Stats");

	return (
		<Card className="shadow-glow ring-border">
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<MemoryRing {...stats.memory} />

				<div className="grid grid-cols-2 gap-3">
					<StatBlock label="This week" value={stats.logTime.week} />
					<StatBlock label="This month" value={stats.logTime.month} />
				</div>

				<WeekChart data={stats.daily} />

				{extras.length > 0 && (
					<dl className="space-y-2 border-t pt-4 text-sm">
						{extras.map((item) => (
							<div key={item.label} className="flex justify-between">
								<dt className="text-muted-foreground">{item.label}</dt>
								<dd className="font-medium">{item.value}</dd>
							</div>
						))}
					</dl>
				)}
			</CardContent>
		</Card>
	);
}
