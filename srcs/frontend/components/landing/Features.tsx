import { Zap, Shield, Users, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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
	const t = useTranslations("Landing");

	return (
		<section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
			<h2 className="text-center text-3xl font-semibold tracking-tight">{t("features.title")}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				<FeatureCard Icon={Zap} title={t("features.fast.title")} text={
					<>
						{t.rich("features.fast.description", {strong: (chunks) => <strong>{chunks}</strong>})}
					</>
					}/>
				<FeatureCard Icon={Shield} title={t("features.secure.title")} text={
					<>
						{t.rich("features.secure.description", {strong: (chunks) => <strong>{chunks}</strong>})}
					</>
				}/>
				<FeatureCard Icon={Users} title={t("features.collaborative.title")} text={
					<>
						{t.rich("features.collaborative.description", {strong: (chunks) => <strong>{chunks}</strong>})}
					</>
				}/>
			</div>
		</section>
	);
}
