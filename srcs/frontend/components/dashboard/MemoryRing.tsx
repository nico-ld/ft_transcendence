type MemoryRingProps = {usedGb: number; totalGb: number; path: string};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MemoryRing({usedGb, totalGb, path}: MemoryRingProps) {
	const percent = Math.min(100, Math.max(0, Math.round((usedGb / totalGb) * 100)));
	const freegb = totalGb - usedGb;

	return (
		<div className="flex items-center gap-5">
			<div className="relative size-32 shrink-0">
				<svg viewBox="0 0 120 120" className="size-full -rotate-90" role="img" aria-label={`Memory usage ${percent}`}>
					<circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-border" />
					<circle
						cx="60" cy="60" r={RADIUS}
						fill="none"
						strokeWidth="10"
						strokeLinecap="round"
						className="stroke-primary"
						strokeDasharray={CIRCUMFERENCE}
						strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-2xl font-bold">{percent}</span>
					<span className="text-[10px] uppercase tracking-widest text-muted-foreground">memory</span>
				</div>
			</div>

			<dl className="space-y-1.5 text-sm">
				<div>
					<dt className="inline text-muted-foreground">Used </dt>
					<dd className="inline font-medium">{usedGb.toFixed(2)}</dd>
				</div>
				<div>
					<dt className="inline text-muted-foreground">Free </dt>
					<dd className="inline font-medium">{freegb.toFixed(2)}</dd>
				</div>
				<div>
					<dt className="inline text-muted-foreground">Path </dt>
					<dd className="inline font-medium">{path}</dd>
				</div>
			</dl>
		</div>
	);
}
