import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { WorkspaceLink } from "@/components/dashboard/WorkspaceLink";
import { getCurrentUser } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default function UserPage() {
	return (
		<Suspense fallback={null}>
			<UserDashboard />
		</Suspense>
	);
}

async function UserDashboard() {
	const [user, stats] = await Promise.all([getCurrentUser(), getSystemStats()]);
	const t = await getTranslations("Common");

	// hypothesis : not logged in, or the session ended (logout, account deleted)
	if (!user)
		redirect("/login");
	// distinguishing since an admin has their own dashboard
	if (user.role !== "user")
		redirect(ROLE_HOME[user.role]);

	//I swear, those multi-lines returns are going to make me cry
	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			<StatsPanel stats={stats} />
			<WorkspaceLink href="/workspace" label={t("workSpace")}/>
		</DashboardShell>
	);
}
