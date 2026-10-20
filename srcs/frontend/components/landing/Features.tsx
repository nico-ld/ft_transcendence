import { Zap, Shield, Users, type LucideIcon } from "lucide-react";

function FeatureCard({Icon, title, text}: {Icon: LucideIcon; title: string; text: React.ReactNode}) {
	return (
		<article className="rounded-xl border bg-card p-6">
			<div className="w-1/2 flex gap-5">
				<div className=" rounded-xl border bg-card p-3"><Icon className="relative"/></div>
				<h3 className="mt-4 font-medium">{title}</h3>
			</div>
			<p className="mt-2 text-sm text-muted-foreground">{text}</p>
		</article>
	);
}

export function Features() {
	return (
		<section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
			<h2 className="text-center text-3xl font-semibold tracking-tight">Everything in one place</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				<FeatureCard Icon={Zap} title="Fast" text={
					<>
						<strong>Silk Space</strong> is designed to be intuitive, fast and efficient in your everyday
						work. Create, edit or delete a session in under 3 minutes. With quick and direct access to your
						workspace, everything you need is always just a few clicks away. Spend less time managing
						your workspace and more time focusing on what matters.
					</>
					}/>
				<FeatureCard Icon={Shield} title="Secure" text={
					<>
						Your data stays on your machine. <strong>Silk Space</strong> doesn't store or collect your
						information, giving you full control over your workspace. Each user session is isolated from the others,
						helping prevent unauthorized access and privilege escalation. With privacy and security built into its design,
						<strong>Silk Space</strong> keeps your workspace yours and your data under your control.
					</>
				}/>
				<FeatureCard Icon={Users} title="Collaborative" text={
					<>
						<strong>Silk Space</strong> fosters efficient collaboration and stronger working relationships.
						Managers can quickly adapt a workspace to meet changing roles and project requirements, ensuring that
						every team is organized for the right task at the right time. With minimal effort and a low adaptation
						cost, teams can stay flexible, respond to new challenges, and focus on what matters most: working together efficiently.
					</>
				}/>
			</div>
		</section>
	);
}
