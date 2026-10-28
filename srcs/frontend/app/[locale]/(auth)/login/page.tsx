import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeSwitch } from "@/components/layout/ThemeSwicth";
import { oauthLoginError } from "@/types/LoginError";

type LoginPageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ?error= is set by the backend when a 42 login fails (routers/oauth42.py)
async function LoginFormWithError({ searchParams }: LoginPageProps) {
	const { error } = await searchParams;
	return <LoginForm oauthError={oauthLoginError(error)} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
	return (
		<main className="relative flex flex-1 flex-col overflow-hidden">
			<div className="absolute right-4 top-4">
				<ThemeSwitch />
			</div>
			<section className="flex flex-1 items-center justify-center">
				<Suspense fallback={null}>
					<LoginFormWithError searchParams={searchParams} />
				</Suspense>
			</section>
		</main>
	);
}
