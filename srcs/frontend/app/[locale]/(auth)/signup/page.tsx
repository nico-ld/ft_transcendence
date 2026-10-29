import { SignupForm } from "@/components/auth/SignupForm";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("signup", "/signup");
}

export default function SignupPage() {
	return (
		<section className="flex flex-1 items-center justify-center">
			<SignupForm />
		</section>
	);
}
