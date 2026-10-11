const DAYS = ["M", "T", "W", "T", "F", "S",  "S"]

export function WeekChart({ data }: {data: number[]}) {
	const max = Math.max(...data, 1);

	return (
		<div>
			<p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Daily log time</p>
			<div className="flex h-16 items-end gap-2">
				{data.map((hours, i) => (
					<div
						key={i}
						title={`${hours}h`}
						className="flex-1 rounded-md bg-primary border"
						style={{ height: `${(hours / max) * 100}%`}}
					/>
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
