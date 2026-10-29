import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GuestBadge } from "@/components/layout/CustomBadge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/backend";
import { Role } from "@/types/User";
import { getLocale, getTranslations } from "next-intl/server";

export default function GuestPage() {
	return (
		<Suspense fallback={null}>
			<GuestDashboard />
		</Suspense>
	);
}

async function GuestDashboard() {
	const [user, locale, u] = await Promise.all([
		getCurrentUser(),
		getLocale(),
		getTranslations("Users")
	]);

	if (!user || user.role !== Role.GUEST)
		return redirect({ href: "/user", locale });

	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			<Card className="shadow-glow ring-border w-full">
				<CardHeader className="p-6">
					<CardTitle className="flex items-center gap-3 text-2xl">
						<GuestBadge />
						{u("guestTitle")}
					</CardTitle>
					<CardDescription className="text-base">
						{u("guestMessage")}
					</CardDescription>
				</CardHeader>
			</Card>
		</DashboardShell>
	);
}
