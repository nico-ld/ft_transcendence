import { Button } from '@/components/ui/button';
import { SilkSpaceLogo } from '@/components/ui/logo';
import Link from 'next/link';

export default function Home() {
	return (
	<main className="relative flex min-h-dvh min-w-screen flex-col">
		<header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
		{/* Left area : Logo & other pages */}
			<article className="flex flex-row gap-5 items-center">
				<SilkSpaceLogo />
				<div>
					<Link href="#" className="hover:underline">
						<h1>Documentation</h1>
					</Link>
				</div>
			</article>

		{/* Right Area : Sign in */}
			<article>
				<Button className="rounded-sm">
					<Link href="/login">Sign up</Link>
				</Button>
			</article>
		</header>

		<section className="flex flex-1">
		</section>

		<footer className="py-4 text-center text-sm text-muted-foreground">
			<Link href="#" className="hover:underline">Privacy Policy</Link>
			<span aria-hidden="true"> - </span>
			<Link href="#" className="hover:underline">Terms of Service</Link>
		</footer>
	</main>
	);
}
