import type { Metadata } from "next";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { RealtimeProvider } from "@/components/layout/RealtimeProvider";

// every page here is behind a login: search engines would only see a redirect,
// so they are told not to index them or follow their links
export const metadata: Metadata = {
	robots: { index: false, follow: false }
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RealtimeProvider>
	<main className="app-wrapper flex flex-1 flex-col">
		{children}
		<footer className="py-6 text-center text-sm text-muted-foreground">
			<LegalFooter />
		</footer>
	</main>
	</RealtimeProvider>
	);
}
