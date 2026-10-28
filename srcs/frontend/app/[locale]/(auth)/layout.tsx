import { LegalFooter } from "@/components/legal/LegalFooter";

export default function authLayout({children}: {children: React.ReactNode}) {
	return (
		<main className="relative flex flex-1 flex-col">
			{children}
			<footer className="py-6 text-center text-sm text-muted-foreground">
				<LegalFooter />
			</footer>
		</main>
	);
}
