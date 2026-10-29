"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SilkSpaceLogo } from "@/components/ui/logo";
import { ThemeSwitch } from "@/components/layout/ThemeSwicth";

export function LandingHeader() {
	const [isTop, setIsTop] = useState(true);
	const t = useTranslations("Landing");

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
				<SilkSpaceLogo />

				<article className="flex items-center gap-2">
					<ThemeSwitch />
					<Link href="/signup" className={buttonVariants({variant: 'outline'})}>{t("signup")}</Link>
					<Link href="/login" className={buttonVariants({variant: 'default'})}>{t("signin")}</Link>
				</article>
			</section>
		</header>
	);
}
