"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login, ROLE_HOME} from "@/lib/auth";

export function LoginForm() {
	const router = useRouter();

	const [error, formAction, pending] = useActionState(
		async (_prev: string, formData: FormData) => {
			try {
				const result = await login({
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
		<form action={formAction} className="flex flex-col gap-4">
			<input
				className="bg-white dark:text-zinc-900 text-center"
				name="email"
				type="email"
				placeholder="Email"
				autoComplete="email"
				required
			/>
			<input
				className="bg-white dark:text-zinc-900 text-center"
				name="password"
				type="password"
				placeholder="Password"
				autoComplete="current-password"
				required
			/>
			{error && <p role="alert" className="text-red-500">{error}</p>}
			<button type="submit" disabled={pending}>
				{pending ? "Logging in..." : "Log in"}
			</button>
		</form>
	);
}
