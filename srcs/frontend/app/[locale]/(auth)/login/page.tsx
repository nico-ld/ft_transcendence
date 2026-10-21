import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeSwitch } from "@/components/layout/ThemeSwicth";
import { Link } from "@/i18n/navigation";

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
				<Link href="#" className="hover:underline">Privacy Policy</Link>
				<span aria-hidden="true"> - </span>
				<Link href="#" className="hover:underline">Terms of Service</Link>
			</footer>
		</main>
	);
}
