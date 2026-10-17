import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { SilkSpaceLogo } from "../ui/logo";

const NAV = [
	{ href: '/docs', label: 'Documentation'},
	{ href: '#features', label: 'Features'}
];

export function LandingHeader() {
	return (
		<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
			<section className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
				<article className="flex items-center gap-6">
					<SilkSpaceLogo />
					<nav aria-label="Main" className="hidden items-center gap-4 text-sm md:flex">
						{NAV.map(({href, label}) => (
							<Link key={href} href={href} className="text-muted-foreground hover:text-foreground">
								{label}
							</Link>
						))}
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
