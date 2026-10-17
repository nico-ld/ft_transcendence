import Link from 'next/link';

const LINKS = [
	{href: '/privacy', label: 'Privacy Policy'},
	{href: '/terms', label: 'Terms of Service'}
]

export function LandingFooter() {
	return (
		<footer className="border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 md:flex-row md:px-6">
				<p>© {new Date().getFullYear()} Silk Space</p>
				<nav aria-label="Legal" className="flex gap-4">
					{LINKS.map(({href, label}) => (
						<Link key={href} href={href} className="hover:underliner">{label}</Link>
					))}
				</nav>
			</div>
		</footer>
	);
}
