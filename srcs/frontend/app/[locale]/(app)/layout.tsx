import { LegalFooter } from "@/components/legal/LegalFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
	<main className="app-wrapper flex flex-1 flex-col">
		{children}
		<footer className="py-6 text-center text-sm text-muted-foreground">
			<LegalFooter />
		</footer>
	</main>
	</>
	);
}
