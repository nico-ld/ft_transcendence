import { Link } from "@/i18n/navigation";
import { buttonVariants } from "../ui/button";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-primary/15 via-100% to-background" />

			<article className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-20 text-center md:pt-28">
				<h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
					Ready to use work sessions for fast past environments
				</h1>
				<p className="max-w-2xl text-balance text-lg text-muted-foreground">
					A turnkey solution for your business. Manage your teams and work sessions
					in just a few clicks, all from one central place.
				</p>

				<div className="flex w-full max-w-md flex-col justify-center gap-2 sm:flex-row">
					<Link href="/login" className={`w-3/4 h-10 text-[1.1rem] ${buttonVariants()}`}>Sign in to Silk Space</Link>
				</div>
			</article>
		</section>
	);
}
