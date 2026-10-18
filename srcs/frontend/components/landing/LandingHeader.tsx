import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { SilkSpaceLogo } from "../ui/logo";
import { LandingHoverCard } from "../layout/LandingHoverCard";

export function LandingHeader() {
	return (
		<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
			<section className="mx-auto flex h-14 w-full items-center justify-between px-4 md:px-6">
				<article className="flex items-center gap-6">
					<SilkSpaceLogo />
					<nav aria-label="Main" className="hidden items-center gap-4 text-sm md:flex">
						<LandingHoverCard name="Documentation" />
					</nav>
				</article>

				<article className="flex items-center gap-3">
					<Link href="/login" className="text-sm hover:underline">Sign in</Link>
					<Link href="/login" className={buttonVariants({variant: 'outline'})}>Sign up</Link>
				</article>
			</section>
		</header>
	);
}
