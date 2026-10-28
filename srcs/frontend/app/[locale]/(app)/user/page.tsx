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
	const u = await getTranslations("Users");

	if (!user)
		return redirect({ href: "/login", locale });
	// distinguishing since an admin has their own dashboard
	if (user.role !== "user")
		return redirect({ href: ROLE_HOME[user.role], locale });

	//I swear, those multi-lines returns are going to make me cry
	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			{user.isGuest ? (
				<Card className="shadow-glow ring-border p-6">
					<div className="space-y-4">
						<h2 className="flex items-center gap-3 text-2xl font-semibold">
							<GuestBadge />
							{u("guest")}
						</h2>
						<p className="text-sm text-muted-foreground">
							{u("guestMessage")}
						</p>
					</div>
				</Card>
			) : (
				<>
					{stats && <StatsPanel stats={stats} />}
					<WorkspaceLink href="/workspace" label={t("workSpace")}/>
				</>
			)}
		</DashboardShell>
	);
}
