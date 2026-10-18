import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-primary/15 via-background to-background" />

			<div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-20 text-center md:pt-28">
				<h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
					Your headline goes here
				</h1>
				<p className="max-w-2xl text-balance text-lg text-muted-foreground">
					One sentence that explains what Silk space does and who it is for.
				</p>

				<form action="/login" className="flex w-full max-w-md flex-col  gap-2 sm:flex-row">
					<label htmlFor="email" className="sr-only">Email address</label>
					<Input id="email" name="email" type="email" placeholder="you@email.com" required/>
					<Button type="submit" size="lg">Sign up for Silk space</Button>
				</form>
			</div>
		</section>
	);
}
