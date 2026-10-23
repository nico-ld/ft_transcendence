import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";

import { getSystemStats } from "@/lib/stats";
import { getCurrentUser, getUsers } from "@/lib/backend";

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import type { User } from "@/types/User";

// REPLACE BY REAL USERS
const users: User[] = [
	{
		lastname: "Le Roux",
		name: "Nicolas",
		username: "Nico",
		avatar: "https://github.com/nico-ld.png",
		email: "nico@email.com",
		job: "software-engineer",
		createdAt: "2026-01-01"
	},
	{
		lastname: "LastName",
		name: "Alexandre",
		username: "Alexandre",
		avatar: "https://github.com/0verLighT.png",
		email: "alexandre@email.com",
		job: "data-analyst",
		createdAt: "2026-01-02"
	},
	{
		lastname: "LastName",
		name: "Titouan",
		username: "Titouan",
		avatar: "https://github.com/Tisaan.png",
		email: "titouan@email.com",
		job: "devops-engineer",
		createdAt: "2026-01-02"
	},
	{
		lastname: "LastName",
		name: "Mathis",
		username: "Mathis",
		avatar: "https://github.com/xth24.png",
		email: "mathis@email.com",
		job: "devops-engineer",
		createdAt: "2026-01-03"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User1",
		avatar: "No icons",
		email: "random@email.com",
		job: "accountant",
		createdAt: "2026-01-04"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User2",
		avatar: "",
		email: "random@email.com",
		job: "accountant",
		createdAt: "2026-01-05"
	},
	{
		lastname: "Du ponton de ligue 1",
		name: "Xavier",
		username: "Jean-benoit",
		avatar: "",
		email: "pantoufle@email.com",
		job: "accountant",
		createdAt: "2026-01-06"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User4",
		avatar: "",
		email: "random@email.com",
		job: "accountant",
		createdAt: "2026-01-07"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User5",
		avatar: "",
		email: "random@email.com",
		job: "accountant",
		createdAt: "2026-01-08"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User6",
		avatar: "",
		email: "random@email.com",
		job: "technicalriter",
		createdAt: "2026-01-09"
	}
]

export default async function AdminPage() {
	const [viewer, users, stats, t] = await Promise.all([
		getCurrentUser(),
		getUsers(),
		getSystemStats(),
		getTranslations("Stats")
	]);

	if (!viewer)
		redirect("/login");
	if (viewer.role !== "admin")
		redirect("/user");

	return (
		<>
		{/* SIMULATION USERNAME */}
		<DashboardShell role={viewer.role} username={viewer.username}>
			<StatsPanel
				stats={stats}
				extras={[{ label: t("extra"), value: users ? String(users.length) : "-" }]}
			/>
			<UserManagement users={users} viewer={viewer}/>
		</DashboardShell>
		</>
	);
}