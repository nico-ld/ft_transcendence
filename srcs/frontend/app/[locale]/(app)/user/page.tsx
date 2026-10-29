import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { WorkspaceLink } from "@/components/dashboard/WorkspaceLink";
import { GuestBadge } from "@/components/layout/CustomBadge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/backend";
import { getSystemStats } from "@/lib/stats";
import { ROLE_HOME } from "@/lib/utils";
import { Role } from "@/types/User";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("user");
}

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
	const u = await getTranslations("Users");

	if (!user)
		return redirect({ href: "/login", locale });
	// Guests go to their own page, admins to admin dashboard
	if (user.role === Role.GUEST)
		return redirect({ href: "/guest", locale });
	if (user.role !== Role.USER)
		return redirect({ href: ROLE_HOME[user.role], locale });

	//I swear, those multi-lines returns are going to make me cry
	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			{
				<>
					{stats && <StatsPanel stats={stats} />}
					<WorkspaceLink href="/workspace" label={t("workSpace")}/>
				</>
			}
		</DashboardShell>
	);
}
