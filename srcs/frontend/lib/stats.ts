export type SystemStats = {
	memory: {usedGb: number; totalGb: number; path: string};
	logTime: {week: string; month: string};
	daily: number[]; // Hours per day, Monday -> Sunday
};

export type ExtraStat = {label: string; value: string};

export type StatsPanelProps = {
	stats: SystemStats;
	extras?: ExtraStat[];
};


// TMP : replace it with a real API call
export async function getSystemStats(): Promise<SystemStats> {
	return {
		memory: {usedGb: 8.9, totalGb: 33, path: "/home/user"},
		logTime: {week: "22h12", month: "92h12"},
		daily: [7, 7, 7, 1.12, 0, 0, 0]
	};
}
