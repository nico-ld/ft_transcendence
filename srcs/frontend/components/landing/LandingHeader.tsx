"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { SilkSpaceLogo } from "../ui/logo";
import { ThemeSwitch } from "../layout/ThemeSwicth";

export function LandingHeader({tab}: {tab: React.ReactNode}) {
	const [isTop, setIsTop] = useState(true);

	useEffect(() => {
		const onScroll = () => setIsTop(window.scrollY === 0);
		onScroll();
		window.addEventListener('scroll', onScroll, {passive: true});
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header 
			data-is-top={isTop}
			className="sticky top-0 z-40 border-b transition duration-300 bg-background/80 backdrop-blur data-[is-top=true]:bg-primary/15">
			<section className="mx-auto flex h-14 w-full items-center justify-between px-4 md:px-6">
				<article className="flex items-center gap-6">
					<SilkSpaceLogo />
					<nav aria-label="Main" className="hidden items-center gap-4 text-sm md:flex">
						{tab}
					</nav>
				</article>

				<article className="flex items-center gap-3">
					<ThemeSwitch />
					<Link href="/login" className={buttonVariants({variant: 'outline'})}>Sign in</Link>
				</article>
			</section>
		</header>
	);
}
