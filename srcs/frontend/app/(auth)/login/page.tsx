import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeSwitch } from "@/components/layout/ThemeSwicth";

export default function LoginPage() {
	return (
		<main className="relative min-h-screen overflow-hidden">
			<div className="absolute right-4 top-4">
				<ThemeSwitch />
			</div>
			<section className="min-h-screen flex items-center justify-center">
				<LoginForm />
			</section>
		</main>
	);
}
