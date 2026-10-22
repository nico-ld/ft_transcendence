import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeSwitch } from "@/components/layout/ThemeSwicth";
import { LegalFooter } from "@/components/landing/LegalFooter";

export default function LoginPage() {
	return (
		<main className="relative flex min-h-dvh flex-col overflow-hidden">
			<div className="absolute right-4 top-4">
				<ThemeSwitch />
			</div>
			<section className="flex flex-1 items-center justify-center">
				<LoginForm />
			</section>
			<footer className="py-4 text-center text-sm text-muted-foreground">
				<LegalFooter />
			</footer>
		</main>
	);
}
