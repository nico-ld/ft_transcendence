import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
	return (
		<main className="relative flex flex-1 flex-col">
			<section className="flex flex-1 items-center justify-center">
				<SignupForm />
			</section>
		</main>
	);
}
