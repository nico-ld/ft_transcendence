import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
		<section className="app-wrapper min-h-screen">
			{children}
		</section>
		<footer className="py-4 text-center text-sm text-muted-foreground">
			<Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
			<span aria-hidden="true"> - </span>
			<Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
		</footer>
		</>
	);
}
