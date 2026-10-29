import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { GrafanaModal } from "@/components/dashboard/GrafanaModal";
import { getCurrentUser, getUsers } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";
import { Role } from "@/types/User";
import { Header } from "@/components/layout/Header";

export default function AdminPage() {
	return (
		<Suspense fallback={null}>
			<AdminDashboard />
		</Suspense>
	);
}

// reads the session, so it renders at request time, inside the Suspense above
async function AdminDashboard() {
	const [viewer, users, stats, locale, t] = await Promise.all([
		getCurrentUser(),
		getUsers(),
		getSystemStats(),
		getLocale(),
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
				{stats && (
					<StatsPanel
						stats={stats}
						extras={[{ label: t("extra"), value: users ? String(users.length) : "-" }]}
					/>
				)}
				<GrafanaModal users={workspaceUsers} />
			</div>
			<UserManagement users={users} viewer={viewer} />
		</DashboardShell>
	);
}
