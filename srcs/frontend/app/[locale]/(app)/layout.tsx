import { LegalFooter } from "@/components/legal/LegalFooter";
import { RealtimeProvider } from "@/components/layout/RealtimeProvider";

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
