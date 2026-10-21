import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { getSystemStats } from "@/lib/stats";
import type { User } from "@/lib/types";

// REPLACE BY REAL USERS
const users: User[] = [
	{
		lastname: "Le Roux",
		name: "Nicolas",
		username: "Nico",
		avatar: "https://github.com/nico-ld.png",
		email: "nico@email.com",
		job: "Software Engineer",
		createdAt: "2026-01-01"
	},
	{
		lastname: "LastName",
		name: "Alexandre",
		username: "Alexandre",
		avatar: "https://github.com/0verLighT.png",
		email: "alexandre@email.com",
		job: "Data Analyst",
		createdAt: "2026-01-02"
	},
	{
		lastname: "LastName",
		name: "Titouan",
		username: "Titouan",
		avatar: "https://github.com/Tisaan.png",
		email: "titouan@email.com",
		job: "Devops Engineer",
		createdAt: "2026-01-02"
	},
	{
		lastname: "LastName",
		name: "Mathis",
		username: "Mathis",
		avatar: "https://github.com/xth24.png",
		email: "mathis@email.com",
		job: "Devops Engineer",
		createdAt: "2026-01-03"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User1",
		avatar: "No icons",
		email: "random@email.com",
		job: "Accountant",
		createdAt: "2026-01-04"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User2",
		avatar: "",
		email: "random@email.com",
		job: "Accountant",
		createdAt: "2026-01-05"
	},
	{
		lastname: "Du ponton de ligue 1",
		name: "Xavier",
		username: "Jean-benoit",
		avatar: "",
		email: "pantoufle@email.com",
		job: "Accountant",
		createdAt: "2026-01-06"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User4",
		avatar: "",
		email: "random@email.com",
		job: "Accountant",
		createdAt: "2026-01-07"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User5",
		avatar: "",
		email: "random@email.com",
		job: "Accountant",
		createdAt: "2026-01-08"
	},
	{
		lastname: "Random",
		name: "Guy",
		username: "User6",
		avatar: "",
		email: "random@email.com",
		job: "Technical Writer",
		createdAt: "2026-01-09"
	}
]

export default async function AdminPage() {
	const stats = await getSystemStats();

	return (
		<>
		{/* SIMULATION USERNAME */}
		<DashboardShell role="admin" username="Julien">
			<StatsPanel
				stats={stats}
				extras={[{ label: "Registered users", value: String(users.length) }]}
			/>
			<UserManagement users={users} />
		</DashboardShell>
		</>
	);
}