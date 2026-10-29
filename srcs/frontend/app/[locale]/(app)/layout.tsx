import { LegalFooter } from "@/components/legal/LegalFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-wrapper flex h-dvh flex-1 flex-col">
	<section className="flex min-h-0 flex-1 flex-col">
		{children}
	</section>
	<footer className="shrink-0 py-4 text-center text-sm text-muted-foreground">
		<LegalFooter />
	</footer>
	</main>
	);
}
