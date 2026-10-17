import { Zap, Shield, Users, type LucideIcon } from "lucide-react";

const FEATURES: {icon: LucideIcon; title: string; text: string}[] = [
	{icon: Zap, title: 'Fast', text: 'Short description of the first benefit.'},
	{icon: Shield, title: 'Secure', text: 'Short description of the Second benefit.'},
	{icon: Users, title: 'Collaborative', text: 'Short description of the third benefit.'}
];

export function Features() {
	return (
		<section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
			<h2 className="text-center text-3xl font-semibold tracking-tight">Everything in one place</h2>
			<div className="mt-12 grid gap-6 mf:grid-cols-3">
				{FEATURES.map(({icon: Icon, title, text}) => (
					<Icon className="rounded-xl border bg-card p-6">
						<h3 className="mt-4 font-medium">{title}</h3>
						<p className="mt-2 text-sm text-muted-foreground">{text}</p>
					</Icon>
				))}
			</div>
		</section>
	);
}
