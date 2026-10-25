import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { WorkspaceLink } from "@/components/dashboard/WorkspaceLink";
import { getCurrentUser } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default function UserPage() {
	return (
		<Suspense fallback={null}>
			<UserDashboard />
		</Suspense>
	);
}

async function UserDashboard() {
	const [user, stats, locale] = await Promise.all([getCurrentUser(), getSystemStats(), getLocale()]);
	const t = await getTranslations("Common");

	if (!user)
		return redirect({ href: "/login", locale });
	// distinguishing since an admin has their own dashboard
	if (user.role !== "user")
		return redirect({ href: ROLE_HOME[user.role], locale });

	//I swear, those multi-lines returns are going to make me cry
	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			<StatsPanel stats={stats} />
			<WorkspaceLink href="/workspace" label={t("workSpace")}/>
		</DashboardShell>
	);
}
