import Link from 'next/link';

export function LandingFooter() {
	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex w-full flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<p>© 2026 Silk Space</p>
				<nav aria-label="Legal" className="flex gap-4">
					<Link href="#" className="hover:underline">Privacy Policy</Link>
					<span aria-hidden="true"> - </span>
					<Link href="#" className="hover:underline">Terms of Service</Link>
				</nav>
			</div>
		</footer>
	);
}
