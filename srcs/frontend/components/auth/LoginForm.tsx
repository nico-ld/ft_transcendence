"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Login} from "@/app/actions/auth";
import { Button } from "../ui/button";
import { ROLE_HOME } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { TriangleAlert } from "lucide-react";

function ConnectionFailed({ error }: {error: string;}) {
	return (
		<Alert variant="destructive" className="max-w-wd bg-muted/50">
			<TriangleAlert />
			<AlertTitle>Connection Failed</AlertTitle>
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	);
}

export function LoginForm() {
	const router = useRouter();

	const [error, formAction, pending] = useActionState(
		async (_prev: string, formData: FormData) => {
			try {
				const result = await Login({
					email: String(formData.get("email")),
					password: String(formData.get("password"))
				});
				if (!result)
					return "Invalid email or password.";
				router.replace(ROLE_HOME[result.role]);
				return "";
			} catch {
				return "Something went wrong. Please try again.";
			}
		},
		""
	);

	return (
		<div className="w-72 h-auto">
			<div className="mb-4" aria-live="polite">
				{error && <ConnectionFailed error={error} />}
			</div>
		
			<form action={formAction} className="flex flex-col gap-4 items-center justify-center ">
				<input
					className="min-w-50 bg-white dark:text-zinc-900 text-center"
					name="email"
					type="email"
					placeholder="Email"
					autoComplete="email"
					required
				/>
				<input
					className="min-w-50 bg-white dark:text-zinc-900 text-center"
					name="password"
					type="password"
					placeholder="Password"
					autoComplete="current-password"
					required
				/>
				<Button type="submit" variant="outline" className="min-w-40" disabled={pending}>
					{pending ? "Logging in " : "Log in"}
					{pending && <Spinner />}
				</Button>
			</form>
		</div>
	);
}
