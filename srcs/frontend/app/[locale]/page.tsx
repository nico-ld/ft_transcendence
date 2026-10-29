import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { languageAlternates } from "@/lib/metadata";

// the site's title and description (root layout), with the landing's language links
export async function generateMetadata(): Promise<Metadata> {
	return { alternates: await languageAlternates("/") };
}

export default function Home() {
	return (
	<div className="flex flex-1 flex-col">
		<LandingHeader />
      <main className="flex-1">
			<Hero />
			<Features />
		</main>
		<LandingFooter />
	</div>
	);
}
