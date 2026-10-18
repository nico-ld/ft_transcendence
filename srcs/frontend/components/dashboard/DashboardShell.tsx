import { Header } from "@/components/layout/Header";
import type { Role } from "@/lib/utils";
import { LegalLink } from "@/components/layout/LegalLink";

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
			<main className="flex min-h-dvh flex-col">
				<div className="flex flex-1">
					<section className={`mx-auto grid  w-full max-w-7xl gap-5 px-4 pb-8 pt-20 md:px-6 ${
						sidebar ? "lg:grid-cols-[360px_1fr]" : ""
					}`} >
						{sidebar && <aside className="flex flex-col gap-5">{sidebar}</aside>}
						<article className="flex min-w-0 flex-row items-center justify-around gap-5">{children}</article>
					</section>
				</div>

				<footer className="py-4">
					<LegalLink />
				</footer>
			</main>
		</>
	);
}