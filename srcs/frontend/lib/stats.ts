import { backendFetch } from "./backend";

export type SystemStats = {
	memory: {usedGb: number; totalGb: number; path: string};
	logTime: {week: string; month: string};
	daily: number[];
};

export type ExtraStat = {label: string; value: string};

export type StatsPanelProps = {
	stats: SystemStats;
	extras?: ExtraStat[];
};

export async function getSystemStats(): Promise<SystemStats | null> {
	const res = await backendFetch("/stats/me");
	return res.ok ? ((await res.json()) as SystemStats) : null;
}
