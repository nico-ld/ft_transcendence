import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { oauthLoginError } from "@/types/LoginError";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("login");
}

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
		<section className="flex flex-1 items-center justify-center">
			{/* not <LoginForm /> as fallback: rendered twice, its ids would be duplicated */}
			<Suspense fallback={null}>
				<LoginFormWithError searchParams={searchParams} />
			</Suspense>
		</section>
	);
}
