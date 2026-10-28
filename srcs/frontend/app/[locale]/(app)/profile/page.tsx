import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PasswordForm } from "@/components/users/PasswordForm";
import { ProfileForm } from "@/components/users/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/backend";
import { Role } from "@/types/User";

export default function ProfilePage() {
	return (
		<Suspense fallback={null}>
			<Profile />
		</Suspense>
	);
}

// reads the session, so it renders at request time, inside the Suspense above
async function Profile() {
	const [user, locale, t, h, u] = await Promise.all([
		getCurrentUser(),
		getLocale(),
		getTranslations("Profile"),
		getTranslations("Header"),
		getTranslations("Users")
	]);

	if (!user)
		return redirect({ href: "/login", locale });

	const account = [
		{ label: t("email"), value: user.email },
		{ label: t("role"), value: h(user.role) },
		{ label: u("userInfo.job"), value: user.role === Role.GUEST ? u("guest") : (user.job ? u(`jobList.${user.job}`) : u("noJob")) },
		{
			label: t("memberSince"),
			value: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(user.createdAt))
		}
	];

	return (
		<DashboardShell role={user.role} username={user.username} avatarUrl={user.avatar ?? undefined}>
			<div className="flex w-full max-w-3xl flex-col gap-5 md:flex-row md:items-start">
				<Card className="flex-1 shadow-glow ring-border">
					<CardHeader>
						<CardTitle>{t("title")}</CardTitle>
						<CardDescription>{t("description")}</CardDescription>
					</CardHeader>
					<CardContent>
						<ProfileForm user={user} />
					</CardContent>
				</Card>

				<div className="flex flex-1 flex-col gap-5">
					<Card className="shadow-glow ring-border">
						<CardHeader>
							<CardTitle>{t("account")}</CardTitle>
						</CardHeader>
						<CardContent>
							<dl className="space-y-2 text-sm">
								{account.map((item) => (
									<div key={item.label} className="flex justify-between gap-4">
										<dt className="text-muted-foreground">{item.label}</dt>
										<dd className="min-w-0 break-all text-right font-medium">{item.value}</dd>
									</div>
								))}
							</dl>
						</CardContent>
					</Card>

					<Card className="shadow-glow ring-border">
						<CardHeader>
							<CardTitle>{t("password.title")}</CardTitle>
							{user.hasPassword && <CardDescription>{t("password.description")}</CardDescription>}
						</CardHeader>
						<CardContent>
							{user.hasPassword
								? <PasswordForm />
								: <p className="text-sm text-muted-foreground">{t("password.noPassword")}</p>}
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardShell>
	);
}
