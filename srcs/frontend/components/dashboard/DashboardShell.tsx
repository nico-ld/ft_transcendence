import { Header } from "@/components/layout/Header";
import type { Role } from "@/lib/utils";

type DashboardShellProps = {
	role: Role;
	username: string;
	avatarUrl?: string;
	sidebar?: React.ReactNode;
	children: React.ReactNode;
};

export function DashboardShell({ role, username, avatarUrl, sidebar, children }: DashboardShellProps) {
	return (
		<>
			<Header role={role} username={username} avatarUrl={avatarUrl} />
			<main
				className={`mx-auto grid min-h-screen w-full max-w-6xl gap-5 px-4 pb-8 pt-20 md:px-6 ${
					sidebar ? "lg:grid-cols-[360px_1fr]" : ""
				}`}
			>
				{sidebar && <aside className="flex flex-col gap-5">{sidebar}</aside>}
				<section className="flex min-w-0 flex-row items-center justify-around gap-5">{children}</section>
			</main>
		</>
	);
}