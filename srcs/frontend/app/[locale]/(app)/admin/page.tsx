import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { getCurrentUser, getUsers } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";

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
	if (viewer.role !== "admin")
		return redirect({ href: ROLE_HOME[viewer.role], locale });

	return (
		<DashboardShell role={viewer.role} username={viewer.username} avatarUrl={viewer.avatar ?? undefined}>
			{stats && (
				<StatsPanel
					stats={stats}
					extras={[{ label: t("extra"), value: users ? String(users.length) : "-" }]}
				/>
			)}
			<UserManagement users={users} viewer={viewer} />
		</DashboardShell>
	);
}
