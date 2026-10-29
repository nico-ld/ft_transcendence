import { Header } from "@/components/layout/Header";
import { DashboardShellProps } from "@/types/DashboardShellProps"
import { cn } from "cn";


export function DashboardShell({ role, username, avatarUrl, sidebar, children }: DashboardShellProps) {
	return (
		<>
			<Header role={role} username={username} avatarUrl={avatarUrl} />
			<section className={cn(
				"mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 px-4 pb-4 pt-4 lg:pt-20 md:px-6",
				"lg:min-h-0 lg:grid-rows-1",
				sidebar && "lg:grid-cols-[360px_1fr]"
			)}>
				{sidebar && <aside className="flex flex-col gap-5">{sidebar}</aside>}
				<article className="flex min-w-0 flex-col gap-5 lg:min-h-0 lg:flex-row lg:justify-center">
					{children}
				</article>
			</section>
		</>
	);
}