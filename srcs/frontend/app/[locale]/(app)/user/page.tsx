import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { WorkspaceLink } from "@/components/dashboard/WorkspaceLink";
import { getSystemStats } from "@/lib/stats";
import { getTranslations } from "next-intl/server";

export default async function UserPage() {
	const stats = await getSystemStats();
	const t = await getTranslations("Common");

	return (
		// SIMULATION USERNAME
		<DashboardShell role="user" username="nico">
			<StatsPanel stats={stats} />
			<WorkspaceLink href="/workspace" label={t("workSpace")}/>
		</DashboardShell>
	);
}