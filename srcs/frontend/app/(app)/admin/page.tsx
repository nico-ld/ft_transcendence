import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { getSystemStats } from "@/lib/stats";
import type { User } from "@/lib/types";

// REPLACE BY REAL USERS
const users: User[] = [
	{
		username: "Nico",
		avatar: "https://github.com/nico-ld.png",
		email: "nico@email.com",
		createdAt: "2026-01-01"
	},
	{
		username: "Alexandre",
		avatar: "https://github.com/0verLighT.png",
		email: "alexandre@email.com",
		createdAt: "2026-01-02"
	},
	{
		username: "Titouan",
		avatar: "https://github.com/Tisaan.png",
		email: "titouan@email.com",
		createdAt: "2026-01-02"
	},
	{
		username: "Mathis",
		avatar: "https://github.com/xth24.png",
		email: "mathis@email.com",
		createdAt: "2026-01-03"
	},
	{
		username: "User1",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-04"
	},
	{
		username: "User2",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-05"
	},
	{
		username: "User3",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-06"
	},
	{
		username: "User4",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-07"
	},
	{
		username: "User5",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-08"
	},
	{
		username: "User6",
		avatar: "No icons",
		email: "random@email.com",
		createdAt: "2026-01-09"
	}
]

export default async function AdminPage() {
	const stats = await getSystemStats();

	return (
		// SIMULATION USERNAME
		<DashboardShell
			role="admin"
			username="Julien"
		>
			<StatsPanel
				stats={stats}
				extras={[{ label: "Registered users", value: String(users.length) }]}
			/>
			<UserManagement users={users} />
		</DashboardShell>
	);
}