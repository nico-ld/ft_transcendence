import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatBlock, StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrafanaModal } from "@/components/dashboard/GrafanaModal";
import { WorkspaceLink } from "@/components/dashboard/WorkspaceLink";
import { getCurrentUser, getUsers } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";
import { Role } from "@/types/User";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("admin");
}

export default function AdminPage() {
	return (
		<Suspense fallback={null}>
			<AdminDashboard />
		</Suspense>
	);
}

// reads the session, so it renders at request time, inside the Suspense above
async function AdminDashboard() {
	const [viewer, users, stats, locale, t, s] = await Promise.all([
		getCurrentUser(),
		getUsers(),
		getSystemStats(),
		getLocale(),
		getTranslations("Common"),
		getTranslations("Stats")
	]);

	if (!viewer)
		return redirect({ href: "/login", locale });
	if (viewer.role !== Role.ADMIN)
		return redirect({ href: ROLE_HOME[viewer.role], locale });

	// only accounts with a job have a workspace, so metrics in grafana
	const workspaceUsers = (users ?? [])
		.filter((user) => user.job)
		.map(({ id, username }) => ({ id, username }));

	return (
		<DashboardShell role={viewer.role} username={viewer.username} avatarUrl={viewer.avatar ?? undefined}>
			<div className="flex flex-col gap-5">
				<Card className="ring-border">
					<CardHeader>
						<CardTitle>{s("overview")}</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-3">
							<StatBlock label={s("registered")} value={users ? String(users.length) : "-"} />
							<StatBlock label={s("workspaces")} value={users ? String(workspaceUsers.length) : "-"} />
						</div>
						<GrafanaModal users={workspaceUsers} />
					</CardContent>
				</Card>
				{/* an admin without a job has no workspace so we dont show stats */}
				{viewer.job && stats && (
					<>
						<StatsPanel stats={stats} />
						<WorkspaceLink href="/workspace" label={t("workSpace")} />
					</>
				)}
			</div>
			<UserManagement users={users} viewer={viewer} />
		</DashboardShell>
	);
}
