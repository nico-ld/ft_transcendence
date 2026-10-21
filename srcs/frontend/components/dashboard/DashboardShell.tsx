import { Header } from "@/components/layout/Header";
import { DashboardShellProps } from "@/types/DashboardShellProps"
import { Link } from "@/i18n/navigation";


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

				<footer className="py-4 text-center text-sm text-muted-foreground">
					<Link href="#" className="hover:underline">Privacy Policy</Link>
					<span aria-hidden="true"> - </span>
					<Link href="#" className="hover:underline">Terms of Service</Link>
				</footer>
			</main>
		</>
	);
}