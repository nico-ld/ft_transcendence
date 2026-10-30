import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsPanelProps } from "@/lib/stats";
import { MemoryRing } from "@/components/dashboard/MemoryRing";
import { WeekChart } from "@/components/dashboard/WeekChart";
import { useTranslations } from "next-intl";

export function StatBlock({label, value}: {label: string; value: string}) {
	return (
		<div className="rounded-xl border p-3">
			<p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
			<p className="mt-1 text-xl font-semibold">{value}</p>
		</div>
	);
}

export function StatsPanel({stats}: StatsPanelProps) {
	const t = useTranslations("Stats");

	return (
		<Card className="h-fit ring-border">
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<MemoryRing {...stats.memory} />

				<div className="grid grid-cols-2 gap-3">
					<StatBlock label={t("week")} value={stats.logTime.week} />
					<StatBlock label={t("month")} value={stats.logTime.month} />
				</div>

				<WeekChart data={stats.daily} />
			</CardContent>
		</Card>
	);
}
