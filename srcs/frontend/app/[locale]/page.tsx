import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHoverCard } from "@/components/layout/LandingHoverCard";
import { getDocNav } from "@/lib/docs";

export default function Home() {
	return (
	<div className="flex min-h-dvh flex-col">
		<LandingHeader tab={<LandingHoverCard sections={getDocNav()} />}/>
		<main className="flex-1">
			<Hero />
			<Features />
		</main>
		<LandingFooter />
	</div>
	);
}
