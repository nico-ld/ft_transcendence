import { getLocale } from "next-intl/server";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHoverCard } from "@/components/layout/LandingHoverCard";
import { getDocNav } from "@/lib/docs";

export default async function Home() {
	const locale = await getLocale();

	return (
	<div className="flex flex-1 flex-col">
		<LandingHeader tab={<LandingHoverCard sections={getDocNav(locale)} />}/>
		<main className="flex-1">
			<Hero />
			<Features />
		</main>
		<LandingFooter />
	</div>
	);
}
